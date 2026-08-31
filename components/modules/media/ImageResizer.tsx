"use client";
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Upload, HelpCircle, RefreshCw, Download, FileImage, Sliders, Check } from "lucide-react";

export default function ImageResizer() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0, originalWidth: 0, originalHeight: 0 });
  const [aspectRatio, setAspectRatio] = useState<number>(1);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [presetRatio, setPresetRatio] = useState<string>("free"); // "free", "1:1", "16:9", "4:3"
  const [format, setFormat] = useState<string>("image/jpeg");
  const [quality, setQuality] = useState<number>(80);
  const [targetKb, setTargetKb] = useState<string>("");
  const [processing, setProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFile(e.target.files[0]);
    }
  };

  const loadFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file.");
      return;
    }
    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const aspect = img.naturalWidth / img.naturalHeight;
        setDimensions({
          width: img.naturalWidth,
          height: img.naturalHeight,
          originalWidth: img.naturalWidth,
          originalHeight: img.naturalHeight,
        });
        setAspectRatio(aspect);
        setImageSrc(event.target?.result as string);
        setPresetRatio("free");
        setResultBlob(null);
        setResultUrl(null);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleWidthChange = (val: string) => {
    const w = parseInt(val) || 0;
    if (lockAspect && w > 0) {
      const h = Math.round(w / aspectRatio);
      setDimensions((prev) => ({ ...prev, width: w, height: h }));
    } else {
      setDimensions((prev) => ({ ...prev, width: w }));
    }
  };

  const handleHeightChange = (val: string) => {
    const h = parseInt(val) || 0;
    if (lockAspect && h > 0) {
      const w = Math.round(h * aspectRatio);
      setDimensions((prev) => ({ ...prev, width: w, height: h }));
    } else {
      setDimensions((prev) => ({ ...prev, height: h }));
    }
  };

  // Preset Ratio Applier
  const applyPresetRatio = (ratioType: string) => {
    setPresetRatio(ratioType);
    if (!imageSrc) return;

    let targetAspect = aspectRatio;
    if (ratioType === "1:1") targetAspect = 1;
    if (ratioType === "16:9") targetAspect = 16 / 9;
    if (ratioType === "4:3") targetAspect = 4 / 3;

    if (ratioType !== "free") {
      setLockAspect(true);
      setAspectRatio(targetAspect);
      const newHeight = Math.round(dimensions.width / targetAspect);
      setDimensions((prev) => ({ ...prev, height: newHeight }));
    }
  };

  useEffect(() => {
    if (imageSrc) {
      const timer = setTimeout(() => {
        processImage();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [dimensions.width, dimensions.height, format, quality, targetKb]);

  const processImage = () => {
    if (!imageSrc) return;
    setProcessing(true);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();

    img.onload = () => {
      canvas.width = dimensions.width || 1;
      canvas.height = dimensions.height || 1;

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const target = parseFloat(targetKb);
        if (target > 0 && format !== "image/png") {
          // Binary Search for target KB matching
          let low = 0.01;
          let high = 1.0;
          let iterations = 0;
          let bestBlob: Blob | null = null;
          let bestDiff = Infinity;
          const targetBytes = target * 1024;

          const runBinarySearch = () => {
            if (iterations >= 8) {
              if (bestBlob) {
                updateResult(bestBlob);
              } else {
                canvas.toBlob((b) => b && updateResult(b), format, quality / 100);
              }
              return;
            }

            const mid = (low + high) / 2;
            canvas.toBlob(
              (blob) => {
                if (blob) {
                  const diff = Math.abs(blob.size - targetBytes);
                  if (diff < bestDiff) {
                    bestDiff = diff;
                    bestBlob = blob;
                  }
                  if (blob.size > targetBytes) {
                    high = mid;
                  } else {
                    low = mid;
                  }
                }
                iterations++;
                runBinarySearch();
              },
              format,
              mid
            );
          };
          runBinarySearch();
        } else {
          // Regular Quality slider compression
          canvas.toBlob(
            (blob) => {
              if (blob) updateResult(blob);
            },
            format,
            format === "image/png" ? undefined : quality / 100
          );
        }
      }
    };
    img.src = imageSrc;
  };

  const updateResult = (blob: Blob) => {
    setResultBlob(blob);
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setResultUrl(URL.createObjectURL(blob));
    setProcessing(false);
  };

  const handleReset = () => {
    setImageSrc(null);
    setOriginalFile(null);
    setResultBlob(null);
    setResultUrl(null);
    setTargetKb("");
    setQuality(80);
    setFormat("image/jpeg");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const originalSizeFormatted = originalFile ? formatBytes(originalFile.size) : "0 KB";
  const resultSizeFormatted = resultBlob ? formatBytes(resultBlob.size) : "0 KB";
  const savingsPercent =
    originalFile && resultBlob
      ? Math.round(((originalFile.size - resultBlob.size) / originalFile.size) * 100)
      : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Upload & Preview Side */}
      <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-12 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer min-h-[400px] group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-6 group-hover:scale-110 transition-transform">
              <Upload className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-slate-850 dark:text-white">Upload image file</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-2 max-w-xs mx-auto leading-relaxed">
              Drag and drop your image, or click to browse. Supports PNG, JPG, JPEG, and WebP.
            </p>
            <Button className="mt-8">Select File</Button>
          </div>
        ) : (
          <div className="utility-card border rounded-3xl p-6 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
            <span className="absolute top-4 left-4 bg-slate-900/60 dark:bg-black/60 text-white text-[10px] uppercase font-extrabold tracking-widest px-2.5 py-1 rounded-lg backdrop-blur">
              Resized Output Preview
            </span>
            {resultUrl ? (
              <img
                ref={imageRef}
                src={resultUrl}
                alt="Output preview"
                className="max-h-[380px] w-auto object-contain rounded-2xl shadow-md border border-slate-100 dark:border-slate-800"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <RefreshCw className="w-8 h-8 animate-spin" />
                <span className="text-xs">Processing changes...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Settings Side */}
      <div className="lg:col-span-5">
        {imageSrc ? (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-6">
            <div className="flex justify-between items-center border-b border-slate-150 dark:border-slate-800 pb-4">
              <div>
                <CardTitle>Resizer Settings</CardTitle>
                <CardDescription>Adjust canvas parameters dynamically</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reset
              </Button>
            </div>

            {/* Scale aspect controls */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Dimensions (px)</label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="checkbox"
                    id="lock-aspect"
                    checked={lockAspect}
                    onChange={(e) => setLockAspect(e.target.checked)}
                    className="w-4 h-4 text-brand-600 border-slate-300 dark:border-slate-700 rounded focus:ring-brand-500"
                  />
                  <label htmlFor="lock-aspect" className="text-[11px] font-semibold text-slate-500 select-none cursor-pointer">Lock Ratio</label>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Width</span>
                  <input
                    type="number"
                    value={dimensions.width}
                    onChange={(e) => handleWidthChange(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Height</span>
                  <input
                    type="number"
                    value={dimensions.height}
                    onChange={(e) => handleHeightChange(e.target.value)}
                    className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
                  />
                </div>
              </div>

              {/* Presets */}
              <div className="grid grid-cols-4 gap-2 pt-2">
                {["free", "1:1", "16:9", "4:3"].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => applyPresetRatio(ratio)}
                    className={`py-1.5 text-[11px] font-bold rounded-lg border transition-all ${
                      presetRatio === ratio
                        ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500"
                    }`}
                  >
                    {ratio === "free" ? "Custom" : ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Export Format settings */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Export Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
              >
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/webp">WEBP (.webp)</option>
                <option value="image/png">PNG (.png) - Lossless</option>
              </select>
            </div>

            {/* Target KB slider/input */}
            {format !== "image/png" ? (
              <div className="space-y-4">
                <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Quality Compression</label>
                    <span className="text-xs font-bold text-brand-600 dark:text-brand-400">{quality}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={quality}
                    disabled={targetKb !== ""}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full h-1.5 bg-slate-250 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400 disabled:opacity-30"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Target File Size (KB)</label>
                    <div className="group relative">
                      <HelpCircle className="w-3.5 h-3.5 text-slate-400 cursor-help" />
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-slate-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none leading-normal">
                        Input size constraints. We binary-search canvas compression levels automatically. Leave blank to use Quality %.
                      </div>
                    </div>
                  </div>
                  <input
                    type="number"
                    placeholder="Enter target size in KB (e.g. 100)"
                    value={targetKb}
                    onChange={(e) => setTargetKb(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
                  />
                </div>
              </div>
            ) : null}

            {/* Savings dashboard */}
            <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-100 dark:border-slate-900/50 space-y-3">
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Compression Statistics</span>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="block text-[10px] text-slate-500 font-semibold">Original Size</span>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{originalSizeFormatted}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-slate-500 font-semibold">Processed Size</span>
                  <span className="text-sm font-bold text-brand-650 dark:text-brand-400">{resultSizeFormatted}</span>
                </div>
              </div>
              {savingsPercent > 0 ? (
                <div className="pt-2 border-t border-slate-200/50 dark:border-slate-800/40 flex justify-between items-center">
                  <span className="text-xs text-slate-500 font-medium">Efficiency</span>
                  <span className="text-xs px-2.5 py-0.5 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-450 border border-green-200/40 dark:border-green-800/20 rounded-full font-bold">
                    {savingsPercent}% Saved
                  </span>
                </div>
              ) : null}
            </div>

            {/* Download Link */}
            {resultUrl && (
              <a
                href={resultUrl}
                download={`omnikits_resized_${Date.now()}.${format === "image/jpeg" ? "jpg" : format.split("/")[1]}`}
                className="w-full py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 active:scale-[0.98]"
              >
                <Download className="w-4 h-4" /> Download Processed Image
              </a>
            )}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 p-6 rounded-3xl text-center text-slate-400 min-h-[300px] flex flex-col items-center justify-center space-y-3">
            <FileImage className="w-10 h-10 text-slate-300 dark:text-slate-800" />
            <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">No image loaded</h4>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">Please upload an image first to edit options.</p>
          </div>
        )}
      </div>
    </div>
  );
}
