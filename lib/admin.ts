import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";

export const ADMIN_COOKIE_NAME = "certitude_admin_token";

export async function verifyAdminSession(): Promise<boolean> {
  const adminKey = process.env.ADMIN_ACCESS_KEY?.trim();
  if (!adminKey) return false;

  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE_NAME)?.value;
  return Boolean(token && token === adminKey);
}

export function getAdminSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url || !serviceKey) {
    throw new Error("Missing Supabase URL or SUPABASE_SERVICE_ROLE_KEY for admin operations.");
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
  });
}
