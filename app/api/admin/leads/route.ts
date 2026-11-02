import { NextResponse } from "next/server";
import { verifyAdminSession, getAdminSupabase } from "@/lib/admin";

export async function PATCH(request: Request) {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, status } = await request.json();
    const allowed = ["new", "contacted", "quoted", "won", "lost", "spam"];
    if (!id || !allowed.includes(status)) {
      return NextResponse.json({ ok: false, error: "Invalid parameters" }, { status: 400 });
    }

    const supabase = getAdminSupabase();
    const { error } = await supabase
      .from("leads")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
