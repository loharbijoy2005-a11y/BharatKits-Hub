"use client";
import React, { useState, useRef, useEffect } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Image, Download, Trash2, Sliders, CheckCircle, RefreshCw, Info } from "lucide-react";

interface Preset {
  name: string;
  widthCm: number;
  heightCm: number;
  widthPx: number;
  heightPx: number;
  targetKb: number;
  desc: string;
}

const govtPresets: Preset[] = [
  {
    name: "UPSC / SSC Passport Photo",
    widthCm: 3.5,
    heightCm: 4.5,
    widthPx: 350,
    heightPx: 450,
    targetKb: 50,
    desc: "Standard photo dimensions for SSC, UPSC, and State PSC applications (20KB - 50KB).",
  },
  {
    name: "Govt Signature Upload",
    widthCm: 4.5,
    heightCm: 1.5,
    widthPx: 350,
    heightPx: 120,
    targetKb: 20,
    desc: "Standard signature size. Almost all portals require this to be under 20KB.",
  },
  {
    name: "Aadhaar / PAN Document Scan",
    widthCm: 21.0,
    heightCm: 29.7,
    widthPx: 1200,
    heightPx: 1600,
    targetKb: 200,
    desc: "Clear scan of document IDs for uploading online (under 200KB/300KB).",
  },
];

export default function GovtImageResizer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  
  // Resizing state
  const [presetIdx, setPresetIdx] = useState<number>(0);
  const [customWidth, setCustomWidth] = useState<string>("350");
  const [customHeight, setCustomHeight] = useState<string>("450");
  const [targetKb, setTargetKb] = useState<number>(50);
  
  const [processing, setProcessing] = useState<boolean>(false);
  const [resizedUrl, setResizedUrl] = useState<string | null>(null);
  const [resultStats, setResultStats] = useState({
    width: 0,
    height: 0,
    sizeKb: 0,
    quality: 0.8,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setImageSrc(url);
      setResizedUrl(null);
    }
  };

  const handleResize = async () => {
    if (!imageSrc) return;
    setProcessing(true);

    const img = document.createElement("img");
    img.src = imageSrc;
    img.onload = async () => {
      // Determine dimensions
      let targetW = 0;
      let targetH = 0;

      if (presetIdx !== -1) {
        targetW = govtPresets[presetIdx].widthPx;
        targetH = govtPresets[presetIdx].heightPx;
      } else {
        targetW = parseInt(customWidth) || 350;
        targetH = parseInt(customHeight) || 450;
      }

      // Create Canvas
      const canvas = document.createElement("canvas");
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        setProcessing(false);
        return;
      }

      // Draw and center crop / cover ratio
      const imageRatio = img.width / img.height;
      const canvasRatio = targetW / targetH;
      let dx = 0, dy = 0, dWidth = targetW, dHeight = targetH;

      if (imageRatio > canvasRatio) {
        const sourceWidth = img.height * canvasRatio;
        dx = (img.width - sourceWidth) / 2;
        ctx.drawImage(img, dx, 0, sourceWidth, img.height, 0, 0, targetW, targetH);
      } else {
        const sourceHeight = img.width / canvasRatio;
        dy = (img.height - sourceHeight) / 2;
        ctx.drawImage(img, 0, dy, img.width, sourceHeight, 0, 0, targetW, targetH);
      }

      // Binary Search Quality Compression to target KB
      let minQuality = 0.01;
      let maxQuality = 0.99;
      let quality = 0.85;
      let iterations = 8;
      let finalBlob: Blob | null = null;
      let sizeKb = 0;

      for (let i = 0; i < iterations; i++) {
        const q = (minQuality + maxQuality) / 2;
        const blob = await new Promise<Blob | null>((res) => {
          canvas.toBlob((b) => res(b), "image/jpeg", q);
        });

        if (!blob) break;

        sizeKb = blob.size / 1024;
        finalBlob = blob;
        quality = q;

        if (sizeKb > targetKb) {
          maxQuality = q; // shrink quality
        } else {
          minQuality = q; // raise quality (room for detail)
        }
      }

      if (finalBlob) {
        if (resizedUrl) URL.revokeObjectURL(resizedUrl);
        setResizedUrl(URL.createObjectURL(finalBlob));
        setResultStats({
          width: targetW,
          height: targetH,
          sizeKb: parseFloat(sizeKb.toFixed(2)),
          quality: parseFloat(quality.toFixed(2)),
        });
      }

      setProcessing(false);
    };
  };

  const handleReset = () => {
    setSelectedFile(null);
    setImageSrc(null);
    setResizedUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Sync target KB when preset changes
  useEffect(() => {
    if (presetIdx !== -1) {
      setTargetKb(govtPresets[presetIdx].targetKb);
    }
  }, [presetIdx]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Configuration Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Govt Form Presets
          </h3>

          {/* Presets Select */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Select Preset</label>
            <select
              value={presetIdx}
              onChange={(e) => setPresetIdx(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
            >
              {govtPresets.map((p, idx) => (
                <option key={idx} value={idx}>
                  {p.name} ({p.widthCm}x{p.heightCm} cm)
                </option>
              ))}
              <option value={-1}>Custom Dimensions</option>
            </select>
          </div>

          {presetIdx !== -1 && (
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl flex gap-2 border border-slate-100 dark:border-slate-850">
              <Info className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                {govtPresets[presetIdx].desc}
              </p>
            </div>
          )}

          {/* Custom Size Fields */}
          {presetIdx === -1 && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Width (px)</label>
                <input
                  type="number"
                  value={customWidth}
                  onChange={(e) => setCustomWidth(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Height (px)</label>
                <input
                  type="number"
                  value={customHeight}
                  onChange={(e) => setCustomHeight(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                />
              </div>
            </div>
          )}

          {/* Target size KB limit */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
              <span>Target File Size Limit</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">Under {targetKb} KB</span>
            </div>
            <input
              type="range"
              min="10"
              max="500"
              step="5"
              value={targetKb}
              onChange={(e) => setTargetKb(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <Button variant="outline" className="w-1/3" onClick={handleReset} disabled={!imageSrc}>
              Clear
            </Button>
            <Button className="w-2/3" onClick={handleResize} disabled={!imageSrc || processing}>
              {processing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-1.5 animate-spin" /> Compressing...
                </>
              ) : (
                <>
                  <Sliders className="w-4 h-4 mr-1.5" /> Apply Preset & Rescale
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Upload and preview Area */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-12 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer min-h-[350px] group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg, image/png"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/40 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform">
              <Image className="w-8 h-8" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-850 dark:text-white">Load Photo / Signature Scan</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
              Accepts JPG, JPEG, and PNG. Formats automatically into official uploadable JPEG sizes.
            </p>
            <Button className="mt-8">Select File</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 min-h-[350px]">
            {/* Input Preview */}
            <div className="utility-card border rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
              <span className="absolute top-4 left-4 bg-black/60 text-white text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded z-10">
                Original Image
              </span>
              <img src={imageSrc} className="max-w-full max-h-[220px] rounded-lg object-contain shadow-lg" alt="Original Input" />
              {selectedFile && (
                <span className="text-[10px] text-slate-400 font-mono mt-4">
                  {(selectedFile.size / 1024).toFixed(1)} KB (Initial)
                </span>
              )}
            </div>

            {/* Compiled Preset preview */}
            <div className="utility-card border rounded-3xl p-4 flex flex-col items-center justify-center relative overflow-hidden bg-slate-950">
              <span className="absolute top-4 left-4 bg-emerald-500 text-white text-[9px] uppercase font-black tracking-widest px-2 py-0.5 rounded z-10">
                Output JPEG
              </span>
              
              {resizedUrl ? (
                <div className="flex flex-col items-center space-y-4">
                  <div className="p-2 border border-slate-800 rounded bg-black/40 flex items-center justify-center">
                    <img src={resizedUrl} className="max-w-full max-h-[160px] rounded object-contain shadow-lg" alt="Rescaled output" />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-xs font-bold text-slate-350 flex items-center gap-1 justify-center">
                      <CheckCircle className="w-4 h-4 text-emerald-500" /> Matches Limit!
                    </div>
                    <div className="text-[11px] text-slate-450 font-mono mt-1 space-y-0.5">
                      <div>Dimensions: {resultStats.width} x {resultStats.height} px</div>
                      <div>File size: {resultStats.sizeKb} KB</div>
                    </div>
                  </div>

                  <a
                    href={resizedUrl}
                    download={`govt_form_photo_${Date.now()}.jpg`}
                    className="py-2.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-md shadow-brand-500/10"
                  >
                    <Download className="w-4 h-4" /> Save Ready JPG
                  </a>
                </div>
              ) : (
                <div className="text-center text-slate-400 text-xs">
                  <p>Click "Apply Preset" to compile and compress the photo.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
