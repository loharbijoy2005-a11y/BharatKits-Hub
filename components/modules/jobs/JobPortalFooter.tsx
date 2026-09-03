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
    <footer className="mt-20 relative overflow-hidden">
      {/* Tricolor Top Accent Bar */}
      <div className="h-1 w-full flex">
        <div className="flex-1 bg-[#FF9933]" />
        <div className="flex-1 bg-white dark:bg-slate-300" />
        <div className="flex-1 bg-[#138808]" />
      </div>

      {/* Main Footer Body */}
      <div className="bg-slate-950 text-slate-300 relative">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-32 left-1/4 w-96 h-96 rounded-full bg-indigo-900/20 blur-3xl" />
          <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full bg-amber-900/15 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* ── TOP SECTION ── */}
          <div className="py-12 grid grid-cols-1 lg:grid-cols-12 gap-10 border-b border-slate-800/80">

            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-5">
              {/* Logo & Name */}
              <div className="space-y-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center shadow-lg shadow-amber-900/40">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <div className="text-base font-black text-white leading-tight">BharatKits Hub</div>
                    <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">All India Job Portal</div>
                  </div>
                </div>

                {/* Live Indicator */}
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-[11px] font-bold">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                  </span>
                  Auto-updated every 6 hours via GitHub Actions
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                India's first zero-cost, fully automated job aggregator covering all Central & State Government vacancies, Teaching/TET commissions, Railways, Defence, Banking, PSUs, and top Corporate/IT employers — with verified direct apply links.
              </p>

              {/* Digital India Badge */}
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#FF9933]/10 via-white/5 to-[#138808]/10 border border-slate-800">
                <span className="text-2xl">🇮🇳</span>
                <div>
                  <div className="text-xs font-black text-white">Made for Digital India</div>
                  <div className="text-[10px] text-slate-500">Jai Hind 🙏</div>
                </div>
              </div>

              {/* Automation Badges */}
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold">
                  <Zap className="w-3 h-3 text-amber-400" /> 3 Mega-Sources
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold">
                  <ShieldCheck className="w-3 h-3 text-emerald-400" /> Zero 404 Links
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold">
                  <Code2 className="w-3 h-3 text-slate-400" /> Open Source
                </span>
              </div>
            </div>

            {/* 10 Sectors Grid */}
            <div className="lg:col-span-5 space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                10 Authoritative Sectors Covered
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SECTOR_LINKS.map(({ icon: Icon, label, color, desc }) => (
                  <div
                    key={label}
                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors group"
                  >
                    <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${color} group-hover:scale-110 transition-transform`} />
                    <div className="min-w-0">
                      <div className="text-[11px] font-bold text-slate-200 truncate">{label}</div>
                      <div className="text-[10px] text-slate-500 truncate">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Links Column */}
            <div className="lg:col-span-3 space-y-6">
              {/* Official Portals */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Official Govt Portals
                </h4>
                <ul className="space-y-2">
                  {QUICK_PORTALS.map(({ label, url }) => (
                    <li key={label}>
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-slate-400 hover:text-amber-400 transition-colors group"
                      >
                        <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity -ml-0.5" />
                        <ExternalLink className="w-3 h-3 group-hover:hidden" />
                        {label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">
                  Legal &amp; Compliance
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/disclaimer"
                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <Scale className="w-3.5 h-3.5" /> Legal Disclaimer
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/privacy"
                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" /> Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/terms"
                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-indigo-400 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" /> Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/takedown"
                      className="flex items-center gap-2 text-xs text-amber-500 hover:text-amber-300 font-bold transition-colors"
                    >
                      🛡️ Content Removal Request
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="flex items-center gap-2 text-xs text-slate-400 hover:text-orange-400 transition-colors"
                    >
                      <Globe className="w-3.5 h-3.5" /> About BharatKits
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* ── DISCLAIMER BANNER ── */}
          <div className="py-4 border-b border-slate-800/60">
            <p className="text-[11px] text-slate-500 text-center leading-relaxed max-w-4xl mx-auto">
              <span className="font-bold text-amber-600">⚠️ Legal Disclaimer:</span>{" "}
              This portal is an independent informational aggregator and is{" "}
              <span className="font-semibold text-slate-400">not affiliated</span> with any government recruitment board or private employer.
              All job notices belong to their respective authorities. Users must verify all details on the official portals before applying.
              Apply link verification is performed via automated HTTP HEAD checks — dead links are replaced with the verified parent portal.
            </p>
          </div>

          {/* ── BOTTOM COPYRIGHT BAR ── */}
          <div className="py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Creator VFX Card */}
            <div className="flex items-center gap-4 text-center md:text-left">
              {/* VFX Glowing Avatar Frame */}
              <a
                href="https://github.com/loharbijoy2005-a11y"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block shrink-0"
                title="Bijoy Lohar - Founder &amp; Lead Architect"
              >
                {/* Outer animated neon aura glow */}
                <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 opacity-75 blur-md group-hover:opacity-100 group-hover:blur-lg transition-all duration-500 animate-pulse" />
                
                {/* Holographic border container */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl p-0.5 bg-gradient-to-br from-amber-400 via-rose-500 to-indigo-600 shadow-2xl">
                  <div className="w-full h-full rounded-[14px] overflow-hidden bg-slate-950 flex items-center justify-center relative">
                    <img
                      src="https://avatars.githubusercontent.com/u/255526760?v=4"
                      alt="Bijoy Lohar - Creator of BharatKits Hub"
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {/* Cyber scanline highlight */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Online status indicator badge */}
                <span className="absolute -bottom-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-slate-950" />
                </span>
              </a>

              {/* Creator Title & Copyright */}
              <div className="space-y-0.5">
                <div className="text-[14px] font-black text-white tracking-tight flex items-center justify-center md:justify-start gap-2">
                  <span>© 2026 Bijoy Lohar. All Rights Reserved.</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center justify-center md:justify-start gap-1.5 flex-wrap">
                  <span>Designed &amp; Developed by</span>
                  <a
                    href="https://github.com/loharbijoy2005-a11y"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 font-bold hover:text-amber-300 transition-colors inline-flex items-center gap-1 group"
                  >
                    Bijoy Lohar <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            </div>

            {/* Privacy & Architecture Badge */}
            <div className="flex flex-col sm:flex-row items-center gap-3 text-center md:text-right">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-[11px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Zero-Server Retention Architecture · Encrypted Processing</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">Made for Digital India</span>
                <span className="text-xl" title="Jai Hind 🇮🇳">🇮🇳</span>
              </div>
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
