"use client";
import React, { useState } from "react";
import { QrCode, Copy, Check, Trash2, Camera, ShieldCheck, Upload } from "lucide-react";

interface AadhaarData {
  uid: string;
  name: string;
  gender: string;
  dob: string;
  co: string;
  house: string;
  street: string;
  landmark: string;
  locality: string;
  vtc: string; // village/town/city
  po: string; // post office
  dist: string;
  state: string;
  pc: string; // pincode
}

export default function AadhaarQrScanner() {
  const [rawText, setRawText] = useState<string>("");
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Check if BarcodeDetector is natively supported in the browser during initialization
  const [detectionSupported] = useState<boolean>(() => {
    return typeof window !== "undefined" && "BarcodeDetector" in window;
  });

  // Calculate parsed data directly during render
  const parsedData: AadhaarData | null = (() => {
    const text = rawText;
    if (!text.trim()) {
      return null;
    }

    const getAttr = (attrName: string): string => {
      const regex = new RegExp(`${attrName}="([^"]*)"`, "i");
      const match = text.match(regex);
      return match ? match[1].trim() : "";
    };

    if (text.includes("PrintLetterBarcodeData") || text.includes("<PrintLetterBarcodeData")) {
      return {
        uid: getAttr("uid"),
        name: getAttr("name"),
        gender: getAttr("gender") === "M" ? "Male" : getAttr("gender") === "F" ? "Female" : getAttr("gender"),
        dob: getAttr("dob"),
        co: getAttr("co"),
        house: getAttr("house"),
        street: getAttr("street"),
        landmark: getAttr("lm") || getAttr("landmark"),
        locality: getAttr("loc") || getAttr("locality"),
        vtc: getAttr("vtc"),
        po: getAttr("po"),
        dist: getAttr("dist"),
        state: getAttr("state"),
        pc: getAttr("pc") || getAttr("pincode"),
      };
    } else {
      const uidMatch = text.match(/\b\d{12}\b/);
      const dobMatch = text.match(/\b\d{2}-\d{2}-\d{4}\b/);
      
      if (uidMatch || dobMatch) {
        return {
          uid: uidMatch ? uidMatch[0] : "",
          name: "",
          gender: "",
          dob: dobMatch ? dobMatch[0] : "",
          co: "",
          house: "",
          street: "",
          landmark: "",
          locality: "",
          vtc: "",
          po: "",
          dist: "",
          state: "",
          pc: "",
        };
      }
      return null;
    }
  })();

  // Decode uploaded QR code image using Native BarcodeDetector API
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));

      if (!("BarcodeDetector" in window)) {
        alert("Image QR decoding is not supported in this browser. Please paste/scan raw barcode text below instead.");
        return;
      }

      try {
        const imageEl = new Image();
        imageEl.onload = async () => {
          try {
            // @ts-expect-error BarcodeDetector is a draft spec
            const barcodeDetector = new BarcodeDetector({ formats: ["qr_code"] });
            const barcodes = await barcodeDetector.detect(imageEl);
            if (barcodes && barcodes.length > 0) {
              const detectedText = barcodes[0].rawValue;
              setRawText(detectedText);
            } else {
              alert("No QR code detected in the image. Please ensure the QR code is clear and well-lit.");
            }
          } catch (err) {
            console.error("Detection failed:", err);
            alert("QR Code detection failed. Try pasting the barcode text directly.");
          }
        };
        imageEl.src = URL.createObjectURL(file);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleCopy = (field: string, value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const handleCopyFullAddress = () => {
    if (!parsedData) return;
    const { co, house, street, landmark, locality, vtc, po, dist, state, pc } = parsedData;
    const addressString = [co, house, street, landmark, locality, vtc, po, dist, state, pc]
      .filter((val) => val.trim().length > 0)
      .join(", ");
    handleCopy("full_address", addressString);
  };

  const handleClear = () => {
    setRawText("");
    setImageFile(null);
    setImagePreview(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Scanner Input Panel */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
            <QrCode className="w-5 h-5 text-brand-500" /> Aadhaar Scanner Input
          </h3>

          {/* QR image upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide block">
              Scan Aadhaar QR Image
            </label>
            <div
              onClick={() => document.getElementById("qr-file-input")?.click()}
              className="border-2 border-dashed border-slate-200 hover:border-brand-500 dark:border-slate-800 dark:hover:border-brand-400 rounded-2xl p-6 text-center transition-all bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center cursor-pointer group"
            >
              <input
                id="qr-file-input"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
              {imagePreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imagePreview}
                  alt="QR Preview"
                  className="w-16 h-16 object-contain rounded-lg border border-slate-200"
                />
              ) : (
                <Upload className="w-6 h-6 text-slate-400 group-hover:scale-105 transition-transform mb-2" />
              )}
              <span className="text-[10px] font-bold text-slate-500 mt-1.5">
                {imageFile ? imageFile.name : "Select Aadhaar QR Code Photo"}
              </span>
              <span className="text-[8px] text-slate-400 mt-0.5 font-semibold">
                {detectionSupported ? "Natively Supported in Browser" : "Manual Paste Fallback Only"}
              </span>
            </div>
          </div>

          {/* Raw Text Box */}
          <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-450 uppercase tracking-wide">
              <span>Raw Barcode Text / Paste Input</span>
              {rawText && (
                <button
                  onClick={handleClear}
                  className="text-red-500 hover:text-red-700 text-[10px] lowercase font-extrabold flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> clear
                </button>
              )}
            </div>
            <textarea
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Click here and scan using your USB hardware scanner, or paste the raw XML string from the barcode decoder..."
              rows={5}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-mono text-slate-800 dark:text-slate-200"
            />
          </div>

          <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-2xl flex gap-2.5 items-start">
            <Camera className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <div className="text-[9px] text-slate-400 font-semibold leading-relaxed">
              <span className="font-extrabold text-slate-650 dark:text-slate-350 block mb-0.5">USB Scanner Setup:</span>
              Plug in your hardware QR scanner. Click focus on the textarea box above, then point and shoot at the Aadhaar QR. The scanner will instantly type and parse all fields!
            </div>
          </div>
        </div>
      </div>

      {/* Parser Results Grid */}
      <div className="lg:col-span-7 space-y-6">
        {parsedData ? (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-6 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
            <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" /> Parsed Demographic Records
                </h4>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Click the copy badge next to any field to copy its value instantly.
                </p>
              </div>
              <button
                onClick={handleCopyFullAddress}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 dark:bg-brand-950/40 border border-brand-100/40 dark:border-brand-950/20 px-3.5 py-1.5 rounded-xl flex items-center gap-1"
              >
                {copiedField === "full_address" ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" /> Copied Address!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Full Address
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {[
                { label: "Aadhaar Card Number (UID)", value: parsedData.uid, field: "uid" },
                { label: "Full Name", value: parsedData.name, field: "name" },
                { label: "Gender", value: parsedData.gender, field: "gender" },
                { label: "Date of Birth (DOB)", value: parsedData.dob, field: "dob" },
                { label: "Care Of (C/O)", value: parsedData.co, field: "co" },
                { label: "House / Flat No.", value: parsedData.house, field: "house" },
                { label: "Street", value: parsedData.street, field: "street" },
                { label: "Landmark", value: parsedData.landmark, field: "landmark" },
                { label: "Locality", value: parsedData.locality, field: "locality" },
                { label: "Village / Town / City (VTC)", value: parsedData.vtc, field: "vtc" },
                { label: "Post Office", value: parsedData.po, field: "po" },
                { label: "District", value: parsedData.dist, field: "dist" },
                { label: "State", value: parsedData.state, field: "state" },
                { label: "Pincode", value: parsedData.pc, field: "pc" },
              ].map((item) => (
                <div
                  key={item.field}
                  className="bg-slate-50 dark:bg-slate-950/50 border border-slate-100 dark:border-slate-850 p-3 rounded-2xl flex justify-between items-center group/field"
                >
                  <div className="space-y-0.5">
                    <span className="text-[9px] uppercase font-black tracking-wider text-slate-400">
                      {item.label}
                    </span>
                    <span className="font-extrabold block text-slate-800 dark:text-slate-200">
                      {item.value || "—"}
                    </span>
                  </div>
                  {item.value && (
                    <button
                      onClick={() => handleCopy(item.field, item.value)}
                      className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 opacity-30 group-hover/field:opacity-100 hover:border-brand-500 hover:text-brand-500 transition-all shadow-sm"
                      title={`Copy ${item.label}`}
                    >
                      {copiedField === item.field ? (
                        <Check className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5 text-slate-450" />
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-850 p-12 rounded-3xl text-center text-slate-400 min-h-[350px] flex flex-col items-center justify-center space-y-4 border-slate-200/80 dark:border-slate-800/40">
            <QrCode className="w-12 h-12 text-slate-250 dark:text-slate-800 animate-pulse" />
            <h4 className="text-sm font-extrabold text-slate-850 dark:text-slate-205">Demographic Records Locked</h4>
            <p className="text-xs text-slate-400 max-w-[280px] leading-relaxed mx-auto font-semibold">
              Scan an Aadhaar card QR code or paste the raw barcode XML string to decode citizen details.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
