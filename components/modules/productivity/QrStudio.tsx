"use client";
import React, { useState, useRef } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QRCodeSVG, QRCodeCanvas } from "qrcode.react";
import confetti from "canvas-confetti";
import { QrCode, Download, RefreshCw, Palette, Layers, Settings } from "lucide-react";

export default function QrStudio() {
  const [text, setText] = useState<string>("");
  const [fgColor, setFgColor] = useState<string>("#000000");
  const [bgColor, setBgColor] = useState<string>("#ffffff");
  const [size, setSize] = useState<number>(256);
  const [level, setLevel] = useState<"L" | "M" | "Q" | "H">("H");
  const [includeImage, setIncludeImage] = useState<boolean>(false);

  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.8 },
      colors: ["#7c3aed", "#3b82f6", "#10b981"],
    });
  };

  const handleDownloadPng = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `omnikits_qr_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerConfetti();
  };

  const handleDownloadSvg = () => {
    const svgElement = svgRef.current?.querySelector("svg");
    if (!svgElement) return;

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const blob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `omnikits_qr_${Date.now()}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    triggerConfetti();
  };

  const handleReset = () => {
    setText("");
    setFgColor("#000000");
    setBgColor("#ffffff");
    setSize(256);
    setLevel("H");
    setIncludeImage(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameter Controls Side */}
      <div className="lg:col-span-7 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            QR Configuration
          </h3>

          {/* Text input */}
          <div className="space-y-2">
            <label htmlFor="qr-text" className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
              Text or URL content
            </label>
            <textarea
              id="qr-text"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste link or write QR code text contents here..."
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150 resize-y font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-700"
            />
          </div>

          {/* Styling options (colors) */}
          <div className={`space-y-4 transition-all duration-300 ${text.trim() === "" ? "opacity-35 pointer-events-none" : "opacity-100"}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Foreground Color
                </label>
                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={fgColor}
                    onChange={(e) => setFgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-500">{fgColor.toUpperCase()}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Palette className="w-3 h-3" /> Background Color
                </label>
                <div className="flex items-center gap-2 border border-slate-200 dark:border-slate-800 rounded-xl p-2 bg-slate-50 dark:bg-slate-950">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded-lg border border-slate-300 dark:border-slate-700 bg-transparent cursor-pointer"
                  />
                  <span className="text-xs font-mono font-bold text-slate-500">{bgColor.toUpperCase()}</span>
                </div>
              </div>
            </div>

            {/* Sizes & redundancy levels */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Layers className="w-3 h-3" /> Dimensions (Scale)
                </label>
                <select
                  value={size}
                  onChange={(e) => setSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
                >
                  <option value={128}>Small (128px)</option>
                  <option value={256}>Medium (256px)</option>
                  <option value={512}>Large (512px)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide flex items-center gap-1">
                  <Settings className="w-3 h-3" /> Error Redundancy
                </label>
                <select
                  value={level}
                  onChange={(e) => setLevel(e.target.value as "L" | "M" | "Q" | "H")}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
                >
                  <option value="L">Level L (7% recovery)</option>
                  <option value="M">Level M (15% recovery)</option>
                  <option value="Q">Level Q (25% recovery)</option>
                  <option value="H">Level H (30% recovery) - Best</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={handleReset} className="w-1/3">
              Reset
            </Button>
            <Button
              disabled={text.trim() === ""}
              onClick={handleDownloadPng}
              className="w-2/3"
            >
              <Download className="w-4 h-4 mr-1.5" /> Download PNG
            </Button>
          </div>
        </div>
      </div>

      {/* Render Preview Side */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="utility-card border rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[350px] w-full max-w-sm">
          {text.trim() === "" ? (
            <div className="text-slate-400 dark:text-slate-600 text-center text-xs max-w-[200px]">
              <QrCode className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-800 mb-3 animate-pulse" />
              <p className="font-semibold text-slate-700 dark:text-slate-300">Waiting for text</p>
              <p className="text-slate-400 mt-1">Input link or paragraph values to render QR code vectors.</p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-4">
              {/* Visible SVG Renderer */}
              <div ref={svgRef} className="p-4 bg-white rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center">
                <QRCodeSVG
                  value={text}
                  size={192}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={level}
                />
              </div>

              {/* Hidden Canvas Renderer for PNG extraction */}
              <div ref={canvasRef} className="hidden">
                <QRCodeCanvas
                  value={text}
                  size={size}
                  fgColor={fgColor}
                  bgColor={bgColor}
                  level={level}
                />
              </div>

              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest">
                  Real-time Preview
                </span>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" onClick={handleDownloadSvg}>
                    Export Vector SVG
                  </Button>
                  <Button size="sm" onClick={handleDownloadPng}>
                    Export PNG Image
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
