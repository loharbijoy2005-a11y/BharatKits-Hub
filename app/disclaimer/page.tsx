import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Scale, AlertTriangle, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";

export const metadata: Metadata = {
  title: "Legal Disclaimer & Verification Guide | BharatKits Hub",
  description:
    "Official legal disclaimer, non-affiliation notice, and candidate verification instructions for BharatKits Hub All India Job Portal.",
};

export default function DisclaimerPage() {
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
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <Scale className="w-4 h-4" /> Official Notice Aggregator
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
            <AlertTriangle className="w-3.5 h-3.5" />
            Public Disclosure &amp; Compliance Statement
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Legal Disclaimer &amp; Verification Notice
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            BharatKits Hub is an independent non-commercial public service aggregator created by <strong>Bijoy Lohar</strong>.
          </p>
        </div>

        {/* Warning Banner */}
        <div className="p-6 rounded-3xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 space-y-3">
          <div className="flex items-center gap-2 text-base font-bold text-amber-800 dark:text-amber-300">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span>Candidate Mandatory Verification Advisory:</span>
          </div>
          <p className="text-xs sm:text-sm text-amber-900/90 dark:text-amber-200/90 leading-relaxed">
            Never pay any fee to unauthorized middlemen, third-party agents, or unverified websites. All examination fees must be paid exclusively on official government portals (such as <code>upsc.gov.in</code>, <code>ssc.gov.in</code>, <code>rrbapply.gov.in</code>, or respective State PSC websites).
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              1. Non-Affiliation Statement
            </h2>
            <p>
              BharatKits Hub and the All India Job Portal are <strong>strictly independent</strong> informational aggregation platforms. We are not affiliated with, sponsored by, authorized by, or associated with the Government of India, any State Government, Central Ministries, Staff Selection Commission (SSC), Union Public Service Commission (UPSC), Railway Recruitment Boards (RRB), National Career Service (NCS), or any private corporation.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              2. Source of Information &amp; Automation
            </h2>
            <p>
              All job vacancy circulars, eligibility criteria, and educational qualifications displayed on this portal are aggregated automatically from publicly published gazette notifications (Weekly Employment News / Rozgar Samachar), National Career Service (NCS), and publicly accessible corporate careers ATS feeds.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              3. Verification of Official PDFs
            </h2>
            <p>
              While we perform automated link verification checks to link directly to official PDF notifications, candidates must independently verify all information (including age limits, reservation quotas, syllabus, fee exemptions, and exam dates) in the official gazette notice published by the respective board before taking any action.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              4. Trademarks &amp; Logo Attribution
            </h2>
            <p>
              All recruitment board names, department abbreviations (e.g. UPSC, SSC, IBPS, KVS, CTET, DRDO, ISRO), logos, and corporate brand names are the registered trademarks of their respective legal owners. Their reference on this website is purely for identification, reporting, and public informational purposes under Fair Use doctrines.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              5. Takedown Requests
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              Authorized representatives of recruitment boards or corporate employers wishing to update or remove an aggregated listing may submit a request directly via our{" "}
              <Link href="/takedown" className="text-amber-500 font-bold underline">
                Takedown Compliance Form
              </Link>.
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}
