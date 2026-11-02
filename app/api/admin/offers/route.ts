import { NextResponse } from "next/server";
import { verifyAdminSession, getAdminSupabase } from "@/lib/admin";

export async function PATCH(request: Request) {
  const isAuthed = await verifyAdminSession();
  if (!isAuthed) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id, supply_status, price_inr, compare_at_inr, is_active } = await request.json();
    if (!id) {
      return NextResponse.json({ ok: false, error: "Offer ID required" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (supply_status !== undefined) {
      const allowed = ["verified", "affiliate", "quote", "unavailable"];
      if (!allowed.includes(supply_status)) {
        return NextResponse.json({ ok: false, error: "Invalid supply status" }, { status: 400 });
      }
      updates.supply_status = supply_status;
    }

    if (price_inr !== undefined) updates.price_inr = Number(price_inr);
    if (compare_at_inr !== undefined) updates.compare_at_inr = Number(compare_at_inr);
    if (is_active !== undefined) updates.is_active = Boolean(is_active);

    const supabase = getAdminSupabase();
    const { error } = await supabase.from("offers").update(updates).eq("id", id);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
