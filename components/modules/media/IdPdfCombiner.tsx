"use client";
import React, { useState, useRef } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PDFDocument } from "pdf-lib";
import { Upload, Download, RefreshCw, FileText, Image as ImageIcon, Sliders, Trash2 } from "lucide-react";

export default function IdPdfCombiner() {
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [frontFile, setFrontFile] = useState<File | null>(null);
  const [backFile, setBackFile] = useState<File | null>(null);

  // Layout parameters
  const [margin, setMargin] = useState<number>(50);
  const [spacing, setSpacing] = useState<number>(30);
  const [scale, setScale] = useState<number>(85); // % of A4 page width
  
  const [compiling, setCompiling] = useState<boolean>(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const frontInputRef = useRef<HTMLInputElement>(null);
  const backInputRef = useRef<HTMLInputElement>(null);

  const handleFrontChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFrontFile(file);
      setFrontImage(URL.createObjectURL(file));
      setPdfUrl(null);
    }
  };

  const handleBackChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setBackFile(file);
      setBackImage(URL.createObjectURL(file));
      setPdfUrl(null);
    }
  };

  const handleCombine = async () => {
    if (!frontFile || !backFile) return;
    setCompiling(true);

    try {
      // Create new PDF Document
      const pdfDoc = await PDFDocument.create();
      
      // Standard A4 dimensions: 595.28 x 841.89 points
      const pageWidth = 595.28;
      const pageHeight = 841.89;
      
      const page = pdfDoc.addPage([pageWidth, pageHeight]);

      // Read files
      const readAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
        return new Promise((res, rej) => {
          const reader = new FileReader();
          reader.onload = () => res(reader.result as ArrayBuffer);
          reader.onerror = () => rej(reader.error);
          reader.readAsArrayBuffer(file);
        });
      };

      const frontBytes = await readAsArrayBuffer(frontFile);
      const backBytes = await readAsArrayBuffer(backFile);

      // Embed image helper (supporting both PNG and JPEG)
      const embedImage = async (bytes: ArrayBuffer, name: string) => {
        if (name.endsWith(".png")) {
          return await pdfDoc.embedPng(bytes);
        }
        return await pdfDoc.embedJpg(bytes);
      };

      const embeddedFront = await embedImage(frontBytes, frontFile.name.toLowerCase());
      const embeddedBack = await embedImage(backBytes, backFile.name.toLowerCase());

      // Layout maths
      // Maximum width allowed for the images based on scale percentage
      const maxImgWidth = (pageWidth - 2 * margin) * (scale / 100);
      
      // Front dimensions
      const fRatio = embeddedFront.width / embeddedFront.height;
      let fWidth = maxImgWidth;
      let fHeight = maxImgWidth / fRatio;

      // Back dimensions
      const bRatio = embeddedBack.width / embeddedBack.height;
      let bWidth = maxImgWidth;
      let bHeight = maxImgWidth / bRatio;

      // Positioning coordinates (PDF y-axis goes from bottom to top)
      // We want them stacked and centered horizontally
      const fx = (pageWidth - fWidth) / 2;
      const bx = (pageWidth - bWidth) / 2;

      // Stack starting from top of page
      const fy = pageHeight - margin - fHeight;
      const by = fy - spacing - bHeight;

      // Draw
      page.drawImage(embeddedFront, {
        x: fx,
        y: fy,
        width: fWidth,
        height: fHeight,
      });

      page.drawImage(embeddedBack, {
        x: bx,
        y: by,
        width: bWidth,
        height: bHeight,
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      
      if (pdfUrl) URL.revokeObjectURL(pdfUrl);
      setPdfUrl(URL.createObjectURL(blob));
    } catch (err) {
      console.error("ID PDF combination failed:", err);
      alert("Error combining scans. Please make sure both files are clean JPEGs or PNGs.");
    } finally {
      setCompiling(false);
    }
  };

  const handleClear = () => {
    setFrontImage(null);
    setBackImage(null);
    setFrontFile(null);
    setBackFile(null);
    setPdfUrl(null);
    if (frontInputRef.current) frontInputRef.current.value = "";
    if (backInputRef.current) backInputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Upload Zone */}
      <div className="lg:col-span-8 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Front Image Drop */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">ID Card Front Side</span>
            {!frontImage ? (
              <div
                onClick={() => frontInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-8 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer min-h-[220px]"
              >
                <input
                  type="file"
                  ref={frontInputRef}
                  onChange={handleFrontChange}
                  accept="image/jpeg, image/png"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-300 mb-4" />
                <span className="text-xs font-bold text-slate-850 dark:text-white">Upload Front ID Image</span>
                <span className="text-[10px] text-slate-400 mt-1">Aadhaar / PAN front photo (JPEG, PNG)</span>
              </div>
            ) : (
              <div className="utility-card border rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 min-h-[220px]">
                <button
                  type="button"
                  onClick={() => {
                    setFrontImage(null);
                    setFrontFile(null);
                    setPdfUrl(null);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-lg bg-black/60 text-red-400 hover:text-red-650 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <img src={frontImage} className="max-w-full max-h-[140px] rounded object-contain shadow-lg" alt="Front Preview" />
                <span className="text-[9px] text-slate-450 font-mono mt-3 uppercase tracking-wider">Front scan loaded</span>
              </div>
            )}
          </div>

          {/* Back Image Drop */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">ID Card Back Side</span>
            {!backImage ? (
              <div
                onClick={() => backInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-8 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer min-h-[220px]"
              >
                <input
                  type="file"
                  ref={backInputRef}
                  onChange={handleBackChange}
                  accept="image/jpeg, image/png"
                  className="hidden"
                />
                <Upload className="w-8 h-8 text-slate-300 mb-4" />
                <span className="text-xs font-bold text-slate-850 dark:text-white">Upload Back ID Image</span>
                <span className="text-[10px] text-slate-400 mt-1">Aadhaar / PAN back address (JPEG, PNG)</span>
              </div>
            ) : (
              <div className="utility-card border rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950 min-h-[220px]">
                <button
                  type="button"
                  onClick={() => {
                    setBackImage(null);
                    setBackFile(null);
                    setPdfUrl(null);
                  }}
                  className="absolute top-3 right-3 p-1 rounded-lg bg-black/60 text-red-400 hover:text-red-650 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <img src={backImage} className="max-w-full max-h-[140px] rounded object-contain shadow-lg" alt="Back Preview" />
                <span className="text-[9px] text-slate-450 font-mono mt-3 uppercase tracking-wider">Back scan loaded</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adjustments Panel */}
      <div className="lg:col-span-4">
        {frontImage && backImage ? (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <CardTitle>Combiner Panel</CardTitle>
                <CardDescription>Compile stacked A4 document</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleClear}>
                Reset
              </Button>
            </div>

            {/* Layout Parameters Sliders */}
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  <span>Page Margins</span>
                  <span>{margin} pt</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={margin}
                  onChange={(e) => {
                    setMargin(parseInt(e.target.value));
                    setPdfUrl(null);
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  <span>Image Spacing</span>
                  <span>{spacing} pt</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={spacing}
                  onChange={(e) => {
                    setSpacing(parseInt(e.target.value));
                    setPdfUrl(null);
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-bold text-slate-500 uppercase tracking-wide">
                  <span>Image Width Scale</span>
                  <span>{scale}%</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={scale}
                  onChange={(e) => {
                    setScale(parseInt(e.target.value));
                    setPdfUrl(null);
                  }}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
              {!pdfUrl ? (
                <Button
                  onClick={handleCombine}
                  disabled={compiling}
                  className="w-full py-3 flex items-center justify-center gap-1.5"
                >
                  {compiling ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Document...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" /> Compile and Layout A4
                    </>
                  )}
                </Button>
              ) : (
                <div className="space-y-2">
                  <a
                    href={pdfUrl}
                    download={`id_front_back_combined_${Date.now()}.pdf`}
                    className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20"
                  >
                    <Download className="w-4 h-4" /> Download Combined A4 PDF
                  </a>
                  
                  <Button
                    variant="outline"
                    onClick={() => setPdfUrl(null)}
                    className="w-full py-3 font-semibold text-xs"
                  >
                    Adjust Layout
                  </Button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 p-6 rounded-3xl text-center text-slate-400 min-h-[220px] flex flex-col items-center justify-center space-y-3">
            <ImageIcon className="w-8 h-8 text-slate-350 dark:text-slate-800" />
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Combiner Locked</h4>
            <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed mx-auto">
              Please upload both **Front Side** and **Back Side** images first.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
