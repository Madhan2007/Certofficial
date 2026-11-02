import { brand } from "@/lib/brand";

export interface LegalSection {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
}

export interface LegalDocument {
  slug: string;
  title: string;
  summary: string;
  updated: string;
  sections: LegalSection[];
}

const CONTACT = `Questions about this policy can be sent to ${brand.supportEmail}.`;

export const legalDocuments: LegalDocument[] = [
  {
    slug: "terms",
    title: "Terms of service",
    summary:
      "The rules that apply when you use this website, request a quote or buy a voucher from us.",
    updated: "2026-10-27",
    sections: [
      {
        heading: "1. Who we are",
        paragraphs: [
          `${brand.name} is operated by ${brand.legalName}, a business based in ${brand.city}, ${brand.country}. References to "we", "us" and "our" mean ${brand.legalName}.`,
          `We are an independent marketplace. We are not affiliated with, endorsed by or sponsored by any certification body, test delivery provider or training organisation. Vendor names and exam codes are used only to identify the products being compared.`,
        ],
      },
      {
        heading: "2. What we sell",
        paragraphs: [
          "We sell and facilitate the sale of exam vouchers — prepaid codes that cover the fee for one attempt at a certification exam. We do not sell training, practice exams, exam dumps, guaranteed passes, or the certification itself. The certification is awarded solely by the certification body when you pass their exam.",
        ],
      },
      {
        heading: "3. Quotes, not offers",
        paragraphs: [
          "While our supplier onboarding is in progress, prices shown on the website are indicative and every purchase begins with a written quote. A contract of sale is formed only when you accept that quote in writing and we confirm it by email.",
          "Indicative prices may change without notice. The price in your accepted quote is held for the validity period stated in it.",
        ],
      },
      {
        heading: "4. Your responsibilities",
        bullets: [
          "Provide accurate information, including the correct exam code, region and GST details.",
          "Check the voucher region, eligibility and expiry before paying.",
          "Do not resell, publish or share a voucher code you have purchased.",
          "Comply with the certification body's candidate agreement, testing policies and rescheduling rules.",
          "Do not use this site to attempt fraud, scraping at abusive volume, or unauthorised access.",
        ],
      },
      {
        heading: "5. Third-party terms prevail",
        paragraphs: [
          "Exam vouchers are governed by the issuing certification body's terms. Where those terms conflict with anything on this website, the certification body's terms prevail. In particular, some providers prohibit voucher resale, restrict eligibility, or limit vouchers to specific countries.",
        ],
      },
      {
        heading: "6. Intellectual property",
        paragraphs: [
          "The design, copy and code of this website belong to us. Third-party trademarks, certification names and exam codes belong to their respective owners and are used for identification only. See the trademark notice for details.",
        ],
      },
      {
        heading: "7. Liability",
        paragraphs: [
          "We are responsible for supplying a valid voucher and for the delivery, replacement and refund commitments described in our delivery and refund policies.",
          "To the extent permitted by law, we are not liable for indirect or consequential losses, including lost wages, missed promotion, failed exam attempts or travel costs. Our total liability for any order is limited to the amount you paid for that order.",
          "Nothing in these terms limits rights you have under the Consumer Protection Act, 2019 or other applicable Indian law.",
        ],
      },
      {
        heading: "8. Governing law",
        paragraphs: [
          "These terms are governed by the laws of India. Disputes are subject to the exclusive jurisdiction of the courts at Bengaluru, Karnataka.",
        ],
      },
      {
        heading: "9. Changes",
        paragraphs: [
          "We may update these terms. The version in force is the one published on this page at the time of your order.",
          CONTACT,
        ],
      },
    ],
  },
  {
    slug: "privacy",
    title: "Privacy policy",
    summary:
      "What personal data we collect, why we collect it, how long we keep it, and the choices you have.",
    updated: "2026-10-27",
    sections: [
      {
        heading: "1. What we collect",
        bullets: [
          "Contact details you give us: name, email address, mobile number, city and organisation.",
          "Order details: the exam you are buying, quantity, target date, GSTIN and invoice details.",
          "Payment metadata: the reference, amount and status returned by our payment processor. We do not store card numbers, CVV or UPI credentials.",
          "Technical data: IP address, device and browser type, pages viewed, and referral source.",
          "Support correspondence: emails, WhatsApp messages and attachments you send us.",
        ],
      },
      {
        heading: "2. Why we use it",
        bullets: [
          "To prepare and honour quotes and orders.",
          "To deliver vouchers, invoices and expiry reminders.",
          "To provide support and investigate failed vouchers.",
          "To detect fraud, abuse and chargeback risk.",
          "To meet tax, accounting and legal obligations.",
          "To improve the site, using aggregated analytics rather than individual profiling.",
        ],
      },
      {
        heading: "3. Lawful basis",
        paragraphs: [
          "We process data to perform a contract with you, to comply with legal obligations, and on the basis of our legitimate interest in running a secure marketplace. Where consent is required — for example marketing email — we ask for it separately and you can withdraw it at any time.",
        ],
      },
      {
        heading: "4. Who we share it with",
        bullets: [
          "Payment processors, to take payment and handle refunds.",
          "Email and messaging providers, to deliver order confirmations and reminders.",
          "Hosting and database providers, which store data on our behalf under contract.",
          "Suppliers, only the minimum needed to issue your voucher — never your payment details.",
          "Professional advisers, auditors and authorities where legally required.",
        ],
      },
      {
        heading: "5. Voucher code handling",
        paragraphs: [
          "Voucher codes are encrypted at rest with a server-side key. Access is limited to the delivery system and, for support purposes, to a small number of administrators who see only the last four characters. Full reveals are logged with an actor, order and reason.",
        ],
      },
      {
        heading: "6. Retention",
        paragraphs: [
          "Order and invoice records are retained for eight years to meet Indian tax and accounting requirements. Marketing contact details are retained until you unsubscribe. Support conversations are retained for two years. Analytics data is aggregated after 14 months.",
        ],
      },
      {
        heading: "7. Your rights",
        paragraphs: [
          "You can ask for a copy of your data, correction of inaccurate data, deletion where we do not have a legal obligation to retain it, and withdrawal of marketing consent. Email us and we will respond within 30 days.",
          "If you are unhappy with our response, you can complain to the Data Protection Board of India once it is operational, or to the appropriate consumer forum.",
        ],
      },
      {
        heading: "8. Cookies",
        paragraphs: [
          "We use essential cookies for sessions and security, and privacy-friendly analytics to understand aggregate page usage. We do not run third-party advertising trackers. You can block cookies in your browser, although essential features may stop working.",
        ],
      },
      {
        heading: "9. Children",
        paragraphs: [
          "The site is intended for people aged 18 and over. If you are younger, you may only use it with the involvement of a parent or guardian.",
          CONTACT,
        ],
      },
    ],
  },
  {
    slug: "refund",
    title: "Refund policy",
    summary:
      "When you can get a refund, when you cannot, and how long it takes.",
    updated: "2026-10-27",
    sections: [
      {
        heading: "1. Before the code is revealed",
        paragraphs: [
          "You can cancel for a full refund at any point before we reveal the voucher code to you. We deduct only the payment gateway fee where the processor does not return it to us, and we tell you the exact deduction before processing.",
        ],
      },
      {
        heading: "2. After the code is revealed",
        paragraphs: [
          "Once a voucher code has been revealed, it cannot be resold safely, so refunds are not available for change of mind. This mirrors the treatment of gift cards and prepaid exam fees.",
          "The exception is a code that does not work. See section 3.",
        ],
      },
      {
        heading: "3. If the voucher is rejected",
        paragraphs: [
          "If a voucher is rejected when you book, or at the test centre, send us the booking reference and the exact error message within 7 days of discovery. We will:",
        ],
        bullets: [
          "Replace the voucher with a working code within one business day; or",
          "Refund the full amount you paid if a replacement is not available within five business days.",
        ],
      },
      {
        heading: "4. If the exam is retired",
        paragraphs: [
          "Certification bodies usually allow an existing voucher to be used for the replacement exam version. Where they do not, we will refund or replace at your choice. We flag announced retirements on the relevant exam page.",
        ],
      },
      {
        heading: "5. If we cancel",
        paragraphs: [
          "If we cannot supply a voucher you have paid for, we will tell you within one business day and refund you in full. You do not need to chase us.",
        ],
      },
      {
        heading: "6. How refunds are paid",
        paragraphs: [
          "Refunds go back to the original payment method. UPI and card refunds typically appear within 5–7 business days, depending on your bank. We will send you the refund reference once it is raised.",
        ],
      },
      {
        heading: "7. Chargebacks",
        paragraphs: [
          "Please contact us before raising a chargeback. We can usually resolve a failed voucher faster than a bank dispute. Where a chargeback is raised without contacting us, we may suspend related accounts while the dispute is investigated.",
          CONTACT,
        ],
      },
    ],
  },
  {
    slug: "delivery",
    title: "Delivery policy",
    summary:
      "How and when vouchers, invoices and reminders are delivered.",
    updated: "2026-10-27",
    sections: [
      {
        heading: "1. Delivery method",
        paragraphs: [
          "Vouchers are delivered electronically. The code is sent to the email address on the order and, if you have an account, made available through a one-time reveal link. We do not post physical vouchers.",
        ],
      },
      {
        heading: "2. Delivery timeline",
        paragraphs: [
          "In-stock vouchers are delivered within 24 hours of confirmed payment, and usually within a few hours. If a specific order will take longer, we tell you before you pay and give you the option to cancel.",
        ],
      },
      {
        heading: "3. What the delivery email contains",
        bullets: [
          "The exam name and code.",
          "The voucher code and how to redeem it.",
          "The expiry date and any region or eligibility restriction.",
          "The GST invoice as a PDF attachment.",
          "A link to book your exam with the provider.",
        ],
      },
      {
        heading: "4. If the email does not arrive",
        paragraphs: [
          "Check spam and promotions folders first, then sign in and reopen the order. If you still cannot find it, contact support with your reference number and we will resend access to the same code.",
        ],
      },
      {
        heading: "5. Expiry reminders",
        paragraphs: [
          "We send reminders 30, 14, 7 and 1 day before your voucher expires, plus a nudge if you have not scheduled your exam within two weeks of delivery. Reminders are a courtesy, not a guarantee — the expiry date on the voucher is what applies.",
        ],
      },
      {
        heading: "6. Failed delivery",
        paragraphs: [
          "If we cannot deliver because of an incorrect email address supplied at checkout, we will attempt to reach you by phone and WhatsApp. We hold the code for 30 days before treating the order as abandoned.",
          CONTACT,
        ],
      },
    ],
  },
  {
    slug: "trademarks",
    title: "Trademark and affiliation notice",
    summary:
      "Certitude is independent. Here is exactly what that means for the names on this site.",
    updated: "2026-10-27",
    sections: [
      {
        heading: "1. Independence",
        paragraphs: [
          `${brand.name} is an independent comparison and resale marketplace. We are not owned by, affiliated with, endorsed by, sponsored by or otherwise connected to Amazon Web Services, Microsoft, Google Cloud, Cisco, CompTIA, ISC2, PMI, HashiCorp, the Cloud Native Computing Foundation, Salesforce or any other certification body.`,
        ],
      },
      {
        heading: "2. How names are used",
        paragraphs: [
          "Certification names, exam codes and provider names are used descriptively, to identify the product being compared or sold. Their use does not imply any endorsement, partnership or authorisation unless we state that separately and specifically on an offer.",
        ],
      },
      {
        heading: "3. Logos and badges",
        paragraphs: [
          "We do not display third-party logos or certification badges as decoration. Where a provider mark appears, it is a text-based identifier generated by us, not the provider's official logo, and it is not used to suggest endorsement.",
        ],
      },
      {
        heading: "4. Voucher terms",
        bullets: [
          "Some certification bodies prohibit voucher resale in their product terms. Where we are aware of such a restriction, we link to the official store instead of reselling, and we say so on the offer.",
          "Vouchers remain subject to the issuing body's terms, including non-transferability and expiry rules.",
        ],
      },
      {
        heading: "5. Takedown requests",
        paragraphs: [
          `If you represent a certification body and believe content on this site misuses your mark, email ${brand.supportEmail} with the URL and the specific concern. We aim to respond within two business days and will remove or amend content where the concern is substantiated.`,
        ],
      },
    ],
  },
];

export function getLegalDocument(slug: string): LegalDocument | undefined {
  return legalDocuments.find((doc) => doc.slug === slug);
}
