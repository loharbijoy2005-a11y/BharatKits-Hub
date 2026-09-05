"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import GovtDirectory from "@/components/modules/directory/GovtDirectory";
import GovtImageResizer from "@/components/modules/media/GovtImageResizer";
import IdPdfCombiner from "@/components/modules/media/IdPdfCombiner";
import PassportPhotoMaker from "@/components/modules/media/PassportPhotoMaker";
import BiodataGenerator from "@/components/modules/media/BiodataGenerator";
import UpiQrGenerator from "@/components/modules/productivity/UpiQrGenerator";
import GstSplitter from "@/components/modules/calculators/GstSplitter";
import AgeChrono from "@/components/modules/calculators/AgeChrono";
import EmiCalculator from "@/components/modules/calculators/EmiCalculator";
import CashMemoGenerator from "@/components/modules/calculators/CashMemoGenerator";
import GovtSavingsCalculator from "@/components/modules/calculators/GovtSavingsCalculator";
import ImagePdfBuilder from "@/components/modules/media/ImagePdfBuilder";
import AadhaarMasker from "@/components/modules/media/AadhaarMasker";
import HindiFontConverter from "@/components/modules/productivity/HindiFontConverter";
import AffidavitGenerator from "@/components/modules/productivity/AffidavitGenerator";
import AadhaarQrScanner from "@/components/modules/productivity/AadhaarQrScanner";
import HtmlPdfStudio from "@/components/modules/productivity/HtmlPdfStudio";
import PdfEditorStudio from "@/components/modules/media/PdfEditorStudio";
import JobPortal from "@/components/modules/jobs/JobPortal";

import {
  Landmark,
  Shrink,
  FileImage,
  FileText,
  QrCode,
  Calculator,
  CalendarDays,
  Coins,
  ArrowLeft,
  Search,
  X,
  ShieldCheck,
  Receipt,
  PiggyBank,
  Languages,
  FileSignature,
  ScanLine,
  ShieldAlert,
  FileCode2,
  PenTool,
  Briefcase,
} from "lucide-react";

interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: "directory" | "cyber-cafe" | "calculators";
  color: string;
  tags: string[];
}

const tools: ToolItem[] = [
  {
    id: "job-portal",
    title: "All India Job Portal (Sarkari & Private)",
    description:
      "Automated job aggregator for Central & State Govt (SSC, UPSC, RRB) and top Private Tech careers with official PDF downloads & direct links.",
    icon: Briefcase,
    category: "directory",
    color: "from-amber-500 via-orange-500 to-indigo-600",
    tags: [
      "sarkari result",
      "sarkari job",
      "ssc cgl",
      "upsc",
      "railway job",
      "all india jobs",
      "bank po",
      "private jobs",
    ],
  },
  {
    id: "govt-directory",
    title: "Direct Govt Portals Directory",
    description:
      "One-click links to UIDAI, Pan UTI/NSDL, Parivahan, and State Portals.",
    icon: Landmark,
    category: "directory",
    color: "from-blue-500 to-indigo-500",
    tags: [
      "uidai",
      "pan uti nsdl",
      "parivahan",
      "state portals",
      "official links",
      "govt directory",
      "voter id",
    ],
  },
  {
    id: "resizer-compressor",
    title: "Govt Exam Photo & Sign Resizer",
    description:
      "Pre-set dimensions & KB limits for SSC, UPSC, IBPS, Police, Railway.",
    icon: Shrink,
    category: "cyber-cafe",
    color: "from-rose-500 to-red-500",
    tags: [
      "photo resize",
      "signature resize",
      "ssc photo",
      "upsc photo",
      "ibps",
      "police",
      "railway photo",
      "kb limits",
      "compress image",
      "crop photo",
    ],
  },
  {
    id: "passport-photo-sheet",
    title: "Passport Photo Sheet Maker",
    description:
      "Convert 1 portrait into 6, 8, or 12 passport prints on 4x6 / A4.",
    icon: FileImage,
    category: "cyber-cafe",
    color: "from-amber-500 to-orange-500",
    tags: [
      "passport photo",
      "photo sheet",
      "4x6 print",
      "a4 photo print",
      "passport sheet maker",
      "cyber cafe prints",
      "id card print",
    ],
  },
  {
    id: "pdf-editor",
    title: "Smart PDF Toolkit",
    description:
      "Merge, compress, and organize PDF pages securely.",
    icon: FileText,
    category: "cyber-cafe",
    color: "from-indigo-600 via-purple-600 to-pink-600",
    tags: [
      "smart pdf toolkit",
      "merge pdf",
      "compress pdf",
      "organize pdf",
      "pdf editor",
      "pdf studio",
      "edit pdf",
      "sign pdf",
    ],
  },
  {
    id: "age-date",
    title: "Govt Exam Cut-off Age Calculator",
    description:
      "Calculate age on a specific cut-off date (years, months, days).",
    icon: CalendarDays,
    category: "calculators",
    color: "from-amber-500 to-orange-500",
    tags: [
      "cut off age calculator",
      "govt exam age",
      "age calculation",
      "ssc age limit",
      "upsc age calc",
      "exact age",
    ],
  },
  {
    id: "biodata-generator",
    title: "Quick Biodata & Resume Builder",
    description:
      "Clean single-page PDF generator for jobs and matrimony.",
    icon: FileText,
    category: "cyber-cafe",
    color: "from-fuchsia-500 to-pink-500",
    tags: [
      "resume builder",
      "biodata maker",
      "matrimony biodata",
      "job resume",
      "cv generator",
      "marriage bio",
    ],
  },
  {
    id: "affidavit-generator",
    title: "Affidavit & Rent Agreement Drafts",
    description:
      "Standard editable templates for stamp paper printing.",
    icon: FileSignature,
    category: "cyber-cafe",
    color: "from-amber-500 to-yellow-600",
    tags: [
      "affidavit",
      "rent agreement",
      "stamp paper template",
      "legal drafts",
      "gap certificate",
      "self declaration",
    ],
  },
  {
    id: "gst-emi-calculator",
    title: "GST & Loan EMI Calculator",
    description:
      "Instant tax breakup and monthly installment summary.",
    icon: Calculator,
    category: "calculators",
    color: "from-emerald-500 to-teal-500",
    tags: [
      "gst calculator",
      "loan emi",
      "tax breakup",
      "monthly installment",
      "interest calculator",
      "bill split",
    ],
  },
];

import { GovLoadingBar } from "@/components/shared/GovLoadingBar";

export default function Page() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [isNavigating, setIsNavigating] = useState<boolean>(false);

  // Force scroll to top on initial page load / visit
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, []);

  // Handle high-speed government-grade view transition & scroll reset
  const handleViewChange = (newView: string) => {
    if (newView === activeView) return;
    setIsNavigating(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setActiveView(newView);
    setTimeout(() => setIsNavigating(false), 180);
  };

  const handleCatChange = (newCat: string) => {
    if (newCat === activeCat) return;
    setIsNavigating(true);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
    setActiveCat(newCat);
    setTimeout(() => setIsNavigating(false), 180);
  };

  const activeTool = tools.find((t) => t.id === activeView);

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCat === "all" || tool.category === activeCat;
      
    const matchesSearch =
      tool.title.toLowerCase().includes(searchVal.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchVal.toLowerCase()) ||
      tool.tags.some((tag) => tag.toLowerCase().includes(searchVal.toLowerCase()));
      
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === "directory") return "Official Directory";
    if (cat === "cyber-cafe") return "Cyber Cafe Tools";
    if (cat === "calculators") return "Calculators";
    return "";
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Top Slim Government Loading Bar */}
      <GovLoadingBar isLoading={isNavigating} />

      {/* Background Graphic Blobs */}
      <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-orange-200 dark:bg-orange-950/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5 animate-blob"></div>
        <div className="absolute top-1/4 -right-10 w-96 h-96 bg-blue-200 dark:bg-blue-950/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-emerald-100 dark:bg-emerald-950/10 rounded-full mix-blend-multiply filter blur-3xl opacity-20 dark:opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* Global Header */}
      <Header
        searchVal={searchVal}
        onSearch={setSearchVal}
        onGoHome={() => handleViewChange("dashboard")}
        showSearch={activeView === "dashboard"}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div
          key={activeView + activeCat}
          role="region"
          aria-live="polite"
          aria-busy={isNavigating}
          className="animate-gov-page-transition"
        >
          {activeView === "dashboard" ? (
            <div className="space-y-8">
            {/* Hero & Sub-Header Section */}
            <div className="text-center max-w-2xl mx-auto space-y-4">
              {/* Flag Badge & Tagline Clean-up */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 dark:bg-slate-900 border border-slate-700/60 text-xs font-bold text-slate-200 shadow-sm">
                <span>🇮🇳</span>
                <span>Jai Hind • Dedicated to Indian Citizens &amp; Cyber Cafes</span>
              </div>

              {/* Main Title */}
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                Bharat
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 dark:from-orange-400 dark:via-amber-400 dark:to-emerald-400 bg-clip-text text-transparent ml-1.5">
                  Kits Hub
                </span>
              </h1>

              {/* Clean Subtitle */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed font-semibold">
                Instant browser-based utilities for daily citizen &amp; cyber cafe tasks
              </p>

              {/* Centered Search Bar Section */}
              <div className="w-full flex justify-center items-center my-6">
                <div className="relative max-w-2xl w-full mx-auto">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400 dark:text-slate-500">
                    <Search className="w-5 h-5" />
                  </span>
                  <input
                    type="search"
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    placeholder="Search citizen tools... (e.g. Sarkari job, photo resize, Aadhaar, PAN)"
                    className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm font-bold focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 shadow-md"
                  />
                  {searchVal ? (
                    <button
                      onClick={() => setSearchVal("")}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                      title="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  ) : (
                    <span className="hidden sm:flex absolute inset-y-0 right-0 items-center pr-4 pointer-events-none">
                      <kbd className="px-2 py-0.5 text-[10px] font-mono font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-md">
                        Ctrl K
                      </kbd>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Category tabs pills */}
            <div className="flex justify-center">
              <div className="flex gap-1.5 p-1 bg-slate-200/70 dark:bg-slate-800/80 rounded-2xl border border-slate-300 dark:border-slate-700 w-fit max-w-full overflow-x-auto scrollbar-none">
                {[
                  { id: "all", label: "All Tools" },
                  { id: "directory", label: "Govt Portals & Jobs" },
                  { id: "cyber-cafe", label: "Cyber Cafe" },
                  { id: "calculators", label: "Calculators" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={(e) => {
                      e.preventDefault();
                      handleCatChange(cat.id);
                    }}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 whitespace-nowrap ${
                      activeCat === cat.id
                        ? "bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm border border-slate-200 dark:border-slate-800"
                        : "text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-slate-800/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            {filteredTools.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 dark:text-slate-400 max-w-md mx-auto text-center">
                <Search className="w-12 h-12 text-slate-350 dark:text-slate-700 animate-pulse mb-3" />
                <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-200">
                  No matching utility tools found
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Try typing Hinglish keywords like &apos;challan&apos;, &apos;rashan&apos;, or &apos;pan aadhar&apos;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleViewChange(tool.id)}
                      className="group relative rounded-3xl utility-card p-6 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs hover:border-orange-400/50 dark:hover:border-orange-500/50"
                    >
                      <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-[0.03] group-hover:opacity-15 rounded-full transition-all duration-500 blur-xl`} />
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md shadow-orange-500/10`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 select-none">
                            {getCategoryLabel(tool.category)}
                          </span>
                        </div>
                        
                        <h3 className="text-base font-black text-slate-900 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                          {tool.title}
                        </h3>
                        
                        <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-relaxed mb-6">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-orange-600 dark:text-orange-400 font-extrabold text-xs mt-auto group-hover:gap-2.5 transition-all">
                        Launch Tool
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Workspace Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleViewChange("dashboard")}
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/40"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
                </button>
                <div className="h-6 w-px bg-slate-200 dark:bg-slate-800 hidden sm:block"></div>
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-lg bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center">
                    {activeTool && React.createElement(activeTool.icon, { className: "w-4 h-4 text-brand-600 dark:text-brand-400" })}
                  </span>
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white">
                    {activeTool?.title}
                  </h2>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hidden sm:inline select-none">
                    {activeTool && getCategoryLabel(activeTool.category)}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Workspace Switcher */}
            <div className="w-full">
              {activeView === "job-portal" && <JobPortal />}
              {activeView === "govt-directory" && <GovtDirectory />}
              {activeView === "resizer-compressor" && <GovtImageResizer />}
              {activeView === "passport-photo-sheet" && <PassportPhotoMaker />}
              {activeView === "id-card-combiner" && <IdPdfCombiner />}
              {activeView === "image-pdf" && <PdfEditorStudio />}
              {activeView === "biodata-generator" && <BiodataGenerator />}
              {activeView === "gst-emi-calculator" && <EmiCalculator />}
              {activeView === "gst-split" && <GstSplitter />}
              {activeView === "age-date" && <AgeChrono />}
              {activeView === "emi-calculator" && <EmiCalculator />}
              {activeView === "cash-memo" && <CashMemoGenerator />}
              {activeView === "govt-savings" && <GovtSavingsCalculator />}
              {activeView === "document-scanner" && <PdfEditorStudio />}
              {activeView === "aadhaar-masker" && <AadhaarMasker />}
              {activeView === "hindi-font-converter" && <HindiFontConverter />}
              {activeView === "affidavit-generator" && <AffidavitGenerator />}
              {activeView === "html-to-pdf" && <PdfEditorStudio />}
              {activeView === "pdf-editor" && <PdfEditorStudio />}
            </div>
          </div>
        )}
        </div>
      </main>

      {/* Global Footer — Ultra-Compact & Glassmorphism Neon VFX */}
      <footer className="mt-16 relative overflow-hidden z-20">
        {/* Glowing Tricolor Top Accent Line with Ambient Glow Aura */}
        <div className="relative h-1 w-full flex shadow-[0_-4px_25px_rgba(245,158,11,0.25)]">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white dark:bg-slate-200" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="bg-slate-950/95 backdrop-blur-xl text-slate-300 relative border-t border-slate-800/80">
          {/* Ambient VFX Backdrop Glow Blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 left-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-orange-500/10 via-amber-500/5 to-transparent blur-3xl" />
            <div className="absolute -bottom-24 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ── BALANCED 4-COLUMN GRID (NO BLANK SPOTS) ── */}
            <div className="py-8 sm:py-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 border-b border-slate-800/70 text-xs">

              {/* Col 1: Brand & Digital India Mission */}
              <div className="space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 via-amber-500 to-emerald-600 flex items-center justify-center shadow-md shadow-orange-500/20">
                    <ShieldCheck className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white tracking-tight">BharatKits Hub</div>
                    <div className="text-[9px] text-orange-400 font-extrabold uppercase tracking-widest">Digital India Citizen Utility</div>
                  </div>
                </div>

                <p className="text-slate-400 text-[11px] leading-relaxed">
                  100% free browser-based utility platform for Indian citizens, cyber cafes &amp; students. Zero server tracking.
                </p>

                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900/90 border border-slate-800 text-[10px]">
                  <span className="text-base">🇮🇳</span>
                  <span className="font-bold text-slate-200">Made for Digital India • Jai Hind 🙏</span>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-emerald-400 font-bold">
                    🔒 100% Client-Side
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] text-amber-400 font-bold">
                    ⚡ Zero Cost
                  </span>
                </div>
              </div>

              {/* Col 2: Cyber Cafe Tools */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                  Cyber Cafe Utilities
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  {[
                    { label: "PDF Editor & Signer", key: "pdf-editor" },
                    { label: "ID Card Front-Back Combiner", key: "id-card-combiner" },
                    { label: "Govt Form Image Resizer", key: "resizer-compressor" },
                    { label: "Passport Photo Sheet Maker", key: "passport-photo-sheet" },
                    { label: "Quick Biodata & Resume Builder", key: "biodata-generator" },
                    { label: "Affidavit & Legal Drafts", key: "affidavit-generator" },
                  ].map((item) => (
                    <li
                      key={item.key}
                      className="hover:text-orange-400 transition-colors cursor-pointer flex items-center gap-1 group"
                      onClick={() => handleViewChange(item.key)}
                    >
                      <span className="text-slate-600 group-hover:text-orange-400 transition-colors">›</span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 3: Calculators & Direct Portals */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Calculators &amp; Portals
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  {[
                    { label: "Govt Exam Cut-Off Age Calc", key: "age-date" },
                    { label: "GST & Loan EMI Calculator", key: "gst-emi-calculator" },
                    { label: "Govt Direct Portal Directory", key: "govt-directory" },
                    { label: "UPI Payment QR Studio", key: "dashboard" },
                    { label: "Aadhaar Masker & Privacy", key: "aadhaar-masker" },
                    { label: "Hindi Font Converter", key: "hindi-font-converter" },
                  ].map((item) => (
                    <li
                      key={item.label}
                      className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1 group"
                      onClick={() => handleViewChange(item.key)}
                    >
                      <span className="text-slate-600 group-hover:text-emerald-400 transition-colors">›</span>
                      <span>{item.label}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Col 4: All India Jobs & Compliance Links */}
              <div className="space-y-2.5">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                  Jobs &amp; Compliance
                </h4>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  <li
                    className="hover:text-amber-400 transition-colors cursor-pointer font-bold text-amber-300 flex items-center gap-1 group"
                    onClick={() => handleViewChange("job-portal")}
                  >
                    <span className="text-amber-400">🔥</span>
                    <span>All India Sarkari &amp; Private Jobs</span>
                  </li>
                  <li>
                    <Link href="/privacy" className="hover:text-indigo-400 transition-colors">
                      Privacy Policy
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="hover:text-indigo-400 transition-colors">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/disclaimer" className="hover:text-indigo-400 transition-colors">
                      Legal Disclaimer
                    </Link>
                  </li>
                  <li>
                    <Link href="/takedown" className="hover:text-rose-400 font-semibold transition-colors text-rose-400">
                      🛡️ Content Takedown
                    </Link>
                  </li>
                  <li>
                    <a
                      href="https://github.com/loharbijoy2005-a11y/BharatKits-Hub"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-orange-400 transition-colors inline-flex items-center gap-1"
                    >
                      GitHub Repo ↗
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            {/* ── COMPACT DISCLAIMER BAR ── */}
            <div className="py-3 border-b border-slate-800/50">
              <p className="text-[10px] text-slate-500 text-center leading-relaxed max-w-3xl mx-auto">
                <span className="font-bold text-amber-500">⚠️ Notice:</span> BharatKits Hub is an open-source citizen utility platform. All operations process locally inside your browser; no document data or scans are transmitted to any server.
              </p>
            </div>

            {/* ── Sleek COPYRIGHT & VFX CREATOR BAR ── */}
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
                      Bijoy Lohar <span className="text-[10px] group-hover:translate-x-0.5 transition-transform">↗</span>
                    </a>
                  </div>
                  <div className="text-[11px] text-slate-400 font-medium">
                    Founder &amp; Lead Architect • Designed with ❤️ in India
                  </div>
                </div>
              </div>

              {/* Zero Retention Badge */}
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] text-slate-400 shadow-sm">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Zero Server Logs Architecture · 100% Encrypted</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
