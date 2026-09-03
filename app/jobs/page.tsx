import type { Metadata } from "next";
import JobPortalClient from "./JobPortalClient";

export const metadata: Metadata = {
  title: "All India Job Portal 2026 | Sarkari Results & Private Tech Jobs",
  description:
    "100% automated, free job portal for India. Direct application links and official notification PDF downloads for SSC, UPSC, Railway RRB, IBPS Bank, State PSCs, and top tech companies.",
  keywords: [
    "Sarkari Result",
    "Sarkari Naukri 2026",
    "Government Jobs India",
    "SSC CGL 2026",
    "UPSC Notification",
    "Railway Recruitment 2026",
    "Bank PO Jobs",
    "Private Tech Jobs India",
    "Fresher Software Engineer Jobs",
    "Remote Jobs India",
  ],
  openGraph: {
    title: "All India Job Portal 2026 - Sarkari & Private Jobs",
    description:
      "Automated zero-spam job aggregator for Indian youth. Download official PDF notifications and apply directly with zero fees.",
    type: "website",
  },
};

export default function JobsPage() {
  return <JobPortalClient />;
}
