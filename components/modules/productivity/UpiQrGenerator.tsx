"use client";
import React, { useState, useRef } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { QRCodeCanvas } from "qrcode.react";
import confetti from "canvas-confetti";
import { QrCode, Download, RefreshCw, IndianRupee, ShieldCheck, Info } from "lucide-react";

export default function UpiQrGenerator() {
  const [upiId, setUpiId] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [note, setNote] = useState<string>("");

  const canvasRef = useRef<HTMLDivElement>(null);

  // Generate UPI payment URL
  // upi://pay?pa=recipient@vpa&pn=RecipientName&am=Amount&cu=INR&tn=Note
  const getUpiUrl = () => {
    if (!upiId) return "";
    const cleanId = upiId.trim();
    const cleanName = encodeURIComponent(name.trim() || "Payee");
    const cleanAmount = amount.trim();
    const cleanNote = encodeURIComponent(note.trim() || "BharatKits Pay");

    let url = `upi://pay?pa=${cleanId}&pn=${cleanName}`;
    if (cleanAmount) url += `&am=${cleanAmount}`;
    url += `&cu=INR`;
    if (cleanNote) url += `&tn=${cleanNote}`;

    return url;
  };

  const upiUrl = getUpiUrl();

  const handleDownload = () => {
    const canvas = canvasRef.current?.querySelector("canvas");
    if (!canvas) return;

    const url = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = url;
    link.download = `upi_payment_qr_${upiId.split("@")[0]}_${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Confetti
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.8 },
      colors: ["#10b981", "#3b82f6", "#7c3aed"],
    });
  };

  const handleReset = () => {
    setUpiId("");
    setName("");
    setAmount("");
    setNote("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameters Form */}
      <div className="lg:col-span-7 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            UPI Configuration
          </h3>

          <div className="space-y-4">
            {/* UPI ID VPA */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                UPI ID (VPA) *
              </label>
              <input
                type="text"
                placeholder="e.g. name@okhdfcbank or merchant@ybl"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
              />
            </div>

            {/* Recipient Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                Recipient / Payee Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ramesh Kumar"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
              />
            </div>

            {/* Amount */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  Amount (INR - Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    ₹
                  </span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                  />
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  Payment Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Shop Bill, Rent"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-slate-100 dark:border-slate-850">
            <Button variant="outline" className="w-1/3" onClick={handleReset} disabled={!upiId}>
              Clear
            </Button>
            <Button className="w-2/3" onClick={handleDownload} disabled={!upiId}>
              <Download className="w-4 h-4 mr-1.5" /> Download QR Code
            </Button>
          </div>
        </div>

        {/* Security / Info Details */}
        <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-3xl border border-slate-150 dark:border-slate-900/50 flex gap-2.5 items-start">
          <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-[11px] font-black uppercase text-slate-800 dark:text-slate-200">
              100% Secure & Interoperable
            </h4>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed">
              BharatKits does not route, track, or save transaction histories. Scans immediately open BHIM, GPay, PhonePe, Paytm, or any banking UPI app securely.
            </p>
          </div>
        </div>
      </div>

      {/* Render Preview Side */}
      <div className="lg:col-span-5 flex flex-col items-center">
        <div className="utility-card border rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center min-h-[350px] w-full max-w-sm">
          {!upiId ? (
            <div className="text-slate-400 dark:text-slate-600 text-center text-xs max-w-[200px] space-y-2">
              <QrCode className="w-16 h-16 mx-auto text-slate-200 dark:text-slate-800 animate-pulse" />
              <p className="font-bold text-slate-700 dark:text-slate-300">Awaiting Config</p>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Input recipient VPA details to render interoperable scan payment codes.
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center space-y-6">
              {/* Visual payment slip styling */}
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-widest block">
                  Scan and Pay using UPI
                </span>
                {name && (
                  <h4 className="text-sm font-black text-slate-850 dark:text-white mt-1">
                    To: {name}
                  </h4>
                )}
                {amount && (
                  <div className="text-2xl font-black text-slate-900 dark:text-white mt-2 flex items-center justify-center gap-0.5">
                    <IndianRupee className="w-5 h-5 shrink-0 text-brand-600" />
                    {amount}
                  </div>
                )}
              </div>

              {/* QR Code Canvas */}
              <div ref={canvasRef} className="p-4 bg-white rounded-2xl shadow-inner border border-slate-100 flex items-center justify-center">
                <QRCodeCanvas
                  value={upiUrl}
                  size={192}
                  fgColor="#0f172a" // Slate-900
                  bgColor="#ffffff"
                  level="H"
                />
              </div>

              <div className="flex gap-2.5 bg-slate-50 dark:bg-slate-950 p-2.5 rounded-xl border border-slate-100 dark:border-slate-900 items-start max-w-xs text-left">
                <Info className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
                <p className="text-[9px] text-slate-500 leading-relaxed font-semibold">
                  Scan with BHIM, GPay, PhonePe, Paytm, or any banking app.
                </p>
              </div>

              <Button size="sm" onClick={handleDownload} className="w-full">
                Download Code Image
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
