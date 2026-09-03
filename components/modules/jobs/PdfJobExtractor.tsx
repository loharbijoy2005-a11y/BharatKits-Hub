"use client";
import React, { useState } from "react";
import {
  FileText,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  GraduationCap,
  ExternalLink,
  ArrowRight,
  RefreshCw,
} from "lucide-react";

export interface ExtractedJobData {
  jobTitle: string;
  organization: string;
  totalVacancies: string;
  lastDate: string | null;
  daysLeft: number | null;
  eligibility: string;
  applyUrl: string;
  category: string;
}

export function PdfJobExtractor({
  onJobExtracted,
}: {
  onJobExtracted?: (job: ExtractedJobData) => void;
}) {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [applyUrl, setApplyUrl] = useState<string>("");
  const [category, setCategory] = useState<string>("government");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedData, setExtractedData] = useState<ExtractedJobData | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfUrl.trim()) {
      setError("Please enter a valid PDF URL.");
      return;
    }

    setLoading(true);
    setError(null);
    setExtractedData(null);

    try {
      const response = await fetch("/api/parse-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pdfUrl: pdfUrl.trim(),
          applyUrl: applyUrl.trim() || undefined,
          category,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to extract job details from PDF.");
      }

      setExtractedData(result.data);
      if (onJobExtracted) {
        onJobExtracted(result.data);
      }
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred while parsing the PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setPdfUrl("");
    setApplyUrl("");
    setExtractedData(null);
    setError(null);
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-8 bg-slate-900/80 backdrop-blur-xl border border-indigo-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-indigo-950/50">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            AI PDF Job Notification Extractor
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 font-mono">
              Gemini 2.5 Flash
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            Paste any official PDF URL to parse authentic recruitment details directly with AI.
          </p>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleExtract} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Official Notification PDF URL <span className="text-rose-400">*</span>
          </label>
          <div className="relative">
            <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="url"
              required
              placeholder="https://example.gov.in/notifications/recruitment_notice.pdf"
              value={pdfUrl}
              onChange={(e) => setPdfUrl(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-all outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Apply URL (Optional)
            </label>
            <input
              type="url"
              placeholder="https://example.gov.in/apply"
              value={applyUrl}
              onChange={(e) => setApplyUrl(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-all outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 rounded-xl text-slate-100 text-sm transition-all outline-none"
            >
              <option value="government">Government Recruitment</option>
              <option value="teaching">Teaching & Education</option>
              <option value="private">Private / Corporate</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !pdfUrl.trim()}
          className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 disabled:opacity-50 text-white font-semibold text-sm shadow-xl shadow-indigo-500/20 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Parsing PDF with Gemini 2.5 Flash...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Extract Authentic Job Details</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </>
          )}
        </button>
      </form>

      {/* Error Output (Zero Mock Fallback) */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-start gap-3 text-sm animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-semibold block text-rose-200">Extraction Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Extracted Authentic Real-Time Job Card */}
      {extractedData && (
        <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              <CheckCircle2 className="w-4 h-4" />
              <span>Authentic Extracted Details</span>
            </div>

            <button
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Parse Another PDF</span>
            </button>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{extractedData.jobTitle}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Organization</span>
                <span className="text-sm font-semibold text-slate-200">
                  {extractedData.organization}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Users className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Total Vacancies</span>
                <span className="text-sm font-semibold text-slate-200">
                  {extractedData.totalVacancies}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Calendar className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Closing Date</span>
                <span className="text-sm font-semibold text-slate-200">
                  {extractedData.lastDate ? extractedData.lastDate : "Open / Unspecified"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Eligibility</span>
                <span className="text-sm font-semibold text-slate-200">
                  {extractedData.eligibility}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {extractedData.daysLeft !== null && (
            <div className="my-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              ⏳ {extractedData.daysLeft > 0 ? `${extractedData.daysLeft} Days Remaining to Apply` : "Application Period Ended"}
            </div>
          )}

          {/* Action links */}
          <div className="mt-6 flex flex-wrap items-center gap-3 pt-4 border-t border-slate-800">
            <a
              href={extractedData.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm transition-all inline-flex items-center gap-2"
            >
              <span>Apply Now</span>
              <ExternalLink className="w-4 h-4" />
            </a>

            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm transition-all inline-flex items-center gap-2"
            >
              <span>View Original PDF</span>
              <FileText className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
