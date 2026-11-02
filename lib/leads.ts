import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Please enter your full name")
    .max(80, "That name is too long"),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .transform((value) => value.replace(/[\s\-()]/g, ""))
    .refine(
      (value) => /^(\+91)?[6-9]\d{9}$/.test(value),
      "Enter a valid Indian mobile number",
    ),
  examSlug: z.string().trim().max(120).optional().or(z.literal("")),
  examCode: z.string().trim().max(40).optional().or(z.literal("")),
  quantity: z.coerce.number().int().min(1).max(500).default(1),
  city: z.string().trim().max(80).optional().or(z.literal("")),
  targetDate: z.string().trim().max(20).optional().or(z.literal("")),
  company: z.string().trim().max(120).optional().or(z.literal("")),
  gstin: z.string().trim().max(20).optional().or(z.literal("")),
  message: z.string().trim().max(2000).optional().or(z.literal("")),
  intent: z.enum(["single", "bulk", "notify"]).default("single"),
  consent: z
    .boolean()
    .refine((value) => value === true, "Please accept the privacy policy to continue"),
  source: z.string().trim().max(200).optional().or(z.literal("")),
});

export type LeadInput = z.input<typeof leadSchema>;
export type Lead = z.output<typeof leadSchema>;

export interface LeadResult {
  ok: boolean;
  reference?: string;
  demo?: boolean;
  error?: string;
}

export function leadReference(): string {
  const now = new Date();
  const stamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `CQ-${stamp}-${random}`;
}
