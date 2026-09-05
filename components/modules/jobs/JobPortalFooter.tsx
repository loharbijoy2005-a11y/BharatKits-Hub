"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Scale,
  FileText,
  Heart,
  ExternalLink,
  BookOpen,
  Landmark,
  Building2,
  Globe,
  Train,
  Mail,
  CreditCard,
  Cpu,
  Stethoscope,
  Briefcase,
  ArrowUpRight,
  Code2,
  Zap,
} from "lucide-react";
import { LegalDisclaimerModal } from "./LegalDisclaimerModal";
import { TakedownDialog } from "./TakedownDialog";

const SECTOR_LINKS = [
  { icon: BookOpen,    label: "Teaching & Education",   color: "text-rose-400",   desc: "CTET, KVS, NVS, BPSC TRE" },
  { icon: Mail,        label: "Panchayat & Postal",     color: "text-amber-400",  desc: "GDS, Gram Sachiv, Patwari" },
  { icon: Train,       label: "Railway",                color: "text-sky-400",    desc: "RRB NTPC, Group D, ALP" },
  { icon: ShieldCheck, label: "Police & Defence",       color: "text-red-400",    desc: "Constable, SI, CRPF, BSF" },
  { icon: Landmark,    label: "Central SSC & UPSC",     color: "text-indigo-400", desc: "CGL, CHSL, IAS, IPS" },
  { icon: Building2,   label: "State PSC & Subordinate",color: "text-orange-400", desc: "WBPSC, UPPSC, BPSC, MPSC" },
  { icon: CreditCard,  label: "Banking & Finance",      color: "text-cyan-400",   desc: "IBPS, SBI PO, RBI, LIC" },
  { icon: Cpu,         label: "PSU & Engineering",      color: "text-purple-400", desc: "BHEL, ONGC, ISRO, DRDO" },
  { icon: Stethoscope, label: "Medical & Health",       color: "text-teal-400",   desc: "AIIMS, NHM, ESIC, ANM" },
  { icon: Briefcase,   label: "Private & Corporate",    color: "text-blue-400",   desc: "IT, BPO, Startups, Remote" },
];

const QUICK_PORTALS = [
  { label: "Employment News",  url: "https://employmentnews.gov.in" },
  { label: "NCS Portal",       url: "https://ncs.gov.in" },
  { label: "SSC Official",     url: "https://ssc.gov.in" },
  { label: "UPSC Official",    url: "https://upsc.gov.in" },
  { label: "RRB NTPC",         url: "https://indianrailways.gov.in" },
  { label: "IBPS",             url: "https://ibps.in" },
];

export function JobPortalFooter() {
  const [legalModalOpen, setLegalModalOpen] = useState(false);
  const [legalTab, setLegalTab] = useState<"disclaimer" | "privacy" | "terms">("disclaimer");
  const [takedownOpen, setTakedownOpen] = useState(false);

  const openLegal = (tab: "disclaimer" | "privacy" | "terms") => {
    setLegalTab(tab);
    setLegalModalOpen(true);
  };

  return (
    <footer className="mt-16 relative overflow-hidden z-20">
      {/* Glowing Tricolor Top Accent Bar */}
      <div className="relative h-1 w-full flex shadow-[0_-4px_25px_rgba(245,158,11,0.25)]">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white dark:bg-slate-200" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Main Footer Body — Glassmorphism */}
      <div className="bg-slate-950/95 backdrop-blur-xl text-slate-300 relative border-t border-slate-800/80">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-indigo-900/15 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-amber-900/15 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── TOP COMPACT GRID ── */}
          <div className="py-8 sm:py-10 grid grid-cols-1 lg:grid-cols-12 gap-8 border-b border-slate-800/80 text-xs">

            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-md shadow-amber-900/40">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <div className="text-sm font-black text-white leading-tight">BharatKits Hub</div>
                  <div className="text-[9px] text-amber-400 font-extrabold uppercase tracking-widest">All India Job Portal</div>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                Zero-cost job aggregator for Central &amp; State Government vacancies, Teaching, Railways, Defence, Banking, PSUs &amp; Tech careers.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[10px] font-bold">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                Auto-updated every 6 hours via GitHub Actions
              </div>

              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-bold">
                  ⚡ 3 Mega-Sources
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold">
                  🛡️ Zero 404 Links
                </span>
              </div>
            </div>

            {/* 10 Sectors Grid */}
            <div className="lg:col-span-5 space-y-2.5">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                10 Authoritative Sectors Covered
              </h4>
              <div className="grid grid-cols-2 gap-1.5">
                {SECTOR_LINKS.map(({ icon: Icon, label, color }) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors group cursor-default"
                  >
                    <Icon className={`w-3.5 h-3.5 shrink-0 ${color}`} />
                    <span className="text-[10px] font-bold text-slate-300 truncate">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Column */}
            <div className="lg:col-span-3 space-y-4">
              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Official Govt Portals
                </h4>
                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px]">
                  {QUICK_PORTALS.map(({ label, url }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-slate-400 hover:text-amber-400 transition-colors truncate"
                    >
                      {label} ↗
                    </a>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Legal &amp; Compliance
                </h4>
                <ul className="space-y-1 text-[11px] text-slate-400">
                  <li>
                    <button onClick={() => openLegal("disclaimer")} className="hover:text-indigo-400 transition-colors text-left">
                      Legal Disclaimer
                    </button>
                  </li>
                  <li>
                    <button onClick={() => openLegal("privacy")} className="hover:text-indigo-400 transition-colors text-left">
                      Privacy Policy
                    </button>
                  </li>
                  <li>
                    <button onClick={() => setTakedownOpen(true)} className="hover:text-rose-400 font-semibold transition-colors text-rose-400 text-left">
                      🛡️ Content Removal Request
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── DISCLAIMER BANNER ── */}
          <div className="py-3 border-b border-slate-800/60">
            <p className="text-[10px] text-slate-500 text-center leading-relaxed max-w-3xl mx-auto">
              <span className="font-bold text-amber-500">⚠️ Disclaimer:</span> Independent informational aggregator; not affiliated with any government recruitment board. All job notices belong to respective authorities.
            </p>
          </div>

          {/* ── BOTTOM COPYRIGHT BAR ── */}
          <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-5">
            {/* Premium Creator VFX Holographic Avatar Card */}
            <div className="flex items-center gap-3.5 text-center sm:text-left">
              <a
                href="https://github.com/loharbijoy2005-a11y"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block shrink-0"
                title="Bijoy Lohar - Founder &amp; Lead Architect"
              >
                {/* Outer animated neon aura glow */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 opacity-80 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" />
                
                {/* Holographic border frame container */}
                <div className="relative w-12 h-12 sm:w-13 sm:h-13 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 shadow-xl">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950 flex items-center justify-center relative">
                    <img
                      src="https://avatars.githubusercontent.com/u/255526760?v=4"
                      alt="Bijoy Lohar - Creator of BharatKits Hub"
                      className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                    />
                    {/* Cyber scanline ambient highlight */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-transparent to-indigo-500/10 pointer-events-none" />
                  </div>
                </div>

                {/* Online status indicator badge */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
                </span>
              </a>

              <div className="space-y-0.5 text-xs text-slate-400">
                <div className="font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-1.5">
                  <span>© 2026</span>
                  <a
                    href="https://github.com/loharbijoy2005-a11y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 font-extrabold hover:text-amber-300 transition-colors inline-flex items-center gap-0.5 group"
                  >
                    Bijoy Lohar <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
                <div className="text-[11px] text-slate-400 font-medium">
                  Founder &amp; Lead Architect • Designed with ❤️ in India
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 shadow-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Zero-Server Retention Architecture · 100% Encrypted</span>
            </div>
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
