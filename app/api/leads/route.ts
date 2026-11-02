import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import { leadReference, leadSchema } from "@/lib/leads";

export const runtime = "nodejs";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 6;
const hits = new Map<string, { count: number; resetAt: number }>();

function rateLimit(key: string): boolean {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt < now) {
    hits.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_REQUESTS) return false;
  entry.count += 1;
  return true;
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() ?? "unknown";
}

export async function POST(request: Request) {
  if (!rateLimit(clientKey(request))) {
    return NextResponse.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request body." },
      { status: 400 },
    );
  }

  // Honeypot: accept silently so bots do not learn the trap, but store nothing.
  if (
    payload &&
    typeof payload === "object" &&
    typeof (payload as { trap?: unknown }).trap === "string" &&
    (payload as { trap: string }).trap.trim() !== ""
  ) {
    console.warn("[leads] honeypot triggered");
    return NextResponse.json({ ok: true, reference: leadReference(), demo: false });
  }

  const parsed = leadSchema.safeParse(payload);
  if (!parsed.success) {
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? "form");
      fieldErrors[key] = fieldErrors[key] ?? [];
      fieldErrors[key].push(issue.message);
    }
    return NextResponse.json(
      { ok: false, error: "Please check the form.", fieldErrors },
      { status: 400 },
    );
  }

  const lead = parsed.data;
  const reference = leadReference();

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || !key) {
    // Demo mode: the site works end-to-end without a database configured.
    console.info("[leads] demo capture", { reference, ...lead });
    return NextResponse.json({ ok: true, reference, demo: true });
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    const { error } = await supabase.from("leads").insert({
      reference,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      exam_slug: lead.examSlug || null,
      exam_code: lead.examCode || null,
      quantity: lead.quantity,
      city: lead.city || null,
      target_date: lead.targetDate || null,
      company: lead.company || null,
      gstin: lead.gstin || null,
      message: lead.message || null,
      intent: lead.intent,
      source: lead.source || null,
      status: "new",
      user_agent: request.headers.get("user-agent") ?? null,
    });

    if (error) {
      console.error("[leads] insert failed", error.message);
      return NextResponse.json(
        {
          ok: false,
          error:
            "We could not save your request. Please email support@certitude.in and we will pick it up.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, reference, demo: false });
  } catch (error) {
    console.error("[leads] unexpected error", error);
    return NextResponse.json(
      { ok: false, error: "Unexpected error. Please try again." },
      { status: 500 },
    );
  }
}
