"use client";

import { useId, useMemo, useState } from "react";
import { CheckCircle2, Loader2, MessageCircle, Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FieldError, FieldHint, Input, Label, Select, Textarea } from "@/components/ui/field";
import type { LeadResult } from "@/lib/leads";
import { brand } from "@/lib/brand";
import { cn } from "@/lib/utils";

export interface ExamOption {
  slug: string;
  code: string;
  name: string;
  provider: string;
}

type Intent = "single" | "bulk" | "notify";

export function QuoteForm({
  exams,
  initialExam,
  initialIntent = "single",
}: {
  exams: ExamOption[];
  initialExam?: string;
  initialIntent?: Intent;
}) {
  const formId = useId();
  const [intent, setIntent] = useState<Intent>(initialIntent);
  const [examSlug, setExamSlug] = useState(initialExam ?? "");
  const [pending, setPending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<LeadResult | null>(null);

  const grouped = useMemo(() => {
    return exams.reduce<Record<string, ExamOption[]>>((acc, exam) => {
      acc[exam.provider] = acc[exam.provider] ?? [];
      acc[exam.provider].push(exam);
      return acc;
    }, {});
  }, [exams]);

  const whatsappHref = `https://wa.me/${brand.whatsapp}?text=${encodeURIComponent(
    "Hi Certitude, I'd like help with an exam voucher quote.",
  )}`;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setErrors({});

    const form = new FormData(event.currentTarget);
    const selected = exams.find((exam) => exam.slug === examSlug);

    const payload = {
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      phone: String(form.get("phone") ?? ""),
      examSlug,
      examCode: selected?.code ?? "",
      quantity: Number(form.get("quantity") ?? 1),
      city: String(form.get("city") ?? ""),
      targetDate: String(form.get("targetDate") ?? ""),
      company: String(form.get("company") ?? ""),
      gstin: String(form.get("gstin") ?? ""),
      message: String(form.get("message") ?? ""),
      intent,
      consent: form.get("consent") === "on",
      trap: String(form.get("trap") ?? ""),
      source: typeof window !== "undefined" ? window.location.pathname : "/quote",
    };

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = (await response.json()) as LeadResult & {
        fieldErrors?: Record<string, string[]>;
      };

      if (!response.ok || !data.ok) {
        const flat: Record<string, string> = {};
        for (const [key, messages] of Object.entries(data.fieldErrors ?? {})) {
          flat[key] = messages[0] ?? "Please check this field";
        }
        setErrors(
          Object.keys(flat).length
            ? flat
            : { form: data.error ?? "Something went wrong. Please try again." },
        );
        return;
      }

      setResult(data);
    } catch {
      setErrors({ form: "Network error. Please try again or WhatsApp us." });
    } finally {
      setPending(false);
    }
  }

  if (result?.ok) {
    return (
      <div className="rounded-2xl border border-brand-100 bg-brand-50/60 p-7">
        <CheckCircle2 className="h-9 w-9 text-brand-600" />
        <h2 className="mt-4 text-xl font-semibold text-ink-900">
          Request received{result.reference ? ` — ${result.reference}` : ""}
        </h2>
        <p className="mt-2 max-w-lg text-[14px] leading-relaxed text-ink-600">
          We will confirm the exact price, voucher region and expiry by email
          within one business day. Nothing is charged until you approve the quote
          in writing.
        </p>

        <div className="mt-5 space-y-2 rounded-xl border border-brand-100 bg-white p-4 text-[13px] text-ink-600">
          <p className="font-medium text-ink-800">What happens next</p>
          <p>1. We check supply for your exam and city.</p>
          <p>2. You receive a written quote with GST breakdown.</p>
          <p>3. You approve, pay by UPI or card, and receive the voucher.</p>
        </div>

        {result.demo && (
          <p className="mt-4 rounded-lg bg-amber-100 px-3 py-2 text-[12px] text-amber-600">
            Demo mode: no database is connected, so this request was logged to the
            server console only.
          </p>
        )}

        <div className="mt-5 flex flex-wrap gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full bg-ink-900 px-5 text-sm font-medium text-white hover:bg-ink-800"
          >
            <MessageCircle className="h-4 w-4" />
            Continue on WhatsApp
          </a>
          <Button
            variant="outline"
            onClick={() => {
              setResult(null);
              setErrors({});
            }}
          >
            Send another request
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-line bg-white p-6 sm:p-7">
      {/* Honeypot: hidden from people, irresistible to naive form bots. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-trap`}>Leave this field empty</label>
        <input
          id={`${formId}-trap`}
          name="trap"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          defaultValue=""
        />
      </div>
      <fieldset className="mb-6">
        <legend className="mb-2 text-[13px] font-medium text-ink-700">
          What do you need?
        </legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { value: "single", label: "One exam", hint: "Individual voucher" },
            { value: "bulk", label: "Bulk order", hint: "5+ candidates" },
            { value: "notify", label: "Notify me", hint: "Waiting on stock" },
          ].map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setIntent(option.value as Intent)}
              className={cn(
                "rounded-xl border px-3 py-2.5 text-left transition-colors",
                intent === option.value
                  ? "border-brand-500 bg-brand-50"
                  : "border-line hover:border-line-strong",
              )}
              aria-pressed={intent === option.value}
            >
              <span className="block text-[13px] font-medium text-ink-900">
                {option.label}
              </span>
              <span className="block text-[11px] text-ink-400">{option.hint}</span>
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor={`${formId}-name`}>Full name</Label>
          <Input id={`${formId}-name`} name="name" autoComplete="name" required placeholder="Priya Sharma" />
          <FieldError>{errors.name}</FieldError>
        </div>
        <div>
          <Label htmlFor={`${formId}-email`}>Email</Label>
          <Input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="priya@company.com"
          />
          <FieldError>{errors.email}</FieldError>
        </div>
        <div>
          <Label htmlFor={`${formId}-phone`}>Mobile (India)</Label>
          <Input
            id={`${formId}-phone`}
            name="phone"
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
            placeholder="+91 98765 43210"
          />
          <FieldError>{errors.phone}</FieldError>
        </div>
        <div>
          <Label htmlFor={`${formId}-city`}>City</Label>
          <Input id={`${formId}-city`} name="city" autoComplete="address-level2" placeholder="Bengaluru" />
          <FieldError>{errors.city}</FieldError>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={`${formId}-exam`}>Exam</Label>
          <Select
            id={`${formId}-exam`}
            name="examSlug"
            value={examSlug}
            onChange={(event) => setExamSlug(event.target.value)}
            required
          >
            <option value="">Select an exam…</option>
            {Object.entries(grouped).map(([provider, options]) => (
              <optgroup key={provider} label={provider}>
                {options.map((exam) => (
                  <option key={exam.slug} value={exam.slug}>
                    {exam.code} — {exam.name}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
          <FieldError>{errors.examSlug}</FieldError>
          <FieldHint>
            Not in the list? Mention it in the notes and we will source it.
          </FieldHint>
        </div>

        <div>
          <Label htmlFor={`${formId}-quantity`}>Number of vouchers</Label>
          <Input
            id={`${formId}-quantity`}
            name="quantity"
            type="number"
            min={1}
            max={500}
            defaultValue={1}
          />
          <FieldError>{errors.quantity}</FieldError>
        </div>
        <div>
          <Label htmlFor={`${formId}-target`}>Target exam date</Label>
          <Input id={`${formId}-target`} name="targetDate" type="date" />
          <FieldError>{errors.targetDate}</FieldError>
        </div>

        <div>
          <Label htmlFor={`${formId}-company`}>Organisation (optional)</Label>
          <Input id={`${formId}-company`} name="company" autoComplete="organization" placeholder="College, company or institute" />
          <FieldError>{errors.company}</FieldError>
        </div>
        <div>
          <Label htmlFor={`${formId}-gstin`}>GSTIN (optional)</Label>
          <Input id={`${formId}-gstin`} name="gstin" placeholder="29ABCDE1234F1Z5" />
          <FieldError>{errors.gstin}</FieldError>
          <FieldHint>We issue a GST invoice when this is provided.</FieldHint>
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor={`${formId}-message`}>Anything we should know?</Label>
          <Textarea
            id={`${formId}-message`}
            name="message"
            placeholder="Preferred test centre, invoice details, or a deadline we should know about."
          />
          <FieldError>{errors.message}</FieldError>
        </div>
      </div>

      <div className="mt-5 flex items-start gap-2.5">
        <input
          id={`${formId}-consent`}
          name="consent"
          type="checkbox"
          className="mt-0.5 h-4 w-4 rounded border-line-strong accent-brand-600 focus:ring-brand-500"
        />
        <label htmlFor={`${formId}-consent`} className="text-[12px] leading-relaxed text-ink-500">
          I agree to be contacted about this request and accept the{" "}
          <a href="/legal/privacy" className="text-brand-600 underline">
            privacy policy
          </a>
          . No marketing without opt-in.
        </label>
      </div>
      <FieldError>{errors.consent}</FieldError>

      {errors.form && (
        <p className="mt-4 rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {errors.form}
        </p>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[11.5px] leading-relaxed text-ink-400 sm:max-w-xs">
          Response within one business day. No payment is taken at this stage.
        </p>
        <Button type="submit" size="lg" disabled={pending} className="sm:min-w-52">
          {pending ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Sending…
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Request quote
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
