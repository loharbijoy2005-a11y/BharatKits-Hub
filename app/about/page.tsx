import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Globe, ShieldCheck, Heart, Code2, Zap, ArrowUpRight, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | BharatKits Hub - Digital India Public Utilities",
  description:
    "Learn about BharatKits Hub, a 100% free open-source local-first utility suite and centralized job aggregator designed & developed by Bijoy Lohar.",
};

export default function AboutPage() {
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
              <Globe className="w-4 h-4" /> Public Mission
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            Made for Digital India
          </div>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            About BharatKits Hub
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
            India&apos;s all-in-one, local-first utility suite and 100% automated centralized job portal — built by <strong>Bijoy Lohar</strong> to empower Indian citizens, cyber cafes, and students.
          </p>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-black">
              🇮🇳
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Built for India</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Designed specifically for everyday Indian workflows: Aadhaar tools, GST cash memos, Govt savings calculators, and Sarkari job notifications.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">Zero-Server Privacy</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Encrypted in-browser processing guarantees that no citizen documents, photos, or invoices ever leave the user&apos;s device.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Free &amp; Open</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Zero ads, zero paywalls, zero subscription fees. Operates at zero running cost through open-source innovation.
            </p>
          </div>
        </div>

        {/* Creator Attribution Section */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Meet the Creator &amp; Maintainer
          </h2>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              BL
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Bijoy Lohar
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Founder, Software Engineer &amp; Open-Source Contributor
              </p>
              <div className="pt-1 flex items-center gap-3">
                <a
                  href="https://github.com/loharbijoy2005-a11y"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-400"
                >
                  GitHub Profile <ArrowUpRight className="w-3 h-3" />
                </a>
                <span className="text-slate-300 dark:text-slate-700">•</span>
                <a
                  href="https://github.com/loharbijoy2005-a11y/BharatKits-Hub"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-indigo-500 hover:text-indigo-400"
                >
                  Source Code Repository <ArrowUpRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            BharatKits Hub was created to solve the real-world friction faced by small cyber cafe owners, freelancers, and students in tier-2 and tier-3 Indian towns — offering clean, instant tools that run locally without intrusive ads, expensive software licenses, or cloud privacy risks.
          </p>
        </div>
      </main>
    </div>
  );
}
