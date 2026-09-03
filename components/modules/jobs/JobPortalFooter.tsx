"use client";
import React, { useState } from "react";
import { ShieldCheck, Scale, FileText, Heart, ExternalLink, BookOpen, Landmark, Building2, Globe } from "lucide-react";
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
    <footer className="mt-16 border-t border-slate-200 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      {/* Top Section: Mission & Quick Sector Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Mission */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl font-black bg-gradient-to-r from-amber-600 via-rose-600 to-indigo-600 bg-clip-text text-transparent">
                BharatKits All India Job Portal
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                100% Free Public Utility
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-lg">
              Empowering Indian youth, educators, and professionals with centralized, zero-cost access to 100% of Central Government, State Subordinate, Teaching/TET Commissions, and Corporate Tech vacancies with direct verified notification links.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300">
              <Globe className="w-4 h-4 text-indigo-500" />
              <span>🇮🇳 Made for Digital India</span>
            </div>
          </div>

          {/* Quick Sector Portals */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Key Ingestion Sectors
            </h4>
            <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-rose-500" />
                <span>Teaching &amp; TET (CTET, KVS, BPSC)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Landmark className="w-3.5 h-3.5 text-amber-500" />
                <span>State PSCs &amp; Police Boards</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Central Commissions (SSC, UPSC, RRB)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                <span>Public ATS &amp; Corporate Tech</span>
              </li>
            </ul>
          </div>

          {/* Legal Compliance & Content Moderation */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-200">
              Compliance &amp; Trust
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
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => openLegal("terms")}
                  className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1.5 text-left"
                >
                  <FileText className="w-3.5 h-3.5" />
                  Terms of Service
                </button>
              </li>
              <li>
                <button
                  onClick={() => setTakedownOpen(true)}
                  className="text-amber-600 dark:text-amber-400 font-bold hover:underline transition-colors flex items-center gap-1.5 text-left"
                >
                  🛡️ Content Removal Request Form
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Middle Section: Disclaimer Banner */}
      <div className="border-t border-slate-200/60 dark:border-slate-800/60 bg-amber-50/50 dark:bg-amber-950/20 py-3.5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
          <strong>Legal Disclaimer:</strong> This portal is an independent informational aggregator and is not affiliated with any government recruitment board or private employer. All notices belong to their respective authorities. Users must verify details on the official portals before applying.
        </div>
      </div>

      {/* Bottom Copyright Bar */}
      <div className="border-t border-slate-200/80 dark:border-slate-800/80 py-4 bg-slate-100/60 dark:bg-slate-950/80">
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
