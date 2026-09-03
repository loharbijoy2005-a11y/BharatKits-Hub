"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import {
  FileSignature,
  Printer,
  FileText,
  Sparkles,
  Check,
  Sliders,
  Maximize2,
  Settings2,
  FileDown,
  RotateCcw,
  Edit3,
  Bold,
  Underline,
  PlusCircle,
  Eye,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type TemplateType = "address" | "gap" | "income" | "rent";
type PaperType = "plain" | "stamp" | "estamp";

export default function AffidavitGenerator() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("address");
  const [paperType, setPaperType] = useState<PaperType>("plain");

  // Direct Editing Mode
  const [isDirectEdit, setIsDirectEdit] = useState<boolean>(true);

  // Typography & Layout Controls
  const [fontSize, setFontSize] = useState<number>(13); // in px
  const [lineHeight, setLineHeight] = useState<number>(1.5); // line-height multiplier
  const [stampGapMm, setStampGapMm] = useState<number>(0); // top stamp gap in mm (0 for plain A4)
  const [signatureGapPx, setSignatureGapPx] = useState<number>(24); // space before signatures
  const [isExporting, setIsExporting] = useState<boolean>(false);

  const documentRef = useRef<HTMLDivElement>(null);
  const contentAreaRef = useRef<HTMLDivElement>(null);

  // Address state
  const [addressData, setAddressData] = useState({
    name: "Vikram Singh",
    fatherName: "Baldev Singh",
    age: "28",
    address: "House No. 124, Village Rampur, Dist. Patna, Bihar - 800001",
    purpose: "Address Verification & Citizen Service Application",
  });

  // Gap state
  const [gapData, setGapData] = useState({
    studentName: "Aman Gupta",
    fatherName: "Ramesh Gupta",
    passingYear: "2024",
    gapYears: "2",
    reason: "preparation for Competitive Exams (JEE/NEET)",
    currentYear: new Date().getFullYear().toString(),
  });

  // Rent state
  const [rentData, setRentData] = useState({
    ownerName: "Rajesh Kumar",
    tenantName: "Sunil Sharma",
    address: "Flat No. 402, Block B, Sector 62, Noida, Uttar Pradesh - 201301",
    rentAmount: "15000",
    securityDeposit: "30000",
    term: "11",
    startDate: new Date().toISOString().split("T")[0],
  });

  // Income state
  const [incomeData, setIncomeData] = useState({
    name: "Preeti Patel",
    fatherName: "Kishore Patel",
    occupation: "Private Employee",
    annualIncome: "450000",
    source: "Salary from Services",
    purpose: "Scholarship & Education Fee Concession",
  });

  // Auto 1-Page Fit Preset
  const handleAutoFitOnePage = () => {
    setFontSize(12);
    setLineHeight(1.38);
    setSignatureGapPx(18);
    if (paperType === "plain") {
      setStampGapMm(0);
    }
  };

  // Reset to Defaults
  const handleResetLayout = () => {
    setFontSize(13);
    setLineHeight(1.5);
    setSignatureGapPx(24);
    setStampGapMm(paperType === "plain" ? 0 : paperType === "stamp" ? 75 : 90);
  };

  // Handle Paper Type Change
  const handlePaperTypeChange = (type: PaperType) => {
    setPaperType(type);
    if (type === "plain") {
      setStampGapMm(0);
      setFontSize(13);
      setLineHeight(1.5);
    } else if (type === "stamp") {
      setStampGapMm(75); // Standard 75mm (approx 3 inches) for physical Non-Judicial stamp paper
      setFontSize(11.5); // Compact to accommodate top margin
      setLineHeight(1.35);
      setSignatureGapPx(16);
    } else if (type === "estamp") {
      setStampGapMm(90); // e-Stamp certificate header gap
      setFontSize(11);
      setLineHeight(1.3);
      setSignatureGapPx(14);
    }
  };

  // Direct Print
  const handlePrint = () => {
    window.print();
  };

  // Direct Client-Side PDF Download
  const handleDownloadPdf = async () => {
    if (!documentRef.current) return;
    try {
      setIsExporting(true);
      const docElement = documentRef.current;

      const canvas = await html2canvas(docElement, {
        scale: 2.5,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${activeTemplate}_affidavit_${Date.now()}.pdf`);
    } catch (error) {
      console.error("PDF Export error:", error);
      alert("Error generating PDF. Using browser print dialog instead.");
      window.print();
    } finally {
      setIsExporting(false);
    }
  };

  // Inline Rich Text Formatting Commands
  const executeCommand = (command: string, value: string = "") => {
    document.execCommand(command, false, value);
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0 print:bg-white print:text-black">
      {/* Dynamic Print CSS Injection for 100% exact 1-Page Margin */}
      <style jsx global>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 10mm 15mm 10mm 15mm !important;
          }
          body {
            background: white !important;
            color: black !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden,
          header,
          footer,
          nav {
            display: none !important;
          }
          .printable-document {
            box-shadow: none !important;
            border: none !important;
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-stamp-gap {
            height: ${stampGapMm}mm !important;
            display: ${stampGapMm > 0 ? "block" : "none"} !important;
          }
        }
      `}</style>

      {/* Header & Template Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-200/50 dark:border-slate-800/50 w-fit max-w-full">
          {[
            { id: "address", label: "Address Declaration", icon: FileText },
            { id: "gap", label: "Gap Year Affidavit", icon: FileSignature },
            { id: "income", label: "Income Declaration", icon: FileSignature },
            { id: "rent", label: "Rent Agreement", icon: FileText },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTemplate(tab.id as TemplateType)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap cursor-pointer ${
                  activeTemplate === tab.id
                    ? "bg-white dark:bg-slate-800 text-amber-600 dark:text-amber-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Direct Edit Mode Toggle */}
          <button
            onClick={() => setIsDirectEdit(!isDirectEdit)}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
              isDirectEdit
                ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30 shadow-sm"
                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
            }`}
            title="Toggle Direct Click-to-Edit Mode on Document"
          >
            <Edit3 className="w-3.5 h-3.5 text-emerald-500" />
            <span>Direct Edit Mode: {isDirectEdit ? "ON" : "OFF"}</span>
          </button>

          {/* 1-Click Fit Button */}
          <button
            onClick={handleAutoFitOnePage}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 text-xs font-bold transition-all cursor-pointer shadow-sm"
            title="Auto-balance font size & margins to fit perfectly on 1 Single Page"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-500" />
            <span>Auto-Fit 1 Page</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* --- FORM & CUSTOMIZATION PANEL (LEFT) --- */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          {/* Layout & Typography Controls Card */}
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-amber-500" /> Layout &amp; Text Size Controls
              </h3>
              <button
                onClick={handleResetLayout}
                className="text-[11px] text-slate-400 hover:text-amber-500 flex items-center gap-1 transition-colors cursor-pointer"
                title="Reset layout settings"
              >
                <RotateCcw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Paper Type Selection */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Target Print Paper:
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handlePaperTypeChange("plain")}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                    paperType === "plain"
                      ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  Plain A4
                </button>
                <button
                  type="button"
                  onClick={() => handlePaperTypeChange("stamp")}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                    paperType === "stamp"
                      ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  ₹10-100 Stamp
                </button>
                <button
                  type="button"
                  onClick={() => handlePaperTypeChange("estamp")}
                  className={`py-2 px-3 rounded-xl font-bold border transition-all text-center cursor-pointer ${
                    paperType === "estamp"
                      ? "bg-amber-500 text-white border-amber-500 shadow-md shadow-amber-500/20"
                      : "bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  }`}
                >
                  e-Stamp / SHCIL
                </button>
              </div>
            </div>

            {/* Font Size Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  🎚️ Text Font Size:
                </span>
                <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-900/50">
                  {fontSize}px {fontSize <= 12 ? "(Compact 1-Page)" : fontSize >= 15 ? "(Large Print)" : "(Standard)"}
                </span>
              </div>
              <input
                type="range"
                min={10}
                max={18}
                step={0.5}
                value={fontSize}
                onChange={(e) => setFontSize(parseFloat(e.target.value))}
                className="w-full accent-amber-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-semibold px-0.5">
                <span>10px (Very Compact)</span>
                <span>13px (Default)</span>
                <span>18px (Large)</span>
              </div>
            </div>

            {/* Line Height Slider */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  📏 Line Spacing:
                </span>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50 px-2 py-0.5 rounded-lg border border-indigo-200 dark:border-indigo-900/50">
                  {lineHeight.toFixed(2)}x
                </span>
              </div>
              <input
                type="range"
                min={1.2}
                max={2.0}
                step={0.05}
                value={lineHeight}
                onChange={(e) => setLineHeight(parseFloat(e.target.value))}
                className="w-full accent-indigo-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
              />
            </div>

            {/* Top Stamp Margin Gap Slider */}
            {paperType !== "plain" && (
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    📄 Top Stamp Space (Header Gap):
                  </span>
                  <span className="font-mono font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 px-2 py-0.5 rounded-lg border border-rose-200 dark:border-rose-900/50">
                    {stampGapMm} mm ({Math.round(stampGapMm / 10)} cm)
                  </span>
                </div>
                <input
                  type="range"
                  min={20}
                  max={120}
                  step={5}
                  value={stampGapMm}
                  onChange={(e) => setStampGapMm(parseInt(e.target.value))}
                  className="w-full accent-rose-500 cursor-pointer h-2 bg-slate-200 dark:bg-slate-700 rounded-lg"
                />
              </div>
            )}
          </div>

          {/* Form Quick Fill Card */}
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
            <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" /> Auto-Fill Details
            </h3>

            {/* ADDRESS DECLARATION FORM */}
            {activeTemplate === "address" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Declarant Full Name</label>
                  <input
                    type="text"
                    value={addressData.name}
                    onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Father / Husband Name</label>
                  <input
                    type="text"
                    value={addressData.fatherName}
                    onChange={(e) => setAddressData({ ...addressData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Age (Years)</label>
                  <input
                    type="number"
                    value={addressData.age}
                    onChange={(e) => setAddressData({ ...addressData, age: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Complete Residential Address</label>
                  <textarea
                    rows={3}
                    value={addressData.address}
                    onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Purpose / Application For</label>
                  <input
                    type="text"
                    value={addressData.purpose}
                    onChange={(e) => setAddressData({ ...addressData, purpose: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* GAP YEAR FORM */}
            {activeTemplate === "gap" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Student Name</label>
                  <input
                    type="text"
                    value={gapData.studentName}
                    onChange={(e) => setGapData({ ...gapData, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Father&apos;s Name</label>
                  <input
                    type="text"
                    value={gapData.fatherName}
                    onChange={(e) => setGapData({ ...gapData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">12th Passing Year</label>
                    <input
                      type="text"
                      value={gapData.passingYear}
                      onChange={(e) => setGapData({ ...gapData, passingYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Gap Duration (Years)</label>
                    <input
                      type="number"
                      value={gapData.gapYears}
                      onChange={(e) => setGapData({ ...gapData, gapYears: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Reason for Gap Period</label>
                  <input
                    type="text"
                    value={gapData.reason}
                    onChange={(e) => setGapData({ ...gapData, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* RENT AGREEMENT FORM */}
            {activeTemplate === "rent" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Owner Name (Landlord)</label>
                  <input
                    type="text"
                    value={rentData.ownerName}
                    onChange={(e) => setRentData({ ...rentData, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Tenant Name</label>
                  <input
                    type="text"
                    value={rentData.tenantName}
                    onChange={(e) => setRentData({ ...rentData, tenantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Property Address</label>
                  <textarea
                    rows={2}
                    value={rentData.address}
                    onChange={(e) => setRentData({ ...rentData, address: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={rentData.rentAmount}
                      onChange={(e) => setRentData({ ...rentData, rentAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={rentData.securityDeposit}
                      onChange={(e) => setRentData({ ...rentData, securityDeposit: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Term (Months)</label>
                    <input
                      type="number"
                      value={rentData.term}
                      onChange={(e) => setRentData({ ...rentData, term: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Agreement Start Date</label>
                    <input
                      type="date"
                      value={rentData.startDate}
                      onChange={(e) => setRentData({ ...rentData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* INCOME FORM */}
            {activeTemplate === "income" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-300">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Declarant Full Name</label>
                  <input
                    type="text"
                    value={incomeData.name}
                    onChange={(e) => setIncomeData({ ...incomeData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Father / Husband Name</label>
                  <input
                    type="text"
                    value={incomeData.fatherName}
                    onChange={(e) => setIncomeData({ ...incomeData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Occupation</label>
                    <input
                      type="text"
                      value={incomeData.occupation}
                      onChange={(e) => setIncomeData({ ...incomeData, occupation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={incomeData.annualIncome}
                      onChange={(e) => setIncomeData({ ...incomeData, annualIncome: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Source of Income</label>
                  <input
                    type="text"
                    value={incomeData.source}
                    onChange={(e) => setIncomeData({ ...incomeData, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Purpose / Application For</label>
                  <input
                    type="text"
                    value={incomeData.purpose}
                    onChange={(e) => setIncomeData({ ...incomeData, purpose: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <Button
                  onClick={handleDownloadPdf}
                  disabled={isExporting}
                  className="w-full py-3 flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 cursor-pointer"
                >
                  <FileDown className="w-4 h-4" /> {isExporting ? "Exporting..." : "Download PDF"}
                </Button>
                <Button
                  onClick={handlePrint}
                  className="w-full py-3 flex items-center justify-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow-md shadow-amber-500/20 cursor-pointer"
                >
                  <Printer className="w-4 h-4" /> Print (A4)
                </Button>
              </div>
              <span className="text-[10px] text-slate-400 font-semibold block text-center">
                ✨ 100% Client-Side Generator • No data uploaded to server
              </span>
            </div>
          </div>
        </div>

        {/* --- LIVE PREVIEW / WYSIWYG DIRECT EDIT CANVAS (RIGHT) --- */}
        <div className="lg:col-span-7 flex flex-col items-center print:w-full print:p-0 space-y-3">
          {/* WYSIWYG Editor Toolbar Banner */}
          <div className="w-full max-w-[800px] flex items-center justify-between px-4 py-2 bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/30 rounded-2xl text-xs text-amber-800 dark:text-amber-200 print:hidden shadow-sm">
            <div className="flex items-center gap-2 font-bold">
              <Edit3 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>
                {isDirectEdit
                  ? "✏️ Direct Edit Mode Active: Click anywhere on the paper to edit or add text!"
                  : "👁️ Preview Mode: Click 'Direct Edit Mode' to customize document text"}
              </span>
            </div>
            {isDirectEdit && (
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  type="button"
                  onClick={() => executeCommand("bold")}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                  title="Bold (Ctrl+B)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => executeCommand("underline")}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-500 hover:text-white transition-colors cursor-pointer"
                  title="Underline (Ctrl+U)"
                >
                  <Underline className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
          </div>

          <div
            ref={documentRef}
            className={`printable-document w-full max-w-[800px] bg-white text-slate-900 border border-slate-200 shadow-xl rounded-2xl overflow-hidden flex flex-col font-serif select-text print:border-0 print:shadow-none print:rounded-none transition-all ${
              isDirectEdit
                ? "ring-2 ring-amber-500/50 hover:ring-amber-500 cursor-text"
                : ""
            }`}
            style={{ minHeight: "297mm" }}
          >
            {/* Top Stamp Margin Area */}
            {stampGapMm > 0 && (
              <div
                className="print-stamp-gap w-full bg-slate-50/70 dark:bg-slate-900/10 border-b border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center text-center select-none"
                style={{ height: `${stampGapMm}mm` }}
              >
                <div className="p-3 max-w-sm border border-dashed border-slate-300 rounded-lg print:hidden">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    [ STAMP PAPER SPACE: {stampGapMm} mm ({Math.round(stampGapMm / 10)} cm) ]
                  </span>
                  <p className="text-[10px] text-slate-400 font-sans mt-1">
                    This space will remain blank so you can print directly on non-judicial stamp paper.
                  </p>
                </div>
              </div>
            )}

            {/* Document Content Box with Dynamic Font Size & Line Height & Direct ContentEditable */}
            <div
              ref={contentAreaRef}
              contentEditable={isDirectEdit}
              suppressContentEditableWarning={true}
              className="p-8 sm:p-12 text-slate-800 print:text-black print:p-6 outline-none focus:outline-none"
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: lineHeight,
              }}
            >
              {/* ADDRESS CONTENT */}
              {activeTemplate === "address" && (
                <div className="space-y-4">
                  <h4
                    className="text-center font-extrabold underline uppercase tracking-wider text-slate-900 pb-2"
                    style={{ fontSize: `${Math.round(fontSize * 1.25)}px` }}
                  >
                    SELF-DECLARATION OF ADDRESS
                  </h4>
                  <p>
                    I, <strong>{addressData.name}</strong>, Son/Daughter/Wife of{" "}
                    <strong>{addressData.fatherName}</strong>, aged about{" "}
                    <strong>{addressData.age} years</strong>, resident of: <br />
                    <strong>{addressData.address}</strong>, do hereby solemnly declare and state as under:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2.5">
                    <li>
                      That I am residing at the above-mentioned address since ______________ (Date/Year).
                    </li>
                    <li>
                      That the address provided above is my true, correct, and current residential address.
                    </li>
                    <li>
                      That I am submitting this self-declaration as a proof of my residential address for the purpose of{" "}
                      <strong>{addressData.purpose || "_________________________________________"}</strong>.
                    </li>
                    <li>
                      That if any information declared above is found to be false or incorrect at a later stage, I shall be held legally responsible under Section 199 and 200 of the Indian Penal Code.
                    </li>
                  </ol>

                  {/* Signatures */}
                  <div
                    className="flex justify-between font-sans font-bold text-xs select-none"
                    style={{ paddingTop: `${signatureGapPx}px` }}
                  >
                    <div className="self-end">Date: ________________</div>
                    <div className="w-2/5 border-t border-slate-400 pt-2 text-center text-slate-700">
                      Declarant Signature
                    </div>
                  </div>
                </div>
              )}

              {/* GAP YEAR CONTENT */}
              {activeTemplate === "gap" && (
                <div className="space-y-4">
                  <h4
                    className="text-center font-extrabold underline uppercase tracking-wider text-slate-900 pb-2"
                    style={{ fontSize: `${Math.round(fontSize * 1.25)}px` }}
                  >
                    AFFIDAVIT FOR GAP YEAR
                  </h4>
                  <p>
                    I, <strong>{gapData.studentName}</strong>, Son/Daughter of{" "}
                    <strong>{gapData.fatherName}</strong>, aged about _____ years, resident of ____________________________________________________, do hereby solemnly affirm and state on oath as under:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2.5">
                    <li>
                      That I passed my Senior Secondary (12th Class) Examination from ___________________________ Board in the year <strong>{gapData.passingYear}</strong>.
                    </li>
                    <li>
                      That after passing the examination, I did not join any college, university, or academic institution during the gap period of <strong>{gapData.gapYears} year(s)</strong> (from {parseInt(gapData.passingYear) || 2024} to {gapData.currentYear}).
                    </li>
                    <li>
                      That during the said gap period, I was engaged in <strong>{gapData.reason}</strong>.
                    </li>
                    <li>
                      That during the said gap period, I was not involved in any illegal activities or criminal acts, and there is no police case pending against me.
                    </li>
                    <li>
                      That I am submitting this affidavit to secure admission in _____________________________________ for the academic session <strong>{gapData.currentYear}</strong>.
                    </li>
                  </ol>
                  <p className="pt-2 font-bold">DEPONENT</p>

                  <div className="pt-2">
                    <h5 className="font-extrabold underline text-xs uppercase">Verification:</h5>
                    <p className="text-[11px] leading-relaxed pt-1">
                      Verified at Delhi on this _____ day of ____________ {gapData.currentYear} that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed therefrom.
                    </p>
                  </div>

                  {/* Signatures */}
                  <div
                    className="flex justify-between font-sans font-bold text-xs select-none"
                    style={{ paddingTop: `${signatureGapPx}px` }}
                  >
                    <div className="w-1/3 border-t border-slate-400 pt-2 text-center text-slate-700">
                      Witness 1
                    </div>
                    <div className="w-1/3 border-t border-slate-400 pt-2 text-center text-slate-700">
                      Deponent Signature
                    </div>
                  </div>
                </div>
              )}

              {/* RENT AGREEMENT CONTENT */}
              {activeTemplate === "rent" && (
                <div className="space-y-4">
                  <h4
                    className="text-center font-extrabold underline uppercase tracking-wider text-slate-900 pb-2"
                    style={{ fontSize: `${Math.round(fontSize * 1.25)}px` }}
                  >
                    RENT AGREEMENT
                  </h4>
                  <p>
                    This Rent Agreement is made and executed on this <strong>{rentData.startDate}</strong> by and between:
                  </p>
                  <p>
                    <strong>{rentData.ownerName}</strong>, hereinafter referred to as the <strong>LANDLORD/OWNER</strong> (which expression shall mean and include his heirs, successors, legal representatives, and assigns) of the ONE PART.
                  </p>
                  <p className="text-center font-bold my-1">AND</p>
                  <p>
                    <strong>{rentData.tenantName}</strong>, hereinafter referred to as the <strong>TENANT</strong> (which expression shall mean and include his heirs, successors, legal representatives, and assigns) of the OTHER PART.
                  </p>
                  <p>
                    WHEREAS the Landlord is the absolute owner of the property situated at: <br />
                    <strong>{rentData.address}</strong>.
                  </p>
                  <p>
                    AND WHEREAS the Tenant has approached the Landlord to take the said premises on rent for residential purposes on the following terms:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2">
                    <li>
                      That this lease agreement shall be valid for a period of <strong>{rentData.term} months</strong> starting from <strong>{rentData.startDate}</strong>.
                    </li>
                    <li>
                      That the Tenant shall pay a monthly rent of <strong>₹{rentData.rentAmount}/-</strong> (Rupees {parseInt(rentData.rentAmount || "0").toLocaleString("en-IN")} only) on or before the 5th day of every calendar month.
                    </li>
                    <li>
                      That the Tenant has paid a refundable interest-free security deposit of <strong>₹{rentData.securityDeposit}/-</strong> (Rupees {parseInt(rentData.securityDeposit || "0").toLocaleString("en-IN")} only) to the Landlord.
                    </li>
                    <li>
                      That the Tenant shall pay electricity, water, and maintenance charges according to actual usage.
                    </li>
                  </ol>

                  {/* Signatures */}
                  <div
                    className="grid grid-cols-2 gap-8 text-center font-sans font-bold text-xs select-none"
                    style={{ paddingTop: `${signatureGapPx}px` }}
                  >
                    <div className="border-t border-slate-400 pt-2 text-slate-700">Signature of Landlord</div>
                    <div className="border-t border-slate-400 pt-2 text-slate-700">Signature of Tenant</div>
                  </div>
                </div>
              )}

              {/* INCOME CONTENT */}
              {activeTemplate === "income" && (
                <div className="space-y-4">
                  <h4
                    className="text-center font-extrabold underline uppercase tracking-wider text-slate-900 pb-2"
                    style={{ fontSize: `${Math.round(fontSize * 1.25)}px` }}
                  >
                    SELF-DECLARATION OF INCOME
                  </h4>
                  <p>
                    I, <strong>{incomeData.name}</strong>, Son/Daughter/Wife of{" "}
                    <strong>{incomeData.fatherName}</strong>, residing at ____________________________________________________________________, do hereby declare on oath:
                  </p>
                  <ol className="list-decimal pl-5 space-y-2.5">
                    <li>
                      That I am currently working as a <strong>{incomeData.occupation}</strong>.
                    </li>
                    <li>
                      That my total annual income from all sources (including {incomeData.source}) is <strong>₹{incomeData.annualIncome}/-</strong> (Rupees {parseInt(incomeData.annualIncome || "0").toLocaleString("en-IN")} only) for the current financial year.
                    </li>
                    <li>
                      That I have no other source of income apart from what has been declared above.
                    </li>
                    <li>
                      That this declaration is made for the purpose of{" "}
                      <strong>{incomeData.purpose || "_________________________________________"}</strong>.
                    </li>
                  </ol>

                  {/* Signatures */}
                  <div
                    className="flex justify-between font-sans font-bold text-xs select-none"
                    style={{ paddingTop: `${signatureGapPx}px` }}
                  >
                    <div className="self-end">Date: ________________</div>
                    <div className="w-2/5 border-t border-slate-400 pt-2 text-center text-slate-700">
                      Declarant Signature
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer stamp notice */}
            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-sans select-none print:hidden">
              <span className="flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5 text-green-500" /> Click anywhere on this page to edit text directly • Ready for single-page print.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
