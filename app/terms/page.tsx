import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, Scale, CheckCircle2, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service | BharatKits Hub",
  description:
    "Terms of service and usage guidelines for BharatKits Hub free citizen utilities and All India Job Portal.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-amber-500 selection:text-white">
      {/* Header Bar */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BharatKits Hub
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
              <Scale className="w-4 h-4" /> Open Source &amp; Free Public Utility
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <FileText className="w-3.5 h-3.5" />
            User Guidelines &amp; Fair Use Policy
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Terms of Service
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Effective Date: March 2025 • Designed &amp; Developed by <strong>Bijoy Lohar</strong>.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing and using BharatKits Hub (including the Cyber Cafe Suite, Productivity Studio, Financial Calculators, and All India Job Portal), you agree to be bound by these Terms of Service. If you do not agree to these terms, please discontinue using the portal.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              2. 100% Free &amp; Non-Commercial Service
            </h2>
            <p>
              BharatKits Hub is a free, non-commercial public utility dedicated to Indian citizens, students, job seekers, and cyber cafe operators. We do not charge subscription fees, application submission surcharges, or payment gateway fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              3. Permitted &amp; Responsible Use
            </h2>
            <p>You agree to use the portal in accordance with all applicable Indian laws:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>You may use the tools for generating personal documents, GST cash memos for small businesses, and applying to legitimate job opportunities.</li>
              <li>You may not use any utility to forge unlawful government credentials or engage in fraudulent activities.</li>
              <li>You may not attempt automated Denial of Service (DoS) attacks or abuse the infrastructure.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              4. Job Notifications &amp; Information Accuracy
            </h2>
            <p>
              Job vacancy notices are aggregated automatically from publicly available official gazettes and career boards. While automated link verification checks are executed regularly:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>BharatKits Hub does not guarantee employment or guarantee that official application servers will remain online.</li>
              <li>Candidates are strictly advised to cross-verify eligibility criteria and examination dates in the official PDF notification issued by the respective recruitment board.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-rose-500" />
              5. Intellectual Property &amp; Open Source
            </h2>
            <p>
              The code, design system, and custom tooling components of BharatKits Hub are open-source and copyright © 2026 <strong>Bijoy Lohar</strong>. Third-party recruitment logos, trademarks, and government insignias remain the property of their respective regulatory authorities.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Governance &amp; Contact
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              These terms are governed by the laws of India. For any questions or suggestions, connect with the creator at{" "}
              <a
                href="https://github.com/loharbijoy2005-a11y/BharatKits-Hub"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-500 font-bold hover:underline"
              >
                GitHub Repository
              </a>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
