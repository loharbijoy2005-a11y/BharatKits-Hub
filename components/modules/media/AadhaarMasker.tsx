"use client";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/Button";
import { Upload, Eye, Trash2, Download, ShieldCheck, Sparkles, RefreshCw } from "lucide-react";

interface MaskBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

export default function AadhaarMasker() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [masks, setMasks] = useState<MaskBox[]>([]);
  const [boxWidth, setBoxWidth] = useState<number>(100);
  const [boxHeight, setBoxHeight] = useState<number>(30);
  const [processing, setProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Original image dimensions
  const [imgDimensions, setImgDimensions] = useState({ width: 0, height: 0 });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          setImgDimensions({ width: img.naturalWidth, height: img.naturalHeight });
          setImageSrc(url);
          setMasks([]);
          // Estimate default box size based on image size
          const estW = Math.max(50, Math.round(img.naturalWidth * 0.15));
          const estH = Math.max(15, Math.round(img.naturalHeight * 0.04));
          setBoxWidth(estW);
          setBoxHeight(estH);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    }
  };

  // Redraw canvas with image and black mask boxes
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Draw all mask boxes
      ctx.fillStyle = "black";
      masks.forEach((box) => {
        ctx.fillRect(box.x, box.y, box.width, box.height);
      });
    };
    img.src = imageSrc;
  }, [imageSrc, masks]);

  // Redraw whenever image or masks change
  useEffect(() => {
    drawCanvas();
  }, [drawCanvas]);

  // Click on canvas to place a box
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    
    // Scale coordinates back to original image size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    // Calculate click coordinates relative to canvas drawing size
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    // Center the mask box on the click position
    const boxX = Math.max(0, Math.min(canvas.width - boxWidth, clickX - boxWidth / 2));
    const boxY = Math.max(0, Math.min(canvas.height - boxHeight, clickY - boxHeight / 2));

    const newBox: MaskBox = {
      id: Date.now().toString() + "-" + Math.random(),
      x: Math.round(boxX),
      y: Math.round(boxY),
      width: boxWidth,
      height: boxHeight,
    };

    setMasks((prev) => [...prev, newBox]);
  };

  const handleRemoveMask = (id: string) => {
    setMasks((prev) => prev.filter((box) => box.id !== id));
  };

  const handleClearMasks = () => {
    setMasks([]);
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas || !imageSrc) return;

    setProcessing(true);
    try {
      const dataUrl = canvas.toDataURL("image/jpeg", 0.95);
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = `masked_aadhaar_${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Failed to export masked image.");
    } finally {
      setProcessing(false);
    }
  };

  const handleReset = () => {
    setImageSrc(null);
    setMasks([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameters Panel */}
      <div className="lg:col-span-4 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-500" /> Mask Settings
          </h3>

          {!imageSrc ? (
            <div className="text-xs text-slate-500 leading-normal space-y-3 font-semibold">
              <p>To mask Aadhaar numbers:</p>
              <ol className="list-decimal pl-4 space-y-2">
                <li>Upload an image scan of the front or back card.</li>
                <li>Adjust mask block size using the sliders.</li>
                <li>Click directly on the Aadhaar numbers on the preview canvas to apply a black box.</li>
                <li>Download your secure, masked image.</li>
              </ol>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Mask Size Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Block Width</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{boxWidth} px</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="400"
                  value={boxWidth}
                  onChange={(e) => setBoxWidth(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Block Height</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{boxHeight} px</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="150"
                  value={boxHeight}
                  onChange={(e) => setBoxHeight(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              {/* Active masks summary */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 space-y-3">
                <div className="flex justify-between items-center text-xs font-bold text-slate-400 uppercase">
                  <span>Mask Blocks ({masks.length})</span>
                  {masks.length > 0 && (
                    <button
                      onClick={handleClearMasks}
                      className="text-red-500 hover:text-red-700 text-[10px] lowercase font-extrabold flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> clear all
                    </button>
                  )}
                </div>

                {masks.length === 0 ? (
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-500" /> Click on the image to place a mask.
                  </div>
                ) : (
                  <div className="max-h-[140px] overflow-y-auto border border-slate-100 dark:border-slate-850 rounded-xl p-2.5 space-y-1.5">
                    {masks.map((mask, idx) => (
                      <div
                        key={mask.id}
                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-950 px-2 py-1.5 rounded-lg border border-slate-200/50 dark:border-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-400"
                      >
                        <span>Block #{idx + 1} at ({mask.x}, {mask.y})</span>
                        <button
                          onClick={() => handleRemoveMask(mask.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40 flex flex-col gap-2">
                <Button
                  onClick={handleDownload}
                  disabled={processing}
                  className="w-full py-2.5 flex items-center justify-center gap-2"
                >
                  {processing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" /> Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" /> Save Masked Card
                    </>
                  )}
                </Button>
                <button
                  onClick={handleReset}
                  className="w-full py-2 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 font-bold text-xs rounded-xl text-slate-500 hover:text-slate-700 hover:border-slate-300 dark:hover:text-slate-300 transition-all"
                >
                  Upload New Card
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preview/Canvas Panel */}
      <div className="lg:col-span-8 space-y-4">
        {!imageSrc ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-16 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer group border-slate-200/80 dark:border-slate-800/40"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp"
              className="hidden"
            />
            <div className="w-12 h-12 rounded-xl bg-brand-55 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Upload Aadhaar scan</h3>
            <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-normal max-w-xs mx-auto">
              Select or drag & drop a JPEG, PNG or WebP image file of your Aadhaar card.
            </p>
            <Button size="sm" className="mt-4">
              Select File
            </Button>
          </div>
        ) : (
          <div className="utility-card border rounded-3xl p-5 shadow-sm space-y-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400 flex items-center gap-1.5">
                Interactive Canvas Preview ({imgDimensions.width} x {imgDimensions.height})
              </span>
              <div className="flex gap-2 text-[10px] text-slate-400 font-bold">
                <span className="flex items-center gap-1"><Eye className="w-3 h-3 text-brand-500" /> Click to Place Mask</span>
              </div>
            </div>

            <div
              ref={containerRef}
              className="w-full flex justify-center bg-slate-50 dark:bg-slate-950 rounded-2xl overflow-hidden border border-slate-150 dark:border-slate-850 p-4 max-h-[500px] overflow-y-auto"
            >
              <canvas
                ref={canvasRef}
                onClick={handleCanvasClick}
                className="max-w-full h-auto cursor-crosshair rounded-lg border border-slate-200/50 shadow-sm"
                title="Click to place mask block"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
