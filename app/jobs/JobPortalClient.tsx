"use client";
import React, { useState } from "react";
import { Header } from "@/components/shared/Header";
import JobPortal from "@/components/modules/jobs/JobPortal";
import { useRouter } from "next/navigation";
import { ArrowLeft, Landmark, Heart } from "lucide-react";
import Link from "next/link";

export default function JobPortalClient() {
  const router = useRouter();
  const [headerSearch, setHeaderSearch] = useState("");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 selection:bg-amber-500 selection:text-white transition-colors duration-300">
      {/* Shared Header */}
      <Header
        searchVal={headerSearch}
        onSearch={setHeaderSearch}
        onGoHome={() => router.push("/")}
        showSearch={false}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to BharatKits Hub
          </Link>

          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
            <span>🇮🇳 Free Public Utility</span>
            <span>•</span>
            <span className="text-emerald-600 dark:text-emerald-400">Zero Commercial Ads</span>
          </div>
        </div>

        {/* Master Job Portal View */}
        <JobPortal />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200/80 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-md mt-12 py-8 text-center text-xs text-slate-500 space-y-2">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-slate-700 dark:text-slate-300">
            <Landmark className="w-4 h-4 text-amber-500" />
            BharatKits All India Job Portal • Zero Running Cost Engine
          </div>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" /> for Indian Aspirants & Job Seekers
          </div>
        </div>
      </footer>
    </div>
  );
}
