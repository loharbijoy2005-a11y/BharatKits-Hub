"use client";
import React, { useState } from "react";
import { X, ShieldCheck, Scale, FileText, Info } from "lucide-react";

interface LegalDisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "disclaimer" | "privacy" | "terms";
}

export function LegalDisclaimerModal({
  isOpen,
  onClose,
  defaultTab = "disclaimer",
}: LegalDisclaimerModalProps) {
  const [activeTab, setActiveTab] = useState<"disclaimer" | "privacy" | "terms">(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Legal & Compliance Information
              </h3>
              <p className="text-xs text-slate-500">
                Informational Aggregator Guidelines & Privacy Statement
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 px-6 pt-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
          <button
            onClick={() => setActiveTab("disclaimer")}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "disclaimer"
                ? "border-amber-500 text-amber-600 dark:text-amber-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            Legal Disclaimer
          </button>
          <button
            onClick={() => setActiveTab("privacy")}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "privacy"
                ? "border-indigo-500 text-indigo-600 dark:text-indigo-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Privacy Policy
          </button>
          <button
            onClick={() => setActiveTab("terms")}
            className={`pb-3 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 ${
              activeTab === "terms"
                ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                : "border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Terms of Information
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {activeTab === "disclaimer" && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/70 dark:border-amber-900/50 text-amber-900 dark:text-amber-200 text-xs">
                <strong>Important Notice:</strong> This portal operates purely as a public service and automated informational search aggregator. It does not provide government recruitment services or employment guarantees.
              </div>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                1. No Affiliation with Government Agencies
              </h4>
              <p>
                BharatKits All India Job Portal is an independent platform and is <strong>not affiliated, associated, authorized, endorsed by, or in any way officially connected with</strong> any Government of India agency, state recruitment board (such as SSC, UPSC, RRB, IBPS, State PSCs), or private corporate entities.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Accuracy & Verification Mandatory
              </h4>
              <p>
                While automated engines scrape published public notices directly from authoritative government gazettes and public applicant tracking systems, job seekers must always verify the official PDF notification on the respective department&apos;s official website before submitting applications or paying examination fees.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                3. Trademarks & Copyrights
              </h4>
              <p>
                All company logos, examination titles, and government recruitment board names referenced on this portal are trademarks or registered trademarks of their respective owners. Use of them does not imply any affiliation or endorsement.
              </p>
            </div>
          )}

          {activeTab === "privacy" && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                1. Zero Data Collection on Job Seekers
              </h4>
              <p>
                We believe in complete privacy. Our portal does not require user registration or personal phone number collection to search or view job notifications. When you click &quot;Apply Online&quot;, you are redirected directly to the official recruitment authority&apos;s secure portal.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Saved Bookmarks
              </h4>
              <p>
                Any job bookmarks you save are stored purely on your local browser device memory and are never uploaded or tracked on our servers.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                3. Takedown Requests Data
              </h4>
              <p>
                Information submitted via the Takedown Request dialog is used exclusively for compliance communication and listing moderation.
              </p>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="space-y-4">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                1. Permitted Use
              </h4>
              <p>
                This service is provided free of charge for Indian citizens, students, and job seekers to discover career opportunities across Central, State, and Private sectors.
              </p>

              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                2. Automated Aggregation Notice
              </h4>
              <p>
                Data is updated at scheduled intervals via automated pipelines. Due to variations in third-party server availability, candidates are advised to apply well before specified deadlines.
              </p>
            </div>
          )}
        </div>

        {/* Footer Close */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
}
