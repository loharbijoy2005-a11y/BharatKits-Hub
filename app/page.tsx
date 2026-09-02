"use client";
import React, { useState } from "react";
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
    id: "image-pdf",
    title: "ID Front-Back PDF Combiner",
    description:
      "Combine front and back scans of Aadhar, PAN, or Voter ID cards onto a single print-ready A4 PDF.",
    icon: FileImage,
    category: "cyber-cafe",
    color: "from-sky-500 to-cyan-500",
    tags: [
      "aadhar card print front back",
      "pan card front back",
      "merge id cards",
      "document combiner",
      "combine aadhar",
      "pdf front back",
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
    id: "document-scanner",
    title: "Document Scanner & PDF Builder",
    description:
      "Stitch photos into a single PDF with B&W photocopy cleaner filters, cropping, and 90° rotations.",
    icon: ScanLine,
    category: "cyber-cafe",
    color: "from-blue-500 to-cyan-500",
    tags: [
      "document scanner",
      "photo to pdf",
      "pdf compiler",
      "scanner clean filters",
      "black and white scan",
      "photocopy",
      "image stitch pdf",
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
    id: "html-to-pdf",
    title: "HTML to PDF Studio & Converter",
    description:
      "Paste raw HTML/CSS code or upload HTML files to instantly compile and download high-resolution PDFs with live sheet preview & templates.",
    icon: FileCode2,
    category: "cyber-cafe",
    color: "from-blue-600 to-indigo-600",
    tags: [
      "html to pdf",
      "html converter",
      "html se pdf",
      "html dalunga pdf bana dega",
      "code to pdf",
      "convert html to pdf",
      "web to pdf",
      "invoice html to pdf",
      "html print",
      "html pdf maker",
    ],
  },
  {
    id: "pdf-editor",
    title: "Acrobat PDF Editor & Digital Signer",
    description:
      "Edit any PDF, add digital signatures (draw/type/upload), text annotations, highlighters, whiteouts, and official stamps locally.",
    icon: PenTool,
    category: "cyber-cafe",
    color: "from-indigo-600 to-violet-600",
    tags: [
      "pdf editor",
      "edit pdf",
      "sign pdf",
      "pdf signature",
      "pdf par sign karna",
      "adobe acrobat",
      "redact pdf",
      "highlight pdf",
      "pdf stamp",
      "pdf annotation",
      "e-sign pdf",
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
              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                Bharat
                <span className="bg-gradient-to-r from-orange-500 via-slate-400 to-emerald-600 dark:from-orange-400 dark:to-emerald-500 bg-clip-text text-transparent">
                  Kits Hub
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed font-semibold">
                Encrypted Local-First Utility Hub for Indian citizens & cyber cafes. Zero server logs, complete document privacy, processing securely on your terminal.
              </p>
            </div>

            {/* Category tabs pills */}
            <div className="flex justify-center">
              <div className="flex gap-1.5 p-1 bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-200/30 dark:border-slate-800/30 w-fit max-w-full overflow-x-auto scrollbar-none">
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
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                      activeCat === cat.id
                        ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
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
                      className="group relative rounded-3xl utility-card p-6 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer flex flex-col justify-between overflow-hidden bg-white dark:bg-slate-900"
                    >
                      <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-[0.02] group-hover:opacity-10 rounded-full transition-all duration-500 blur-xl`} />
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md shadow-brand-500/10`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          
                          <div className="flex items-center gap-1.5">
                            <span className="text-[9px] uppercase font-black tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 select-none">
                              {getCategoryLabel(tool.category)}
                            </span>
                            
                            <button
                              onClick={(e) => toggleFavorite(tool.id, e)}
                              className="p-1 rounded hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-400"
                              title={isFav ? "Remove Favorite" : "Add Favorite"}
                            >
                              <Star className={`w-4 h-4 ${isFav ? "text-amber-500 fill-amber-500" : "text-slate-300"}`} />
                            </button>
                          </div>
                        </div>
                        
                        <h3 className="text-base font-extrabold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                          {tool.title}
                        </h3>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-brand-600 dark:text-brand-400 font-bold text-xs mt-auto group-hover:gap-2.5 transition-all">
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
              {activeView === "govt-directory" && <GovtDirectory />}
              {activeView === "resizer-compressor" && <GovtImageResizer />}
              {activeView === "image-pdf" && <IdPdfCombiner />}
              {activeView === "biodata-generator" && <BiodataGenerator />}
              {activeView === "upi-qr" && <UpiQrGenerator />}
              {activeView === "gst-split" && <GstSplitter />}
              {activeView === "age-date" && <AgeChrono />}
              {activeView === "emi-calculator" && <EmiCalculator />}
              {activeView === "cash-memo" && <CashMemoGenerator />}
              {activeView === "govt-savings" && <GovtSavingsCalculator />}
              {activeView === "document-scanner" && <ImagePdfBuilder />}
              {activeView === "aadhaar-masker" && <AadhaarMasker />}
              {activeView === "hindi-font-converter" && <HindiFontConverter />}
              {activeView === "affidavit-generator" && <AffidavitGenerator />}
              {activeView === "aadhaar-qr-scanner" && <AadhaarQrScanner />}
              {activeView === "html-to-pdf" && <HtmlPdfStudio />}
              {activeView === "pdf-editor" && <PdfEditorStudio />}
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/20 glass shadow-sm py-6 transition-all duration-300 text-center text-xs text-slate-400 dark:text-slate-600 font-bold select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Zero-Server Retention Architecture. All processes and calculations are verified locally on this terminal.</span>
          </div>
          <div>
            <span>&copy; 2026 BharatKits Portal. Made for Digital India.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
