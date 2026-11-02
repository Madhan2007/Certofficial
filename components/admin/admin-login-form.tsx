"use client";

import { useState } from "react";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function AdminLoginForm() {
  const [key, setKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!key.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: key.trim() }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.error || "Authentication failed.");
      } else {
        window.location.reload();
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div className="flex items-center gap-3 text-slate-900">
          <div className="rounded-xl bg-slate-900 p-2.5 text-white">
            <Lock className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Certitude Ops Portal</h1>
            <p className="text-xs text-slate-500">Internal management & leads triage</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
              Admin Access Key
            </label>
            <input
              type="password"
              placeholder="Enter secure ADMIN_ACCESS_KEY…"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm font-mono shadow-sm focus:border-slate-900 focus:outline-none focus:ring-1 focus:ring-slate-900"
              required
            />
          </div>

          {error && (
            <div className="rounded-lg bg-rose-50 p-3 text-xs font-medium text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          <Button type="submit" disabled={loading} className="w-full justify-center">
            {loading ? "Authenticating…" : "Sign In to Admin Portal"}
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Button>
        </form>

        <div className="mt-6 flex items-center gap-2 border-t border-slate-100 pt-4 text-xs text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-600" />
          <span>Restricted to authorized operators. All actions audit logged.</span>
        </div>
      </div>
    </div>
  );
}
