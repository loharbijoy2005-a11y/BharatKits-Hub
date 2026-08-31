"use client";
import React, { useState } from "react";
import { Header } from "@/components/shared/Header";
import ImageResizer from "@/components/modules/media/ImageResizer";
import ImagePdfBuilder from "@/components/modules/media/ImagePdfBuilder";
import MediaTrimmer from "@/components/modules/media/MediaTrimmer";
import GstSplitter from "@/components/modules/calculators/GstSplitter";
import AgeChrono from "@/components/modules/calculators/AgeChrono";
import QrStudio from "@/components/modules/productivity/QrStudio";
import TextEngine from "@/components/modules/productivity/TextEngine";
import Scratchpad from "@/components/modules/productivity/Scratchpad";

import {
  Shrink,
  FileImage,
  Video,
  Calculator,
  CalendarDays,
  QrCode,
  Type,
  FileText,
  ArrowLeft,
  Search,
  ShieldCheck,
} from "lucide-react";

interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  category: "images-pdf" | "calculators" | "text-daily";
  color: string;
}

const tools: ToolItem[] = [
  {
    id: "resizer-compressor",
    title: "Image Resizer & Compressor",
    description:
      "Set custom scale dimensions, lock ratios, select formats, quality sliders and match size constraints.",
    icon: Shrink,
    category: "images-pdf",
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "image-pdf",
    title: "Image to PDF Converter",
    description:
      "Compile PNG/JPEG images into correctly oriented, scaled, and clean vector PDF documents.",
    icon: FileImage,
    category: "images-pdf",
    color: "from-rose-500 to-red-500",
  },
  {
    id: "media-trimmer",
    title: "Browser Media Trimmer",
    description:
      "Trim, slice, and export MP4 videos or MP3 audio clips 100% in-browser using FFmpeg WebAssembly.",
    icon: Video,
    category: "images-pdf",
    color: "from-sky-500 to-cyan-500",
  },
  {
    id: "gst-split",
    title: "GST & Expense Splitter",
    description:
      "Precision financial math supporting exclusive/inclusive tax structures, invoice summaries, and split shares.",
    icon: Calculator,
    category: "calculators",
    color: "from-emerald-500 to-teal-500",
  },
  {
    id: "age-date",
    title: "Age & Chrono Engine",
    description:
      "Track exact lived timestamps, countdown next birthdays, and map western and Chinese zodiac signs.",
    icon: CalendarDays,
    category: "calculators",
    color: "from-amber-500 to-orange-500",
  },
  {
    id: "qr-generator",
    title: "Vector QR Code Studio",
    description:
      "Generate customizable vector SVG/PNG codes instantly with color presets and error redundancy controls.",
    icon: QrCode,
    category: "text-daily",
    color: "from-violet-500 to-purple-500",
  },
  {
    id: "text-case",
    title: "Professional Text Engine",
    description:
      "Switch case formats, tokenize text statistics, calculate reading speed, and replace with regex patterns.",
    icon: Type,
    category: "text-daily",
    color: "from-teal-500 to-cyan-500",
  },
  {
    id: "scratchpad",
    title: "Persistent Scratchpad",
    description:
      "Local autosave tabbed notepad utilizing IndexedDB, featuring split-pane real-time Markdown previewing.",
    icon: FileText,
    category: "text-daily",
    color: "from-fuchsia-500 to-pink-500",
  },
];

export default function Page() {
  const [activeView, setActiveView] = useState<string>("dashboard");
  const [searchVal, setSearchVal] = useState<string>("");
  const [activeCat, setActiveCat] = useState<string>("all");

  const activeTool = tools.find((t) => t.id === activeView);

  const filteredTools = tools.filter((tool) => {
    const matchesCategory = activeCat === "all" || tool.category === activeCat;
    const matchesSearch =
      tool.title.toLowerCase().includes(searchVal.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchVal.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryLabel = (cat: string) => {
    if (cat === "images-pdf") return "Images & PDF";
    if (cat === "calculators") return "Calculators";
    if (cat === "text-daily") return "Text & Daily";
    return "";
  };

  return (
    <div className="flex flex-col min-h-screen relative">
      {/* Background Graphic Blobs */}
      <div className="fixed inset-0 -z-10 h-full w-full overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-purple-300 dark:bg-purple-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-5 animate-blob"></div>
        <div className="absolute top-1/4 -right-10 w-96 h-96 bg-indigo-300 dark:bg-indigo-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 dark:bg-pink-900/10 rounded-full mix-blend-multiply filter blur-3xl opacity-30 dark:opacity-5 animate-blob animation-delay-4000"></div>
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
                All-in-One{" "}
                <span className="bg-gradient-to-r from-brand-600 to-indigo-600 dark:from-brand-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Daily Web Utilities
                </span>
              </h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
                Complete, client-side, offline-capable productivity suite. No backend. No logins.
                Your files and data never leave your browser.
              </p>
            </div>

            {/* Category tabs pills */}
            <div className="flex justify-center">
              <div className="flex gap-1 p-1 bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-200/30 dark:border-slate-800/30 w-fit max-w-full overflow-x-auto scrollbar-none">
                {[
                  { id: "all", label: "All Tools" },
                  { id: "images-pdf", label: "Images & PDF" },
                  { id: "calculators", label: "Calculators" },
                  { id: "text-daily", label: "Text & Daily" },
                ].map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                      activeCat === cat.id
                        ? "bg-white dark:bg-slate-800 text-brand-650 dark:text-brand-400 shadow-sm"
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
                  Try typing another keyword or check category filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <div
                      key={tool.id}
                      onClick={() => setActiveView(tool.id)}
                      className="group relative rounded-2xl utility-card p-6 hover:shadow-lg hover:-translate-y-1 cursor-pointer flex flex-col justify-between overflow-hidden"
                    >
                      <div className={`absolute -right-8 -top-8 w-24 h-24 bg-gradient-to-br ${tool.color} opacity-[0.02] group-hover:opacity-10 rounded-full transition-all duration-500 blur-xl`} />
                      
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white shadow-md shadow-brand-500/10`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                            {getCategoryLabel(tool.category)}
                          </span>
                        </div>
                        
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-brand-650 dark:group-hover:text-brand-400 transition-colors">
                          {tool.title}
                        </h3>
                        
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                          {tool.description}
                        </p>
                      </div>

                      <div className="flex items-center gap-1.5 text-brand-650 dark:text-brand-400 font-bold text-xs mt-auto group-hover:gap-2.5 transition-all">
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
                  className="flex items-center gap-1.5 text-xs font-bold text-slate-550 hover:text-brand-650 dark:hover:text-brand-450 transition-colors bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 px-3.5 py-1.5 rounded-xl border border-slate-200/50 dark:border-slate-800/40"
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
                  <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 hidden sm:inline">
                    {activeTool && getCategoryLabel(activeTool.category)}
                  </span>
                </div>
              </div>
            </div>

            {/* Active Workspace Switcher */}
            <div className="w-full">
              {activeView === "resizer-compressor" && <ImageResizer />}
              {activeView === "image-pdf" && <ImagePdfBuilder />}
              {activeView === "media-trimmer" && <MediaTrimmer />}
              {activeView === "gst-split" && <GstSplitter />}
              {activeView === "age-date" && <AgeChrono />}
              {activeView === "qr-generator" && <QrStudio />}
              {activeView === "text-case" && <TextEngine />}
              {activeView === "scratchpad" && <Scratchpad />}
            </div>
          </div>
        )}
      </main>

      {/* Global Footer */}
      <footer className="mt-auto border-t border-slate-200/50 dark:border-slate-800/20 glass shadow-sm py-6 transition-all duration-300 text-center text-xs text-slate-400 dark:text-slate-600 font-bold select-none">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span>100% Client-Side Calculations. No tracking, zero database storage.</span>
          </div>
          <div>
            <span>&copy; 2026 OmniKits Suite. Powered by IndexedDB and WebAssembly.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
