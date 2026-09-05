"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/shared/Header";
import GovtDirectory from "@/components/modules/directory/GovtDirectory";
import GovtImageResizer from "@/components/modules/media/GovtImageResizer";
import IdPdfCombiner from "@/components/modules/media/IdPdfCombiner";
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
  ShieldCheck,
  Star,
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
      "rrb ntpc",
      "bank po",
      "private jobs",
      "tech jobs",
      "fresher jobs",
      "naukri",
      "gov jobs",
      "job portal",
      "jobs",
    ],
  },
  {
    id: "govt-directory",
    title: "Govt Portal Directory",
    description:
      "Direct filtered links for identity updates, DL/RC, e-Challan checks, and state land records.",
    icon: Landmark,
    category: "directory",
    color: "from-blue-500 to-indigo-500",
    tags: [
      "gov",
      "government",
      "voter id",
      "pan card",
      "aadhar",
      "uidai",
      "challan",
      "chalan",
      "gadi",
      "driving licence",
      "rc",
      "digilocker",
      "udyam",
      "msme",
      "rashan",
      "ration card",
      "land records",
      "bhulekh",
      "banglarbhumi",
      "eshram",
    ],
  },
  {
    id: "resizer-compressor",
    title: "Govt Form Image Resizer",
    description:
      "Rescale photo and signature scans to exact government portal upload sizes (under 20KB/50KB).",
    icon: Shrink,
    category: "cyber-cafe",
    color: "from-rose-500 to-red-500",
    tags: [
      "photo resize",
      "signature resize",
      "photo sign crop",
      "compress image",
      "crop photo",
      "ssc photo",
      "upsc photo",
      "photo under 20kb",
      "photo under 50kb",
    ],
  },

  {
    id: "biodata-generator",
    title: "Biodata & Resume Builder",
    description:
      "Generate clean CV resumes or marriage biodata forms downloadable client-side as vector PDFs.",
    icon: FileText,
    category: "cyber-cafe",
    color: "from-fuchsia-500 to-pink-500",
    tags: ["resume", "biodata", "cv maker", "marriage bio", "job biodata", "resume maker"],
  },
  {
    id: "upi-qr",
    title: "UPI Payment QR Studio",
    description:
      "Generate scan-to-pay QR codes using custom UPI IDs, payee names, and amounts with instant download.",
    icon: QrCode,
    category: "cyber-cafe",
    color: "from-violet-500 to-purple-500",
    tags: ["upi payment scan link", "upi qr generator", "gpay qr", "phonepe qr", "bhim upi qr", "scan to pay"],
  },
  {
    id: "gst-split",
    title: "GST & Bill Splitter",
    description:
      "Calculate CGST/SGST/IGST tax rates with precision financial math and split bill shares among people.",
    icon: Calculator,
    category: "calculators",
    color: "from-emerald-500 to-teal-500",
    tags: ["gst split", "bill split", "cgst sgst", "tax calculator", "expense split", "split bill"],
  },
  {
    id: "emi-calculator",
    title: "Loan EMI Repayment Schedule",
    description:
      "Estimate monthly EMI payments and view full principal vs interest monthly amortization schedules.",
    icon: Coins,
    category: "calculators",
    color: "from-indigo-500 to-purple-500",
    tags: ["emi loan", "loan repayment schedule", "home loan emi", "car loan emi", "mortgage calculator"],
  },
  {
    id: "age-date",
    title: "Age & Chrono Engine",
    description:
      "Check exact chronological lived timings, countdown birthday milestones, and map zodiac signs.",
    icon: CalendarDays,
    category: "calculators",
    color: "from-amber-500 to-orange-500",
    tags: ["age check", "birthday countdown", "exact age", "zodiac sign", "date diff"],
  },
  {
    id: "cash-memo",
    title: "GST Cash Memo Generator",
    description:
      "Generate itemized shop cash memos with SGST/CGST and automatic Indian Rupee words conversion.",
    icon: Receipt,
    category: "cyber-cafe",
    color: "from-teal-500 to-emerald-500",
    tags: ["cash memo", "shop bill", "invoice maker", "shop receipt", "store bill"],
  },
  {
    id: "govt-savings",
    title: "Govt Savings Calculator",
    description:
      "Estimate returns for Sukanya Samriddhi Yojana (SSY), PPF, National Pension System (NPS), and Recurring Deposits (RD).",
    icon: PiggyBank,
    category: "calculators",
    color: "from-emerald-500 to-indigo-500",
    tags: [
      "ssy",
      "sukanya samriddhi",
      "ppf",
      "provident fund",
      "nps",
      "national pension",
      "rd",
      "recurring deposit",
      "savings calculator",
      "government schemes",
      "post office savings",
    ],
  },

  {
    id: "aadhaar-masker",
    title: "Aadhaar Card Secure Masker",
    description:
      "Upload your Aadhaar scan and securely mask the first 8 digits locally in browser before sharing.",
    icon: ShieldAlert,
    category: "cyber-cafe",
    color: "from-red-500 to-rose-500",
    tags: [
      "mask aadhaar",
      "hide aadhaar number",
      "aadhaar privacy",
      "redact aadhaar",
      "secure card masker",
      "citizen privacy",
    ],
  },
  {
    id: "hindi-font-converter",
    title: "Hindi Font Converter & Typing",
    description:
      "Phonetic Hinglish-to-Hindi transliteration editor and standard Hindi Unicode to Kruti Dev 010 font converter.",
    icon: Languages,
    category: "cyber-cafe",
    color: "from-violet-500 to-fuchsia-500",
    tags: [
      "hinglish to hindi",
      "unicode to kruti dev",
      "kruti dev 010",
      "hindi typing converter",
      "regional typing editor",
      "devlys to unicode",
    ],
  },
  {
    id: "affidavit-generator",
    title: "Affidavit & Legal Draft Builder",
    description:
      "Generate printable Rent Agreements, Gap Certificates, and self-declarations with stamp paper templates.",
    icon: FileSignature,
    category: "cyber-cafe",
    color: "from-amber-500 to-yellow-600",
    tags: [
      "rent agreement draft",
      "gap certificate affidavit",
      "address self declaration",
      "income declaration",
      "legal draft generator",
      "stamp paper pdf",
    ],
  },
  {
    id: "aadhaar-qr-scanner",
    title: "Aadhaar QR Scanner & Parser",
    description:
      "Scan Aadhaar QR via camera/file to decode Name, DOB, and Address with quick copy-paste badges.",
    icon: QrCode,
    category: "cyber-cafe",
    color: "from-teal-500 to-emerald-600",
    tags: [
      "aadhaar qr scanner",
      "decode aadhaar xml",
      "barcode parser",
      "demographic details reader",
      "cyber cafe helper",
      "copy name address",
    ],
  },
  {
    id: "pdf-editor",
    title: "All-in-One PDF Master Studio & Gallery Document Manager",
    description:
      "Upload & edit any PDF, append phone gallery photos/documents as new pages, combine ID cards, merge scans, add digital signatures, whiteout text, and export vector PDFs.",
    icon: FileText,
    category: "cyber-cafe",
    color: "from-indigo-600 via-purple-600 to-pink-600",
    tags: [
      "pdf editor",
      "pdf studio",
      "edit pdf",
      "sign pdf",
      "gallery photo to pdf",
      "add photo to pdf",
      "insert image pdf",
      "photo se pdf",
      "pdf compiler",
      "scanner clean filters",
      "black and white scan",
      "photocopy",
      "image stitch pdf",
      "id card print",
      "merge id cards",
      "combine aadhar",
      "html to pdf",
      "html converter",
      "html se pdf",
      "code to pdf",
      "pdf signature",
      "pdf text edit",
      "redact pdf",
      "highlight pdf",
      "pdf stamp",
    ],
  },
];

export default function Page() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeCat, setActiveCat] = useState<string>("all");
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("bharatkits_favorites");
      return saved ? JSON.parse(saved) : [];
    }
    return [];
  });

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = [...favorites];
    if (updated.includes(id)) {
      updated = updated.filter((item) => item !== id);
    } else {
      updated.push(id);
    }
    setFavorites(updated);
    localStorage.setItem("bharatkits_favorites", JSON.stringify(updated));
  };

  const activeTool = tools.find((t) => t.id === activeView);

  const filteredTools = tools.filter((tool) => {
    const matchesCategory =
      activeCat === "all" ||
      tool.category === activeCat ||
      (activeCat === "favorites" && favorites.includes(tool.id));
      
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
        onGoHome={() => setActiveView("dashboard")}
        showSearch={activeView === "dashboard"}
      />

      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeView === "dashboard" ? (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/30 text-xs font-black text-orange-800 shadow-2xs">
                <span>🇮🇳</span>
                <span>The Ultimate Digital India Citizen &amp; Cafe Utility Hub</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900">
                Bharat
                <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-emerald-600 bg-clip-text text-transparent ml-1.5">
                  Kits Hub
                </span>
              </h1>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-bold">
                100% Free &amp; Encrypted Local-First Citizen Utility Platform for India. Zero server logs, complete privacy, processing securely inside your browser.
              </p>
            </div>

            {/* Category tabs pills */}
            <div className="flex justify-center">
              <div className="flex gap-1.5 p-1 bg-slate-200/70 rounded-2xl border border-slate-300 w-fit max-w-full overflow-x-auto scrollbar-none">
                {[
                  { id: "all", label: "All Tools" },
                  { id: "directory", label: "Govt Portals" },
                  { id: "cyber-cafe", label: "Cyber Cafe" },
                  { id: "calculators", label: "Calculators" },
                  { id: "favorites", label: "Favorites ⭐" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`px-4 py-2 text-xs font-black rounded-xl transition-all duration-200 whitespace-nowrap ${
                      activeCat === cat.id
                        ? "bg-white text-orange-600 shadow-sm border border-slate-200"
                        : "text-slate-700 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            {filteredTools.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-slate-500 max-w-md mx-auto text-center">
                <Search className="w-12 h-12 text-slate-350 dark:text-slate-800 animate-pulse mb-3" />
                <h4 className="text-base font-extrabold text-slate-750 dark:text-slate-350">
                  No matching utility tools found
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Try typing Hinglish keywords like &apos;challan&apos;, &apos;rashan&apos;, or &apos;pan aadhar&apos;.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const isFav = favorites.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => setActiveView(tool.id)}
                      className="group relative rounded-3xl utility-card p-6 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between overflow-hidden bg-white border border-slate-200/90 shadow-2xs hover:border-orange-400/50"
                    >
                      <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-[0.03] group-hover:opacity-15 rounded-full transition-all duration-500 blur-xl`} />
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md shadow-orange-500/10`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200 select-none">
                              {getCategoryLabel(tool.category)}
                            </span>
                            
                            <button
                              onClick={(e) => toggleFavorite(tool.id, e)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-400"
                              title={isFav ? "Remove Favorite" : "Add Favorite"}
                            >
                              <Star className={`w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-orange-600 transition-colors">
                          {tool.title}
                        </h3>
                        
                        <p className="text-xs font-semibold text-slate-600 leading-relaxed mb-6">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-orange-600 font-extrabold text-xs mt-auto group-hover:gap-2.5 transition-all">
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
          <div className="space-y-6 animate-fade-in">
            {/* Workspace Navigation Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveView("dashboard")}
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
              {activeView === "image-pdf" && <PdfEditorStudio />}
              {activeView === "biodata-generator" && <BiodataGenerator />}
              {activeView === "upi-qr" && <UpiQrGenerator />}
              {activeView === "gst-split" && <GstSplitter />}
              {activeView === "age-date" && <AgeChrono />}
              {activeView === "emi-calculator" && <EmiCalculator />}
              {activeView === "cash-memo" && <CashMemoGenerator />}
              {activeView === "govt-savings" && <GovtSavingsCalculator />}
              {activeView === "document-scanner" && <PdfEditorStudio />}
              {activeView === "aadhaar-masker" && <AadhaarMasker />}
              {activeView === "hindi-font-converter" && <HindiFontConverter />}
              {activeView === "affidavit-generator" && <AffidavitGenerator />}
              {activeView === "aadhaar-qr-scanner" && <AadhaarQrScanner />}
              {activeView === "html-to-pdf" && <PdfEditorStudio />}
              {activeView === "pdf-editor" && <PdfEditorStudio />}
            </div>
          </div>
        )}
      </main>

      {/* Global Footer — Premium */}
      <footer className="mt-auto relative overflow-hidden">
        {/* Tricolor Top Bar */}
        <div className="h-1 w-full flex">
          <div className="flex-1 bg-[#FF9933]" />
          <div className="flex-1 bg-white dark:bg-slate-300" />
          <div className="flex-1 bg-[#138808]" />
        </div>

        <div className="bg-slate-950 text-slate-300 relative">
          {/* Subtle glow blobs */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 left-1/3 w-72 h-72 rounded-full bg-orange-900/15 blur-3xl" />
            <div className="absolute -bottom-16 right-1/4 w-64 h-64 rounded-full bg-emerald-900/10 blur-3xl" />
          </div>

          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* ── MAIN GRID ── */}
            <div className="py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-slate-800/70">

              {/* Brand Column */}
              <div className="space-y-5">
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500 to-emerald-600 flex items-center justify-center shadow-lg">
                      <ShieldCheck className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-black text-white">BharatKits Hub</div>
                      <div className="text-[10px] text-orange-400 font-bold uppercase tracking-widest">Digital India Utility Hub</div>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Free, open-source, all-in-one utility platform for Indian citizens, students, small businesses &amp; cyber cafes. Zero server logs. 100% client-side processing.
                  </p>
                </div>

                {/* Digital India Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-[#FF9933]/10 via-white/5 to-[#138808]/10 border border-slate-800">
                  <span className="text-xl">🇮🇳</span>
                  <div>
                    <div className="text-xs font-black text-white">Made for Digital India</div>
                    <div className="text-[10px] text-slate-500">Jai Hind 🙏</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-400" /> 100% Private
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold">
                    ⚡ Zero Cost
                  </span>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-400 font-semibold">
                    🔓 Open Source
                  </span>
                </div>
              </div>

              {/* Cyber Cafe Tools */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Cyber Cafe Tools</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  {[
                    "PDF Editor & Digital Signer",
                    "HTML to PDF Studio",
                    "ID Front-Back PDF Combiner",
                    "Govt Form Image Resizer",
                    "Biodata & Resume Builder",
                    "Affidavit & Legal Draft",
                    "Aadhaar Secure Masker",
                    "Hindi Font Converter",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-1.5 hover:text-orange-400 transition-colors cursor-pointer" onClick={() => setActiveView("dashboard")}>
                      <span className="text-slate-700">›</span> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Calculators & Portals */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Calculators & Portals</h4>
                <ul className="space-y-2 text-xs text-slate-400">
                  {[
                    "GST & Bill Splitter",
                    "Loan EMI Calculator",
                    "Govt Savings (PPF/SSY/NPS)",
                    "Age & Chrono Engine",
                    "GST Cash Memo Generator",
                    "UPI Payment QR Studio",
                    "Aadhaar QR Scanner",
                    "Govt Portal Directory",
                  ].map((t) => (
                    <li key={t} className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors cursor-pointer" onClick={() => setActiveView("dashboard")}>
                      <span className="text-slate-700">›</span> {t}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Job Portal & Legal */}
              <div className="space-y-6">
                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Job Portal</h4>
                  <ul className="space-y-2 text-xs text-slate-400">
                    {[
                      "All India Sarkari Jobs",
                      "Private & Tech Careers",
                      "Teaching & Education",
                      "Railway & Defence",
                      "Banking & PSU",
                      "State PSC & SSC/UPSC",
                    ].map((t) => (
                      <li key={t} className="flex items-center gap-1.5 hover:text-indigo-400 transition-colors cursor-pointer" onClick={() => setActiveView("job-portal")}>
                        <span className="text-slate-700">›</span> {t}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-slate-500">Legal &amp; Compliance</h4>
                  <ul className="space-y-2 text-xs text-slate-400">
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
                      <Link href="/disclaimer" className="hover:text-amber-400 transition-colors">
                        Legal Disclaimer
                      </Link>
                    </li>
                    <li>
                      <Link href="/takedown" className="hover:text-amber-400 font-bold transition-colors text-amber-500">
                        🛡️ Content Takedown
                      </Link>
                    </li>
                    <li>
                      <Link href="/about" className="hover:text-orange-400 transition-colors">
                        About BharatKits
                      </Link>
                    </li>
                    <li>
                      <a href="https://github.com/loharbijoy2005-a11y/BharatKits-Hub" target="_blank" rel="noopener noreferrer" className="hover:text-orange-400 transition-colors inline-flex items-center gap-1">
                        GitHub Repository ↗
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* ── DISCLAIMER ── */}
            <div className="py-4 border-b border-slate-800/50">
              <p className="text-[11px] text-slate-600 text-center leading-relaxed max-w-4xl mx-auto">
                <span className="font-bold text-amber-700">⚠️ Disclaimer:</span> BharatKits Hub is an independent open-source platform. All tools run 100% locally in your browser — no citizen data, Aadhaar scans, or documents are ever uploaded to any server.
              </p>
            </div>

            {/* ── COPYRIGHT BAR ── */}
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
                      Bijoy Lohar <span className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">↗</span>
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
      </footer>
    </div>
  );
}
