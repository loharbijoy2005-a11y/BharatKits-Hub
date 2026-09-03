"use client";
import React, { useState } from "react";
import { ShieldCheck, Scale, FileText, Heart, ExternalLink } from "lucide-react";
import { LegalDisclaimerModal } from "./LegalDisclaimerModal";
import { TakedownDialog } from "./TakedownDialog";

export function JobPortalFooter() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"disclaimer" | "privacy" | "terms">("disclaimer");
  const [takedownOpen, setTakedownOpen] = useState(false);

  const openLegal = (tab: "disclaimer" | "privacy" | "terms") => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md">
      {/* Top Footer Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Purpose */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 bg-clip-text text-transparent">
                BharatKits All India Job Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
                100% Free
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              Empowering Indian students and professionals with zero-cost, centralized access to 100% of Central Government, State Subordinate Services, and Private Tech vacancies with verified direct notification links.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                🏛️ Central & State Govt
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                💼 Top Tech Companies
              </span>
              <span>•</span>
              <span className="inline-flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
                ⚡ Updated Every 6 Hours
              </span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Official Portals
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <a
                  href="https://www.ncs.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  National Career Service (NCS)
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://ssc.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  Staff Selection Commission (SSC)
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://upsc.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  UPSC Portal
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.rrbapply.gov.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
                >
                  Railway Recruitment Board
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Compliance & Legal */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Legal & Trust
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li>
                <button
                  onClick={() => openLegal("disclaimer")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <Scale className="w-3.5 h-3.5" />
                  Legal Disclaimer
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal("privacy")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Privacy Statement
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal("terms")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Terms of Information
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTakedownOpen(true)}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline transition-colors flex items-center gap-1.5 text-left"
                >
                  🛡️ Request Content Removal
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Informational Disclaimer Banner */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-amber-50/40 dark:bg-amber-950/20 py-3">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Disclaimer:</strong> This portal is an independent informational aggregator and is not affiliated with any government agency or corporate employer. All job details and trademarks belong to their respective owners. Users must verify notifications on the official source before applying.
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 py-4 bg-slate-100/50 dark:bg-slate-950/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="font-semibold text-slate-700 dark:text-slate-300">
            © 2026 Bijoy Lohar. All Rights Reserved. Designed &amp; Maintained by Bijoy Lohar.
          </div>
          <div className="flex items-center gap-1 text-[11px] text-slate-400">
            Made with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 mx-0.5" /> for the Youth of India
          </div>
        </div>
      </div>

      {/* Modals */}
      <LegalDisclaimerModal
        isOpen={legalModalOpen}
        onClose={() => setLegalModalOpen(false)}
        defaultTab={legalTab}
      />
      <TakedownDialog
        isOpen={takedownOpen}
        onClose={() => setTakedownOpen(false)}
      />
    </footer>
  );
}
