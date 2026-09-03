"use client";
import React, { useState } from "react";
import {
  Search,
  Sparkles,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Building2,
  Users,
  GraduationCap,
  ExternalLink,
  Globe,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export interface RealtimeJobData {
  jobTitle: string;
  organization: string;
  totalVacancies: string;
  lastDate: string | null;
  daysLeft: number | null;
  eligibility: string;
  applyUrl: string;
  category: string;
  sources: { title: string; url: string }[];
}

export function AiJobSearch() {
  const [query, setQuery] = useState<string>("");
  const [category, setCategory] = useState<string>("government");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [resultData, setResultData] = useState<RealtimeJobData | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setError("Please enter a job title or recruitment exam name.");
      return;
    }

    setLoading(true);
    setError(null);
    setResultData(null);

    try {
      const response = await fetch("/api/search-job", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          category,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to fetch live job details from Google.");
      }

      setResultData(result.data);
    } catch (err: any) {
      setError(err?.message || "An unexpected error occurred during real-time AI search.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-6 bg-slate-900/90 backdrop-blur-xl border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/40">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 rounded-2xl bg-gradient-to-tr from-amber-500 via-orange-500 to-red-500 text-slate-950 font-black shadow-lg shadow-amber-500/30">
          <Globe className="w-6 h-6 animate-spin-slow" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            Real-Time Gemini AI Job Search &amp; Date Finder
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono">
              Live Google Search Grounding
            </span>
          </h2>
          <p className="text-sm text-slate-400">
            Type any Sarkari or Private job title to search official portals and extract real-time dates directly.
          </p>
        </div>
      </div>

      {/* Search Input Form */}
      <form onSubmit={handleSearch} className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
          <input
            type="text"
            required
            placeholder="Type e.g. 'SSC CGL 2026', 'UPSC IAS', 'India Post GDS', 'RRB NTPC', 'DRDO CEPTAM'..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 rounded-xl text-slate-100 placeholder-slate-600 text-sm transition-all outline-none"
          />
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg text-slate-200 text-xs outline-none"
            >
              <option value="government">Sarkari / Government</option>
              <option value="teaching">Teaching / TET</option>
              <option value="private">Private / Tech</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 disabled:opacity-50 text-slate-950 font-extrabold text-sm shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Searching Live Google Portals...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Find Real-Time Dates &amp; Details</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="mt-6 p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-300 flex items-start gap-3 text-sm animate-in fade-in duration-300">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold block text-rose-200">Search Error</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Real-Time Live Extracted Result Card */}
      {resultData && (
        <div className="mt-8 p-6 rounded-2xl bg-slate-950 border border-amber-500/40 text-slate-100 shadow-2xl animate-in zoom-in-95 duration-300">
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-black uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Real-Time Live Extracted Details (Google Grounded)</span>
            </div>
            <span className="text-xs text-slate-400">Verified Live</span>
          </div>

          <h3 className="text-xl font-bold text-white mb-2">{resultData.jobTitle}</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Building2 className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Organization / Board</span>
                <span className="text-sm font-semibold text-slate-200">
                  {resultData.organization}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Users className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Vacancies</span>
                <span className="text-sm font-semibold text-slate-200">
                  {resultData.totalVacancies}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <Calendar className="w-5 h-5 text-rose-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Closing Date</span>
                <span className="text-sm font-semibold text-slate-200">
                  {resultData.lastDate ? resultData.lastDate : "Open / Unspecified"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800">
              <GraduationCap className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <span className="text-xs text-slate-400 block">Eligibility</span>
                <span className="text-sm font-semibold text-slate-200">
                  {resultData.eligibility}
                </span>
              </div>
            </div>
          </div>

          {/* Status Badge */}
          {resultData.daysLeft !== null && (
            <div className="my-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
              ⏳ {resultData.daysLeft > 0 ? `${resultData.daysLeft} Days Remaining to Apply` : "Application Period Ended"}
            </div>
          )}

          {/* Citation / Source Links */}
          {resultData.sources && resultData.sources.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-900">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Official Google Search Citation Sources:
              </span>
              <div className="flex flex-wrap gap-2">
                {resultData.sources.map((src, idx) => (
                  <a
                    key={idx}
                    href={src.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-xs text-amber-300 hover:text-amber-200 hover:border-amber-500/40 transition-all"
                  >
                    <span>{src.title}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Apply URL */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <a
              href={resultData.applyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm transition-all inline-flex items-center gap-2"
            >
              <span>Apply on Official Portal</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
