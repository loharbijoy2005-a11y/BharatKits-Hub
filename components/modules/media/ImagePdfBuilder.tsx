"use client";
import React, { useState, useRef } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PDFDocument } from "pdf-lib";
import { Upload, FileImage, Trash2, ArrowLeft, ArrowRight, Download, FileText, RefreshCw } from "lucide-react";

interface PdfImageItem {
  id: string;
  name: string;
  dataUrl: string;
  width: number;
  height: number;
}

export default function ImagePdfBuilder() {
  const [images, setImages] = useState<PdfImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "match">("a4");
  const [margin, setMargin] = useState<number>(10);
  const [processing, setProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      loadFiles(e.target.files);
    }
  };

  const loadFiles = (fileList: FileList) => {
    const validFiles = Array.from(fileList).filter((f) => f.type.startsWith("image/"));
    if (validFiles.length === 0) return;

    let loadedCount = 0;
    const loadedItems: PdfImageItem[] = [];

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          loadedItems.push({
            id: Date.now() + "-" + Math.random(),
            name: file.name,
            dataUrl: url,
            width: img.naturalWidth,
            height: img.naturalHeight,
          });
          loadedCount++;
          if (loadedCount === validFiles.length) {
            setImages((prev) => [...prev, ...loadedItems]);
          }
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemove = (id: string) => {
    setImages((prev) => prev.filter((item) => item.id !== id));
  };

  const handleMove = (index: number, direction: -1 | 1) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    setImages((prev) => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[targetIndex];
      copy[targetIndex] = temp;
      return copy;
    });
  };

  const handleClearAll = () => {
    setImages([]);
  };

  const generatePdf = async () => {
    if (images.length === 0) return;
    setProcessing(true);

    try {
      const pdfDoc = await PDFDocument.create();

      for (const imgObj of images) {
        // Fetch raw image bytes from base64 dataUrl
        const response = await fetch(imgObj.dataUrl);
        const imageBytes = await response.arrayBuffer();

        let embeddedImage;
        const isPng =
          imgObj.name.toLowerCase().endsWith(".png") ||
          imgObj.dataUrl.includes("image/png");

        if (isPng) {
          embeddedImage = await pdfDoc.embedPng(imageBytes);
        } else {
          // Fallback to embedJpg for JPEGs and WebPs
          embeddedImage = await pdfDoc.embedJpg(imageBytes);
        }

        const w = embeddedImage.width;
        const h = embeddedImage.height;

        let page;
        if (pageSize === "a4") {
          // Standard A4 dimensions in points: 595.28 x 841.89
          const isLandscape = w > h;
          const pW = isLandscape ? 841.89 : 595.28;
          const pH = isLandscape ? 595.28 : 841.89;

          page = pdfDoc.addPage([pW, pH]);

          const availW = pW - margin * 2;
          const availH = pH - margin * 2;
          const imgAspect = w / h;
          const pageAspect = availW / availH;

          let dW, dH;
          if (imgAspect > pageAspect) {
            dW = availW;
            dH = availW / imgAspect;
          } else {
            dH = availH;
            dW = availH * imgAspect;
          }

          const x = margin + (availW - dW) / 2;
          const y = margin + (availH - dH) / 2;

          page.drawImage(embeddedImage, {
            x,
            y,
            width: dW,
            height: dH,
          });
        } else {
          // Match Image size exactly
          page = pdfDoc.addPage([w, h]);
          page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width: w,
            height: h,
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `omnikits_document_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Error compiling PDF. Some WebP or rare file formats must be processed as JPEGs.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left Area: Upload and Queue */}
      <div className="lg:col-span-8 space-y-6">
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-8 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer group"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            multiple
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-base font-extrabold text-slate-800 dark:text-white">Load compilation images</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-normal max-w-xs mx-auto">
            Upload multiple JPEG or PNG images. Drag & drop works as well.
          </p>
          <Button size="sm" className="mt-4">
            Select Files
          </Button>
        </div>

        {/* List Grid Queue */}
        {images.length === 0 ? (
          <div className="text-center py-16 text-slate-400 border border-slate-200/50 dark:border-slate-850 rounded-3xl bg-white/30 dark:bg-slate-950/20">
            <FileImage className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800 mb-3" />
            <p className="text-sm font-semibold">Image queue is empty</p>
            <p className="text-xs text-slate-400 mt-1">Upload images above to build your document pages.</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center px-1">
              <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
                Compile Queue ({images.length} Pages)
              </span>
              <button
                onClick={handleClearAll}
                className="text-xs font-semibold text-red-500 hover:text-red-700 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" /> Clear Queue
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative group flex flex-col bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/40 p-3 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5"
                >
                  <img
                    src={item.dataUrl}
                    alt={item.name}
                    className="w-full h-28 object-cover rounded-xl mb-3 bg-slate-100 dark:bg-slate-950"
                  />
                  <div className="text-[11px] font-bold text-slate-800 dark:text-slate-150 truncate pr-6">
                    {item.name}
                  </div>
                  <div className="text-[9px] text-slate-400 font-semibold mt-0.5">
                    {item.width} x {item.height} px
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-4 right-4 bg-red-500 hover:bg-red-600 text-white w-6 h-6 rounded-full flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                    aria-label="Remove image"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800">
                    <span className="text-[10px] text-slate-400 font-extrabold uppercase">Page {idx + 1}</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handleMove(idx, -1)}
                        disabled={idx === 0}
                        className="w-5.5 h-5.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                      >
                        <ArrowLeft className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleMove(idx, 1)}
                        disabled={idx === images.length - 1}
                        className="w-5.5 h-5.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/50 flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-750 transition-colors"
                      >
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Area: PDF Settings */}
      <div className="lg:col-span-4">
        {images.length > 0 ? (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
            <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
              Document Configurations
            </h3>

            {/* Page size settings */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                Target Page Layout
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as "a4" | "match")}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
              >
                <option value="a4">Standard A4 Size (Auto-Orient)</option>
                <option value="match">Match Image Dimensions</option>
              </select>
            </div>

            {/* Margins */}
            {pageSize === "a4" && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Page Margins</span>
                  <span className="text-brand-600 dark:text-brand-400">{margin} pt</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="40"
                  value={margin}
                  onChange={(e) => setMargin(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>
            )}

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <Button
                onClick={generatePdf}
                disabled={processing}
                className="w-full py-3 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Compiling Document...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download PDF Vector
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 p-6 rounded-3xl text-center text-slate-400 min-h-[250px] flex flex-col items-center justify-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-800" />
            <h4 className="text-sm font-bold text-slate-850 dark:text-slate-200">Settings Locked</h4>
            <p className="text-xs text-slate-400 max-w-[200px] leading-relaxed">
              Add images to the page compiler to access PDF formatting settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
