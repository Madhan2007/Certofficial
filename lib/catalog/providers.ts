import type { Category, Provider } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "cloud",
    name: "Cloud",
    description:
      "AWS, Azure and Google Cloud certifications — the fastest route into cloud engineering roles.",
    icon: "cloud",
  },
  {
    slug: "security",
    name: "Cybersecurity",
    description:
      "Entry-level to advanced security credentials from CompTIA, ISC2, Cisco and EC-Council.",
    icon: "shield",
  },
  {
    slug: "networking",
    name: "Networking",
    description:
      "Cisco and CompTIA networking tracks, from CCNA to CCNP and Network+.",
    icon: "network",
  },
  {
    slug: "data",
    name: "Data & Analytics",
    description:
      "Data engineering, analytics and database certifications across the major clouds.",
    icon: "database",
  },
  {
    slug: "ai",
    name: "AI & Machine Learning",
    description:
      "AI practitioner and ML engineer certifications from AWS, Microsoft and Google Cloud.",
    icon: "sparkles",
  },
  {
    slug: "devops",
    name: "DevOps & Platform",
    description:
      "Kubernetes, Terraform and DevOps engineer certifications for platform teams.",
    icon: "git-branch",
  },
  {
    slug: "project",
    name: "Project & Service",
    description:
      "PMP, CAPM, PRINCE2 and ITIL credentials for delivery and service roles.",
    icon: "clipboard",
  },
  {
    slug: "business",
    name: "Business & CRM",
    description:
      "Salesforce, ServiceNow and business-platform certifications.",
    icon: "briefcase",
  },
  {
    slug: "support",
    name: "IT Support",
    description:
      "Entry-level helpdesk and desktop support certifications such as CompTIA A+.",
    icon: "life-buoy",
  },
];

export const providers: Provider[] = [
  {
    slug: "aws",
    name: "Amazon Web Services",
    shortName: "AWS",
    mark: "AWS",
    description:
      "AWS certifications validate cloud architecture, development and operations skills. Exams are delivered through Pearson VUE.",
    websiteUrl: "https://aws.amazon.com/certification/",
    accent: "#FF9900",
    categories: ["cloud", "ai", "data", "devops", "security"],
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    shortName: "Microsoft",
    mark: "MS",
    description:
      "Microsoft role-based and fundamentals certifications for Azure, data, security and business applications.",
    websiteUrl: "https://learn.microsoft.com/en-us/credentials/",
    accent: "#0078D4",
    categories: ["cloud", "ai", "data", "security", "devops", "business"],
  },
  {
    slug: "google-cloud",
    name: "Google Cloud",
    shortName: "Google Cloud",
    mark: "GCP",
    description:
      "Google Cloud certifications covering cloud architecture, data engineering, security and machine learning.",
    websiteUrl: "https://cloud.google.com/learn/certification",
    accent: "#4285F4",
    categories: ["cloud", "data", "ai", "security", "networking"],
  },
  {
    slug: "cisco",
    name: "Cisco",
    shortName: "Cisco",
    mark: "CSCO",
    description:
      "Cisco certification tracks for networking, security and collaboration, from CCNA to CCNP and CCIE.",
    websiteUrl: "https://learningnetwork.cisco.com/s/certifications",
    accent: "#1BA0D7",
    categories: ["networking", "security"],
  },
  {
    slug: "comptia",
    name: "CompTIA",
    shortName: "CompTIA",
    mark: "CT",
    description:
      "Vendor-neutral IT certifications spanning support, networking, cybersecurity and cloud.",
    websiteUrl: "https://www.comptia.org/en-us/certifications/",
    accent: "#C8202F",
    categories: ["security", "networking", "cloud", "data", "support"],
  },
  {
    slug: "isc2",
    name: "ISC2",
    shortName: "ISC2",
    mark: "ISC2",
    description:
      "Cybersecurity certifications including CISSP, CCSP and the entry-level Certified in Cybersecurity.",
    websiteUrl: "https://www.isc2.org/certifications",
    accent: "#00A3AD",
    categories: ["security"],
  },
  {
    slug: "pmi",
    name: "Project Management Institute",
    shortName: "PMI",
    mark: "PMI",
    description:
      "Project management credentials including PMP, CAPM and PMI-ACP.",
    websiteUrl: "https://www.pmi.org/certifications",
    accent: "#1B3A6B",
    categories: ["project", "business"],
  },
  {
    slug: "hashicorp",
    name: "HashiCorp",
    shortName: "HashiCorp",
    mark: "HC",
    description:
      "Infrastructure automation certifications for Terraform and Vault.",
    websiteUrl: "https://developer.hashicorp.com/certifications",
    accent: "#7B42BC",
    categories: ["devops", "cloud"],
  },
  {
    slug: "cncf",
    name: "Cloud Native Computing Foundation",
    shortName: "CNCF",
    mark: "CNCF",
    description:
      "Kubernetes certifications including CKA, CKAD and CKS, delivered through the Linux Foundation.",
    websiteUrl: "https://training.linuxfoundation.org/certification/",
    accent: "#326CE5",
    categories: ["devops", "cloud"],
  },
  {
    slug: "salesforce",
    name: "Salesforce",
    shortName: "Salesforce",
    mark: "SF",
    description:
      "Salesforce administrator, developer and consultant certifications for the CRM ecosystem.",
    websiteUrl: "https://trailhead.salesforce.com/credentials",
    accent: "#00A1E0",
    categories: ["business", "data"],
  },
];

export function getProvider(slug: string): Provider | undefined {
  return providers.find((p) => p.slug === slug);
}

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
