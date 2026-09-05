"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Job,
  GovtJob,
  PrivateJob,
  JobFilterState,
  INITIAL_JOBS_DATA,
  getJobDeadlineInfo,
} from "@/lib/jobs-data";
import { JobCard } from "./JobCard";
import { JobFilter } from "./JobFilter";
import { JobDetailModal } from "./JobDetailModal";
import { PdfJobExtractor } from "./PdfJobExtractor";
import { AiJobSearch } from "./AiJobSearch";
import { GovtPortalsHub } from "./GovtPortalsHub";
import {
  Briefcase,
  Landmark,
  Building2,
  Bookmark,
  Share2,
  CheckCircle2,
  Layers,
  Search,
  RefreshCw,
  Flame,
  Globe,
} from "lucide-react";

export default function JobPortal() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"feed" | "bookmarks" | "portals">("feed");

  const [filter, setFilter] = useState<JobFilterState>({
    category: "all",
    searchQuery: "",
    govBoard: "All Boards",
    sector: "All Sectors",
    state: "All India",
    qualification: "All Qualifications",
    experience: "All Experience Levels",
    employmentType: "All",
    onlyActive: true,
  });

  // Load bookmarks from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bharatkits_saved_jobs");
      if (saved) {
        setBookmarkedIds(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  // Fetch live jobs from API route
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.jobs)) {
            setJobs(data.jobs);
          }
        }
      } catch (e) {
        console.error("Error fetching jobs from API:", e);
        setJobs([]);
      } finally {
        setLoading(false);
      }
    }
    fetchJobs();
  }, []);

  const toggleBookmark = (job: Job) => {
    let next: string[];
    if (bookmarkedIds.includes(job.id)) {
      next = bookmarkedIds.filter((id) => id !== job.id);
      showToast("Removed from saved bookmarks");
    } else {
      next = [...bookmarkedIds, job.id];
      showToast("Saved to your bookmarked jobs ⭐");
    }
    setBookmarkedIds(next);
    try {
      localStorage.setItem("bharatkits_saved_jobs", JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleShare = (job: Job) => {
    const text = `🔥 New Job Opening: ${job.title}\n📍 State: ${job.state || "All India"}\n📌 Sector: ${job.sector}\n🔗 Apply & View Details: ${window.location.origin}/jobs`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  const handleFilterChange = (updated: Partial<JobFilterState>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilters = () => {
    setFilter({
      category: "all",
      searchQuery: "",
      govBoard: "All Boards",
      sector: "All Sectors",
      state: "All India",
      qualification: "All Qualifications",
      experience: "All Experience Levels",
      employmentType: "All",
      onlyActive: true,
    });
  };

  // Filtered dataset
  const filteredJobs = useMemo(() => {
    let list = jobs;

    if (viewMode === "bookmarks") {
      list = list.filter((j) => bookmarkedIds.includes(j.id));
    }

    // Category
    if (filter.category !== "all") {
      list = list.filter((j) => j.category === filter.category);
    }

    // Sector
    if (filter.sector && filter.sector !== "All Sectors") {
      list = list.filter((j) => (j.sector || "").toLowerCase() === filter.sector.toLowerCase());
    }

    // Search
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      list = list.filter((j) => {
        const titleMatch = (j.title || "").toLowerCase().includes(q);
        const descMatch = (j.description || "").toLowerCase().includes(q);
        const stateMatch = (j.state || "").toLowerCase().includes(q);
        const secMatch = (j.sector || "").toLowerCase().includes(q);

        if (j.category === "government" || j.category === "teaching") {
          const g = j as GovtJob;
          return (
            titleMatch ||
            descMatch ||
            stateMatch ||
            secMatch ||
            (g.department_or_board || "").toLowerCase().includes(q) ||
            (g.qualification || "").toLowerCase().includes(q)
          );
        } else {
          const p = j as PrivateJob;
          return (
            titleMatch ||
            descMatch ||
            stateMatch ||
            secMatch ||
            (p.company_name || "").toLowerCase().includes(q) ||
            (p.work_location || "").toLowerCase().includes(q) ||
            (p.skills_tags || []).some((s) => s.toLowerCase().includes(q))
          );
        }
      });
    }

    // Board
    if (filter.govBoard !== "All Boards") {
      const key = filter.govBoard.toLowerCase().split("/")[0].trim();
      list = list.filter((j) => {
        if (j.category === "government" || j.category === "teaching") {
          return ((j as GovtJob).department_or_board || "").toLowerCase().includes(key);
        }
        return false;
      });
    }

    // State
    if (filter.state !== "All India") {
      list = list.filter((j) => {
        const jobState = (j.state || "").toLowerCase();
        const targetState = filter.state.toLowerCase();
        return jobState.includes(targetState) || jobState === "all india";
      });
    }

    // Qualification
    if (filter.qualification !== "All Qualifications") {
      const qKey = filter.qualification.toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g, "");
      list = list.filter((j) => {
        if (j.category === "government" || j.category === "teaching") {
          return ((j as GovtJob).qualification || "").toLowerCase().includes(qKey);
        }
        return true;
      });
    }

    // Experience
    if (filter.experience !== "All Experience Levels") {
      const eKey = filter.experience.toLowerCase().split(" ")[0];
      list = list.filter((j) => {
        if (j.category === "private") {
          return ((j as PrivateJob).experience_level || "").toLowerCase().includes(eKey);
        }
        return true;
      });
    }

    // Sort: Active jobs first (closest deadline to furthest/open), closed jobs sink to bottom
    const sorted = [...list].sort((a, b) => {
      const aInfo = getJobDeadlineInfo(a);
      const bInfo = getJobDeadlineInfo(b);

      const aClosed = aInfo.isClosed;
      const bClosed = bInfo.isClosed;

      // Closed jobs automatically sink to the bottom
      if (!aClosed && bClosed) return -1;
      if (aClosed && !bClosed) return 1;

      // Both active: sort by deadline ascending (soonest deadline first)
      if (!aClosed && !bClosed) {
        if (aInfo.parsedDateISO && bInfo.parsedDateISO) {
          return aInfo.parsedDateISO.localeCompare(bInfo.parsedDateISO);
        }
        if (aInfo.parsedDateISO && !bInfo.parsedDateISO) return -1;
        if (!aInfo.parsedDateISO && bInfo.parsedDateISO) return 1;
        return (b.posted_date || "").localeCompare(a.posted_date || "");
      }

      // Both closed: sort by most recently expired first
      if (aInfo.parsedDateISO && bInfo.parsedDateISO) {
        return bInfo.parsedDateISO.localeCompare(aInfo.parsedDateISO);
      }
      return (b.posted_date || "").localeCompare(a.posted_date || "");
    });

    return sorted;
  }, [jobs, filter, viewMode, bookmarkedIds]);

  // Statistics
  const stats = useMemo(() => {
    const govtCount = jobs.filter((j) => j.category === "government" || j.category === "teaching").length;
    const privCount = jobs.filter((j) => j.category === "private").length;
    const totalVacancies = jobs
      .filter((j) => j.category === "government" || j.category === "teaching")
      .reduce((acc, curr) => acc + ((curr as GovtJob).vacancies_count || 0), 0);
    return { govtCount, privCount, totalVacancies };
  }, [jobs]);

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 animate-in fade-in duration-300">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-2xl text-xs sm:text-sm font-bold animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          {toastMessage}
        </div>
      )}

      {/* COMING SOON & UNDER ENHANCEMENT NOTICE BANNER */}
      <div className="p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-red-500/20 border-2 border-amber-500/40 backdrop-blur-xl shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/30 flex items-center justify-center shrink-0 border border-amber-400/40">
            <span className="text-xl">🚧</span>
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-400 uppercase tracking-widest">
              <span>● ALL INDIA JOBS PORTAL</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-black text-[11px] shadow-sm">COMING SOON / UNDER UPGRADATION</span>
            </div>
            <p className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5">
              All India Job Feed & Date Synchronization System is currently undergoing major live scraping & date alignment upgrades.
            </p>
          </div>
        </div>
        <div className="shrink-0 text-center sm:text-right">
          <span className="inline-block px-4 py-2 rounded-2xl bg-amber-500 font-extrabold text-xs text-slate-950 shadow-lg tracking-wide uppercase">
            ⚡ Upgrading Real-Time Dates
          </span>
        </div>
      </div>

      {/* Hero Banner with Live Metric Counters */}
      <div className="relative overflow-hidden rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white border border-indigo-500/20 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              100% Centralized All India Job Aggregator
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
              All India Centralized Job &amp; Career Portal
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Real-time aggregation across Teaching, Postal &amp; Panchayat, Railway, Defence &amp; Police, Central SSC/UPSC, State PSCs, Banking, PSU Engineering, Healthcare, and Corporate ATS feeds.
            </p>
          </div>

          {/* Quick Counter Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 shrink-0">
            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg sm:text-2xl font-black text-amber-400">
                {stats.govtCount}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Sarkari &amp; Public</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg sm:text-2xl font-black text-cyan-400">
                {stats.privCount}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Private Tech</div>
            </div>

            <div className="p-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-center">
              <div className="text-lg sm:text-2xl font-black text-emerald-400">
                {stats.totalVacancies.toLocaleString()}+
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-300">Active Posts</div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-Time Gemini AI Google Search Grounding Component */}
      <AiJobSearch />

      {/* Gemini PDF Job Extractor Component */}
      <PdfJobExtractor />

      {/* Feed vs Direct Portals Directory vs Bookmarks Toggle Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setViewMode("feed")}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              viewMode === "feed"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-md"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Layers className="w-4 h-4" />
            Live Vacancies Feed
          </button>

          <button
            onClick={() => setViewMode("portals")}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              viewMode === "portals"
                ? "bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg shadow-amber-500/25 scale-[1.02]"
                : "bg-amber-100/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 border border-amber-300/60 dark:border-amber-800/60"
            }`}
          >
            <Globe className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            🏛️ Direct Official Websites Hub (30+)
          </button>

          <button
            onClick={() => setViewMode("bookmarks")}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              viewMode === "bookmarks"
                ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Bookmarks ({bookmarkedIds.length})
          </button>
        </div>

        <div className="text-xs text-slate-500 hidden sm:block">
          {viewMode === "portals" ? (
            <span className="font-bold text-amber-600 dark:text-amber-400">Direct Official Recruitment Portals</span>
          ) : (
            <>Showing <span className="font-bold text-slate-900 dark:text-slate-100">{filteredJobs.length}</span> Active Vacancies</>
          )}
        </div>
      </div>

      {/* Render Direct Portals Hub or Job Listings Feed */}
      {viewMode === "portals" ? (
        <GovtPortalsHub />
      ) : (
        <>
          {/* Interactive Sector Pills & Multi-Parameter Filters */}
          <JobFilter
            filter={filter}
            onChange={handleFilterChange}
            totalCount={jobs.length}
            govtCount={stats.govtCount}
            privCount={stats.privCount}
            onReset={handleResetFilters}
          />

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          )}

          {/* Jobs Grid */}
          {!loading && filteredJobs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  onOpenDetails={setSelectedJob}
                  isBookmarked={bookmarkedIds.includes(job.id)}
                  onToggleBookmark={toggleBookmark}
                  onShare={handleShare}
                />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredJobs.length === 0 && (
            <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Search className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  No matching job notifications found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Try clicking &quot;All Sectors&quot; or check our Official Websites Hub to apply directly.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3">
                <button
                  onClick={() => setViewMode("portals")}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-md transition-colors"
                >
                  <Globe className="w-3.5 h-3.5" />
                  Open Official Websites Directory
                </button>
                <button
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-bold transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Deep Detail & Application Modal */}
      {selectedJob && (
        <JobDetailModal
          job={selectedJob}
          onClose={() => setSelectedJob(null)}
          isBookmarked={bookmarkedIds.includes(selectedJob.id)}
          onToggleBookmark={toggleBookmark}
        />
      )}
    </div>
  );
}
