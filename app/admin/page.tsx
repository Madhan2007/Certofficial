import { Metadata } from "next";
import { verifyAdminSession, getAdminSupabase } from "@/lib/admin";
import { AdminLoginForm } from "@/components/admin/admin-login-form";
import { AdminDashboardClient } from "@/components/admin/admin-dashboard-client";

export const metadata: Metadata = {
  title: "Admin Control Center | Certitude",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const isAuthed = await verifyAdminSession();

  if (!isAuthed) {
    return <AdminLoginForm />;
  }

  const supabase = getAdminSupabase();

  // Load leads, offers, and exams
  const [leadsRes, offersRes, examsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(100),
    supabase
      .from("offers")
      .select("id, exam_slug, supplier_name, supply_status, price_inr, compare_at_inr, voucher_validity_days, is_active")
      .order("created_at", { ascending: false }),
    supabase
      .from("exams")
      .select("slug, name, code, provider_slug, official_price_inr")
      .order("popularity", { ascending: false }),
  ]);

  const leads = leadsRes.data || [];
  const offers = offersRes.data || [];
  const exams = examsRes.data || [];

  return (
    <AdminDashboardClient
      initialLeads={leads}
      initialOffers={offers}
      exams={exams}
    />
  );
}
