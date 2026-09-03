import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldCheck, Lock, EyeOff, ServerOff, Cpu, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "Privacy Policy | BharatKits Hub - Zero-Server Retention Architecture",
  description:
    "Learn about our Zero-Server Retention Architecture. All citizen tools, Aadhaar processing, PDF generation, and calculators process 100% locally in your browser with zero data collection.",
};

export default function PrivacyPolicyPage() {
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
            <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" /> 100% Client-Side Private
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        {/* Title Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            <Lock className="w-3.5 h-3.5" />
            Privacy First Architecture
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            Privacy Policy &amp; Data Governance
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            Last Updated: March 2025 • Designed &amp; Maintained by <strong>Bijoy Lohar</strong> for Digital India.
          </p>
        </div>

        {/* Core Pillars Highlight Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ServerOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero Server Retention</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No documents, Aadhaar scans, biodatas, photos, or invoices are ever uploaded to any backend database.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">In-Browser Processing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              All computations, QR decoding, PDF compiling, and image compression execute 100% inside your browser memory.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <EyeOff className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">No Tracking or Ads</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Zero third-party advertising cookies, zero analytics trackers, and zero personal profiling of citizens or job seekers.
            </p>
          </div>
        </div>

        {/* Detailed Clauses */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-8 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          
          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-500" />
              1. What Data We Collect (And What We DO NOT Collect)
            </h2>
            <div className="space-y-2">
              <p>
                <strong>What We DO NOT Collect:</strong>
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                <li>We do NOT store or collect Aadhaar QR codes, numbers, names, addresses, or biometric data processed through the Aadhaar scanner tool.</li>
                <li>We do NOT store images, photos, signatures, resumes, or certificates uploaded to the Passport Photo Maker, Biodata Generator, or PDF Studio.</li>
                <li>We do NOT require user account creation, mobile phone OTPs, or passwords to access any calculator, utility, or job notification.</li>
              </ul>
              <p className="mt-2">
                <strong>What We Handle:</strong>
              </p>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                Public job vacancies aggregated strictly from authoritative publicly published gazettes and official recruitment board portals (e.g. UPSC, SSC, RRB, NCS, State PSCs).
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-500" />
              2. Zero-Server Retention Architecture Explained
            </h2>
            <p>
              BharatKits Hub operates on a <strong>Local-First Client Architecture</strong>. When you use tools such as the GST Cash Memo Generator, Loan EMI Calculator, Govt Savings Engine, or Affidavit Maker:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              <li>All mathematical computations and PDF render passes are executed locally by your device&apos;s CPU and browser JavaScript runtime (HTML5 Canvas &amp; WebCrypto).</li>
              <li>When you close or refresh your browser tab, all temporary working states are automatically cleared from your device memory.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              3. LocalStorage &amp; Saved Bookmarks
            </h2>
            <p>
              When you click the bookmark/save icon on a job card or utility favorite, your preference is saved strictly to your local browser&apos;s <code>localStorage</code>. This data never leaves your device, is never transmitted across the network, and can be cleared at any time by clearing your browser cache.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-500" />
              4. External Recruitment Portals &amp; Third-Party Links
            </h2>
            <p>
              Our All India Job Portal aggregates direct links to official government examination boards (e.g. <code>upsc.gov.in</code>, <code>ssc.gov.in</code>, <code>indiapost.gov.in</code>) and verified corporate career sites. When you click <strong>&quot;Apply Online&quot;</strong> or <strong>&quot;Download PDF&quot;</strong>, you are redirected directly to the official external portal. We encourage you to review the privacy policies of each respective government portal before submitting any application.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-rose-500" />
              5. Takedown &amp; Compliance Inquiries
            </h2>
            <p>
              If you represent an official government department, recruitment board, or corporate organization and wish to update or remove a listing, please submit a request via our dedicated <Link href="/takedown" className="text-amber-500 font-bold underline">Content Removal &amp; Takedown Portal</Link>. All requests are verified and processed promptly.
            </p>
          </section>

          <section className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              6. Contact &amp; Developer Information
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
              BharatKits Hub is designed, developed, and maintained by <strong>Bijoy Lohar</strong> as a free open-source public service for Digital India. For queries, visit our{" "}
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
