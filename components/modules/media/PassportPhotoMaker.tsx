"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { PDFDocument } from "pdf-lib";
import {
  Upload,
  Download,
  RefreshCw,
  Image as ImageIcon,
  Sliders,
  CheckCircle,
  Scissors,
  Grid,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Tag,
} from "lucide-react";

interface SheetPreset {
  id: string;
  name: string;
  paper: "4x6" | "A4";
  count: number;
  cols: number;
  rows: number;
  desc: string;
}

const sheetPresets: SheetPreset[] = [
  {
    id: "4x6-8",
    name: "8 Photos on 4x6 Sheet (Most Popular)",
    paper: "4x6",
    count: 8,
    cols: 2,
    rows: 4,
    desc: "Standard 4x6 inch studio print paper with 8 passport photos (2x4 grid).",
  },
  {
    id: "4x6-6",
    name: "6 Photos on 4x6 Sheet",
    paper: "4x6",
    count: 6,
    cols: 2,
    rows: 3,
    desc: "Spacious 4x6 photo sheet with 6 passport prints (2x3 grid).",
  },
  {
    id: "4x6-12",
    name: "12 Photos on 4x6 Sheet",
    paper: "4x6",
    count: 12,
    cols: 3,
    rows: 4,
    desc: "Compact 4x6 print paper with 12 passport photos (3x4 grid).",
  },
  {
    id: "a4-16",
    name: "16 Photos on A4 Page",
    paper: "A4",
    count: 16,
    cols: 4,
    rows: 4,
    desc: "Full A4 document paper with 16 passport prints (4x4 grid).",
  },
  {
    id: "a4-32",
    name: "32 Photos on A4 Page (Bulk)",
    paper: "A4",
    count: 32,
    cols: 4,
    rows: 8,
    desc: "Max bulk print on A4 sheet with 32 passport photos (4x8 grid).",
  },
];

export default function PassportPhotoMaker() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Sheet Configurations
  const [selectedPresetId, setSelectedPresetId] = useState<string>("4x6-8");
  const [addCutLines, setAddCutLines] = useState<boolean>(true);
  const [bgTint, setBgTint] = useState<"original" | "white" | "lightblue" | "lightgray">("original");
  
  // Name & Date Overlay Stamp
  const [enableStamp, setEnableStamp] = useState<boolean>(false);
  const [stampName, setStampName] = useState<string>("");
  const [stampDate, setStampDate] = useState<string>(
    new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" })
  );

  const [processing, setProcessing] = useState<boolean>(false);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activePreset = sheetPresets.find((p) => p.id === selectedPresetId) || sheetPresets[0];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setPdfUrl(null);
      setPreviewDataUrl(null);
    }
  };

  // Re-generate sheet when image, preset, or settings change
  useEffect(() => {
    if (!imageSrc) return;
    generateSheetPreview();
  }, [imageSrc, selectedPresetId, addCutLines, bgTint, enableStamp, stampName, stampDate]);

  const generateSheetPreview = async () => {
    if (!imageSrc) return;
    setProcessing(true);

    const img = document.createElement("img");
    img.src = imageSrc;
    img.onload = async () => {
      // 300 DPI Canvas Setup
      // 4x6 inches @ 300 DPI = 1200 x 1800 px (Portrait: 1200 x 1800)
      // A4 inches @ 300 DPI = 2480 x 3508 px
      const is4x6 = activePreset.paper === "4x6";
      const sheetW = is4x6 ? 1200 : 2480;
      const sheetH = is4x6 ? 1800 : 3508;

      const canvas = document.createElement("canvas");
      canvas.width = sheetW;
      canvas.height = sheetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setProcessing(false);
        return;
      }

      // Draw background paper
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, sheetW, sheetH);

      // Create cropped single passport photo canvas (standard 3.5cm x 4.5cm ratio = 350 x 450 px)
      const passportW = 350;
      const passportH = 450;
      const passCanvas = document.createElement("canvas");
      passCanvas.width = passportW;
      passCanvas.height = passportH;
      const passCtx = passCanvas.getContext("2d");

      if (passCtx) {
        // Fill passport photo background if tinted
        if (bgTint === "white") {
          passCtx.fillStyle = "#ffffff";
          passCtx.fillRect(0, 0, passportW, passportH);
        } else if (bgTint === "lightblue") {
          passCtx.fillStyle = "#dbeafe";
          passCtx.fillRect(0, 0, passportW, passportH);
        } else if (bgTint === "lightgray") {
          passCtx.fillStyle = "#f3f4f6";
          passCtx.fillRect(0, 0, passportW, passportH);
        }

        // Center crop cover image onto passport ratio
        const imgRatio = img.width / img.height;
        const targetRatio = passportW / passportH;
        let sx = 0, sy = 0, sWidth = img.width, sHeight = img.height;

        if (imgRatio > targetRatio) {
          sWidth = img.height * targetRatio;
          sx = (img.width - sWidth) / 2;
        } else {
          sHeight = img.width / targetRatio;
          sy = (img.height - sHeight) / 2;
        }

        passCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, passportW, passportH);

        // Optional Name & Date Stamp strip at bottom of passport photo
        if (enableStamp && (stampName || stampDate)) {
          const stampHeight = 65;
          passCtx.fillStyle = "rgba(255, 255, 255, 0.95)";
          passCtx.fillRect(0, passportH - stampHeight, passportW, stampHeight);
          
          passCtx.strokeStyle = "#000000";
          passCtx.lineWidth = 1;
          passCtx.strokeRect(0, passportH - stampHeight, passportW, stampHeight);

          passCtx.fillStyle = "#000000";
          passCtx.textAlign = "center";
          
          if (stampName && stampDate) {
            passCtx.font = "bold 20px sans-serif";
            passCtx.fillText(stampName.toUpperCase(), passportW / 2, passportH - 38);
            passCtx.font = "bold 17px monospace";
            passCtx.fillText(`DOB/DOA: ${stampDate}`, passportW / 2, passportH - 14);
          } else if (stampName) {
            passCtx.font = "bold 22px sans-serif";
            passCtx.fillText(stampName.toUpperCase(), passportW / 2, passportH - 24);
          } else if (stampDate) {
            passCtx.font = "bold 20px monospace";
            passCtx.fillText(`DATE: ${stampDate}`, passportW / 2, passportH - 24);
          }
        }
      }

      // Calculate grid layout maths for print sheet
      const cols = activePreset.cols;
      const rows = activePreset.rows;
      
      const marginX = is4x6 ? 60 : 120;
      const marginY = is4x6 ? 80 : 160;

      const availW = sheetW - 2 * marginX;
      const availH = sheetH - 2 * marginY;

      // Fit photo box width & height inside grid cell
      const cellW = availW / cols;
      const cellH = availH / rows;

      // Photo size inside grid
      const photoW = Math.min(cellW * 0.88, is4x6 ? 320 : 420);
      const photoH = photoW * (4.5 / 3.5);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const cellX = marginX + c * cellW;
          const cellY = marginY + r * cellH;

          // Center photo inside grid cell
          const px = cellX + (cellW - photoW) / 2;
          const py = cellY + (cellH - photoH) / 2;

          // Draw Passport Photo
          ctx.drawImage(passCanvas, px, py, photoW, photoH);

          // Draw Cut Border Lines
          if (addCutLines) {
            ctx.strokeStyle = "#cbd5e1";
            ctx.lineWidth = 2;
            ctx.setLineDash([8, 6]);
            ctx.strokeRect(px - 2, py - 2, photoW + 4, photoH + 4);
            ctx.setLineDash([]);
          }
        }
      }

      // Output preview Data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.92);
      setPreviewDataUrl(dataUrl);

      // Generate High-Res PDF using pdf-lib
      try {
        const pdfDoc = await PDFDocument.create();
        const pdfPageW = is4x6 ? 288 : 595.28; // 4x6 in points = 288x432, A4 = 595.28x841.89
        const pdfPageH = is4x6 ? 432 : 841.89;

        const page = pdfDoc.addPage([pdfPageW, pdfPageH]);

        const jpgBytes = await fetch(dataUrl).then((res) => res.arrayBuffer());
        const embeddedJpg = await pdfDoc.embedJpg(jpgBytes);

        page.drawImage(embeddedJpg, {
          x: 0,
          y: 0,
          width: pdfPageW,
          height: pdfPageH,
        });

        const pdfBytes = await pdfDoc.save();
        const pdfBlob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: "application/pdf" });
        if (pdfUrl) URL.revokeObjectURL(pdfUrl);
        setPdfUrl(URL.createObjectURL(pdfBlob));
      } catch (err) {
        console.error("PDF generation error", err);
      }

      setProcessing(false);
    };
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setPreviewDataUrl(null);
    setPdfUrl(null);
    setEnableStamp(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Controls Column */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="text-md font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Grid className="w-5 h-5 text-amber-500" />
              Passport Sheet Setup
            </h3>
            <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
              1-Click Single Photo
            </span>
          </div>

          {/* Preset Selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center gap-1.5">
              <FileSpreadsheet className="w-4 h-4 text-orange-500" />
              Paper &amp; Photo Grid Preset
            </label>
            <div className="relative">
              <select
                value={selectedPresetId}
                onChange={(e) => setSelectedPresetId(e.target.value)}
                className="w-full px-3 py-2.5 pr-10 rounded-xl border border-slate-200 dark:border-slate-800 bg-[#1f2937] text-white font-bold text-xs focus:outline-none focus:ring-2 focus:ring-amber-500/50 appearance-none cursor-pointer"
                style={{ backgroundColor: "#1f2937", color: "#ffffff" }}
              >
                {sheetPresets.map((p) => (
                  <option key={p.id} value={p.id} style={{ backgroundColor: "#1f2937", color: "#f9fafb" }}>
                    {p.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
              {activePreset.desc}
            </p>
          </div>

          {/* Background Tint Option */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide">
              Background Color
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { id: "original", label: "Original" },
                { id: "white", label: "Pure White" },
                { id: "lightblue", label: "Studio Blue" },
                { id: "lightgray", label: "Light Gray" },
              ].map((b) => (
                <button
                  key={b.id}
                  onClick={() => setBgTint(b.id as any)}
                  className={`py-2 px-1 rounded-xl text-[10px] font-bold border transition-all ${
                    bgTint === b.id
                      ? "bg-amber-500 text-white border-amber-600 shadow-sm"
                      : "bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Scissors Cut Lines Option */}
          <div className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Scissors className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Print Dashed Cutting Lines
              </span>
            </div>
            <input
              type="checkbox"
              checked={addCutLines}
              onChange={(e) => setAddCutLines(e.target.checked)}
              className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
            />
          </div>

          {/* SSC / UPSC Name & Date Overlay Stamp */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-indigo-500" />
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Name &amp; Date Stamp (SSC / UPSC)
                </span>
              </div>
              <input
                type="checkbox"
                checked={enableStamp}
                onChange={(e) => setEnableStamp(e.target.checked)}
                className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
              />
            </div>

            {enableStamp && (
              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
                <input
                  type="text"
                  placeholder="Candidate Name (e.g. RAHUL KUMAR)"
                  value={stampName}
                  onChange={(e) => setStampName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                />
                <input
                  type="text"
                  placeholder="Date of Photo (e.g. 05/09/2026)"
                  value={stampDate}
                  onChange={(e) => setStampDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" className="w-1/3" onClick={handleReset} disabled={!imageSrc}>
              Clear
            </Button>
            <Button
              className="w-2/3 bg-amber-500 hover:bg-amber-600 text-white font-bold"
              onClick={generateSheetPreview}
              disabled={!imageSrc || processing}
            >
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" /> Rendering...
                </>
              ) : (
                <>
                  <Printer className="w-4 h-4 mr-1.5" /> Re-Compile Sheet
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload and Sheet Preview Column */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-300 hover:border-amber-500 dark:border-slate-800 dark:hover:border-amber-400 rounded-3xl p-12 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer min-h-[380px] group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png, image/webp"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 transition-transform">
              <ImageIcon className="w-8 h-8" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
              Upload 1 Passport Portrait Photo
            </h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-sm mx-auto leading-relaxed">
              Upload single portrait image. Automatically formats and multiplies into 6, 8, 12, 16, or 32 prints on 4x6 / A4 sheet!
            </p>
            <Button className="mt-6 bg-amber-500 hover:bg-amber-600 text-white font-bold">
              Select Photo
            </Button>
          </div>
        ) : (
          <div className="utility-card border rounded-3xl p-6 bg-slate-950 border-slate-800 flex flex-col items-center space-y-6">
            <div className="w-full flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="bg-amber-500 text-white text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded">
                Ready Print Sheet ({activePreset.name})
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {activePreset.count} Passport Prints ({activePreset.paper})
              </span>
            </div>

            {previewDataUrl ? (
              <div className="flex flex-col items-center space-y-5 w-full">
                <div className="p-3 border border-slate-800 rounded-2xl bg-black/60 max-h-[440px] overflow-auto flex items-center justify-center shadow-2xl">
                  <img
                    src={previewDataUrl}
                    alt="Passport Sheet Preview"
                    className="max-h-[400px] object-contain rounded shadow-lg border border-slate-700"
                  />
                </div>

                <div className="flex flex-wrap gap-3 justify-center w-full pt-2">
                  {pdfUrl && (
                    <a
                      href={pdfUrl}
                      download={`passport_sheet_${activePreset.id}_${Date.now()}.pdf`}
                      className="py-3 px-6 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
                    >
                      <Download className="w-4 h-4" /> Download Printable PDF
                    </a>
                  )}

                  <a
                    href={previewDataUrl}
                    download={`passport_sheet_${activePreset.id}_${Date.now()}.jpg`}
                    className="py-3 px-6 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-extrabold transition-all flex items-center justify-center gap-2 border border-slate-700"
                  >
                    <ImageIcon className="w-4 h-4" /> Download HD Sheet JPG
                  </a>
                </div>
              </div>
            ) : (
              <div className="py-20 text-center text-slate-400 text-xs">
                <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-2 text-amber-500" />
                Generating Passport Print Sheet...
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
