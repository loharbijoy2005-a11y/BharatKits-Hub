"use client";
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { PDFDocument } from "pdf-lib";
import { Upload, FileImage, Trash2, ArrowLeft, ArrowRight, Download, FileText, RefreshCw, RotateCw, Sparkles } from "lucide-react";

interface PdfImageItem {
  id: string;
  name: string;
  dataUrl: string; // original image
  processedUrl: string; // processed image
  width: number;
  height: number;
  filter: "none" | "grayscale" | "photocopy" | "high-contrast";
  rotation: number;
}

export default function ImagePdfBuilder() {
  const [images, setImages] = useState<PdfImageItem[]>([]);
  const [pageSize, setPageSize] = useState<"a4" | "match">("a4");
  const [margin, setMargin] = useState<number>(10);
  const [processing, setProcessing] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Apply canvas filters and rotation
  const applyImageTransformations = (
    originalUrl: string,
    filter: "none" | "grayscale" | "photocopy" | "high-contrast",
    rotation: number
  ): Promise<{ dataUrl: string; width: number; height: number }> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          resolve({ dataUrl: originalUrl, width: img.naturalWidth, height: img.naturalHeight });
          return;
        }

        const isRotated90or270 = rotation === 90 || rotation === 270;
        const canvasWidth = isRotated90or270 ? img.naturalHeight : img.naturalWidth;
        const canvasHeight = isRotated90or270 ? img.naturalWidth : img.naturalHeight;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Apply transformations
        ctx.translate(canvasWidth / 2, canvasHeight / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);

        // Apply filters
        if (filter !== "none") {
          const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const data = imgData.data;

          for (let i = 0; i < data.length; i += 4) {
            const r = data[i];
            const g = data[i + 1];
            const b = data[i + 2];
            const gray = 0.299 * r + 0.587 * g + 0.114 * b;

            if (filter === "grayscale") {
              data[i] = gray;
              data[i + 1] = gray;
              data[i + 2] = gray;
            } else if (filter === "high-contrast") {
              const val = gray > 128 ? 255 : 0;
              data[i] = val;
              data[i + 1] = val;
              data[i + 2] = val;
            } else if (filter === "photocopy") {
              // Standard photocopy filter: make bright pixels pure white (255) to remove noise/shadows
              let val = gray;
              if (gray > 155) {
                val = 255;
              } else {
                val = Math.max(0, gray - 45); // Darken text
              }
              data[i] = val;
              data[i + 1] = val;
              data[i + 2] = val;
            }
          }
          ctx.putImageData(imgData, 0, 0);
        }

        resolve({
          dataUrl: canvas.toDataURL("image/jpeg", 0.9),
          width: canvas.width,
          height: canvas.height,
        });
      };
      img.src = originalUrl;
    });
  };

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
            processedUrl: url,
            width: img.naturalWidth,
            height: img.naturalHeight,
            filter: "none",
            rotation: 0,
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

  const handleFilterChange = async (
    id: string,
    newFilter: "none" | "grayscale" | "photocopy" | "high-contrast"
  ) => {
    const item = images.find((img) => img.id === id);
    if (!item) return;

    const { dataUrl, width, height } = await applyImageTransformations(item.dataUrl, newFilter, item.rotation);

    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              filter: newFilter,
              processedUrl: dataUrl,
              width,
              height,
            }
          : img
      )
    );
  };

  const handleRotationChange = async (id: string) => {
    const item = images.find((img) => img.id === id);
    if (!item) return;

    const nextRotation = (item.rotation + 90) % 360;
    const { dataUrl, width, height } = await applyImageTransformations(item.dataUrl, item.filter, nextRotation);

    setImages((prev) =>
      prev.map((img) =>
        img.id === id
          ? {
              ...img,
              rotation: nextRotation,
              processedUrl: dataUrl,
              width,
              height,
            }
          : img
      )
    );
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
        const response = await fetch(imgObj.processedUrl);
        const imageBytes = await response.arrayBuffer();

        // Canvas outputs JPEGs (image/jpeg) in base64
        const embeddedImage = await pdfDoc.embedJpg(imageBytes);

        const w = embeddedImage.width;
        const h = embeddedImage.height;

        let page;
        if (pageSize === "a4") {
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
      link.download = `bharatkits_scanner_${Date.now()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("PDF generation failed:", err);
      alert("Error compiling PDF scanner document.");
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
          className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-3xl p-8 text-center transition-all bg-white/40 dark:bg-slate-900/30 flex flex-col items-center justify-center cursor-pointer group border-slate-200/80 dark:border-slate-800/40"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg, image/webp"
            multiple
            className="hidden"
          />
          <div className="w-12 h-12 rounded-xl bg-brand-55 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 mb-4 group-hover:scale-105 transition-transform">
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-extrabold text-slate-800 dark:text-white">Load compilation images</h3>
          <p className="text-slate-500 dark:text-slate-400 text-xs mt-1 leading-normal max-w-xs mx-auto">
            Upload multiple JPEG, PNG or WebP document photos. Drag & drop works as well.
          </p>
          <Button size="sm" className="mt-4">
            Select Files
          </Button>
        </div>

        {/* List Grid Queue */}
        {images.length === 0 ? (
          <div className="text-center py-16 text-slate-400 border border-slate-200/50 dark:border-slate-850 rounded-3xl bg-white/30 dark:bg-slate-950/20">
            <FileImage className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800 mb-3" />
            <p className="text-xs font-semibold">Image queue is empty</p>
            <p className="text-[10px] text-slate-400 mt-1">Upload images above to build your document pages.</p>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {images.map((item, idx) => (
                <div
                  key={item.id}
                  className="relative group flex bg-white dark:bg-slate-900 border border-slate-200/70 dark:border-slate-800/40 p-4 rounded-2xl shadow-sm transition-all duration-200 hover:-translate-y-0.5 border-slate-200/80 dark:border-slate-800/40"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.processedUrl}
                    alt={item.name}
                    className="w-24 h-32 object-contain rounded-lg bg-slate-100 dark:bg-slate-950 border border-slate-200/30"
                  />
                  
                  <div className="ml-4 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-[11px] font-bold text-slate-800 dark:text-slate-150 truncate max-w-[140px] mb-1">
                        {item.name}
                      </div>
                      <div className="text-[9px] text-slate-400 font-semibold mb-3">
                        {item.width} x {item.height} px
                      </div>

                      {/* Filters selectors */}
                      <div className="flex flex-col gap-2 mt-1">
                        <div className="flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-brand-500" />
                          <select
                            value={item.filter}
                            onChange={(e) => handleFilterChange(item.id, e.target.value as "none" | "grayscale" | "photocopy" | "high-contrast")}
                            className="text-[10px] bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded px-1.5 py-0.5 font-bold focus:outline-none text-slate-700 dark:text-slate-350"
                          >
                            <option value="none">Original Color</option>
                            <option value="photocopy">B&W Photocopy</option>
                            <option value="grayscale">Grayscale Clean</option>
                            <option value="high-contrast">High Contrast</option>
                          </select>
                        </div>

                        <button
                          onClick={() => handleRotationChange(item.id)}
                          className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-450 hover:text-brand-600 dark:hover:text-brand-400 font-bold self-start mt-0.5"
                        >
                          <RotateCw className="w-3 h-3" /> Rotate 90°
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-100 dark:border-slate-850 mt-4">
                      <span className="text-[10px] text-slate-400 font-extrabold uppercase">Page {idx + 1}</span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleMove(idx, -1)}
                          disabled={idx === 0}
                          className="w-5 h-5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/55 flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <ArrowLeft className="w-2.5 h-2.5" />
                        </button>
                        <button
                          onClick={() => handleMove(idx, 1)}
                          disabled={idx === images.length - 1}
                          className="w-5 h-5 rounded bg-slate-50 dark:bg-slate-800 border border-slate-200/60 dark:border-slate-700/55 flex items-center justify-center text-slate-500 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        >
                          <ArrowRight className="w-2.5 h-2.5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handleRemove(item.id)}
                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white w-5 h-5 rounded-full flex items-center justify-center shadow shadow-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none"
                    aria-label="Remove image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right Area: PDF Settings */}
      <div className="lg:col-span-4">
        {images.length > 0 ? (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
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
                  <span className="text-brand-600 dark:text-brand-400 font-mono">{margin} pt</span>
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
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 p-6 rounded-3xl text-center text-slate-400 min-h-[250px] flex flex-col items-center justify-center space-y-3 border-slate-200/80 dark:border-slate-800/40">
            <FileText className="w-10 h-10 text-slate-300 dark:text-slate-800" />
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-200">Settings Locked</h4>
            <p className="text-[10px] text-slate-400 max-w-[200px] leading-relaxed">
              Add images to the page compiler to access PDF formatting settings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
