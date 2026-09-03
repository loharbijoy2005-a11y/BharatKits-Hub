"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  Job,
  GovtJob,
  PrivateJob,
  JobFilterState,
  INITIAL_JOBS_DATA,
} from "@/lib/jobs-data";
import { JobCard } from "./JobCard";
import { JobFilter } from "./JobFilter";
import { JobDetailModal } from "./JobDetailModal";
import {
  Briefcase,
  Landmark,
  Building2,
  Sparkles,
  TrendingUp,
  Bookmark,
  Share2,
  CheckCircle2,
  Layers,
  Search,
  RefreshCw,
  Flame,
  ShieldCheck,
} from "lucide-react";

export default function JobPortal() {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS_DATA);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"feed" | "bookmarks">("feed");

  const [filter, setFilter] = useState<JobFilterState>({
    category: "all",
    searchQuery: "",
    govBoard: "All Boards",
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

  // Fetch live jobs from API route (with fallback)
  useEffect(() => {
    async function fetchJobs() {
      try {
        setLoading(true);
        const res = await fetch("/api/jobs");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.jobs) && data.jobs.length > 0) {
            setJobs(data.jobs);
          }
        }
      } catch (e) {
        console.warn("Using bundled jobs fallback dataset:", e);
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
    const isGovt = job.category === "government";
    const shareText = `📢 ${job.title} (${
      isGovt ? (job as GovtJob).department_or_board : (job as PrivateJob).company_name
    })\nApply: ${job.apply_url}`;

    if (navigator.share) {
      navigator
        .share({
          title: job.title,
          text: shareText,
          url: job.apply_url,
        })
        .catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      showToast("Job details copied to clipboard!");
    }
  };

  const handleFilterChange = (updated: Partial<JobFilterState>) => {
    setFilter((prev) => ({ ...prev, ...updated }));
  };

  const handleResetFilter = () => {
    setFilter({
      category: "all",
      searchQuery: "",
      govBoard: "All Boards",
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

    // Search
    if (filter.searchQuery.trim()) {
      const q = filter.searchQuery.toLowerCase().trim();
      list = list.filter((j) => {
        const titleMatch = j.title.toLowerCase().includes(q);
        const descMatch = (j.description || "").toLowerCase().includes(q);
        if (j.category === "government") {
          const g = j as GovtJob;
          return (
            titleMatch ||
            descMatch ||
            g.department_or_board.toLowerCase().includes(q) ||
            g.qualification.toLowerCase().includes(q) ||
            g.state_or_location.toLowerCase().includes(q)
          );
        } else {
          const p = j as PrivateJob;
          return (
            titleMatch ||
            descMatch ||
            p.company_name.toLowerCase().includes(q) ||
            p.work_location.toLowerCase().includes(q) ||
            (p.skills_tags || []).some((s) => s.toLowerCase().includes(q))
          );
        }
      });
    }

    // Govt Board
    if (filter.govBoard !== "All Boards") {
      const key = filter.govBoard.toLowerCase().split("/")[0].trim();
      list = list.filter(
        (j) => j.category === "government" && (j as GovtJob).department_or_board.toLowerCase().includes(key)
      );
    }

    // State
    if (filter.state !== "All India") {
      list = list.filter((j) => {
        if (j.category === "government") {
          const g = j as GovtJob;
          return (
            g.state_or_location.toLowerCase().includes(filter.state.toLowerCase()) ||
            g.state_or_location.toLowerCase() === "all india"
          );
        } else {
          const p = j as PrivateJob;
          return p.work_location.toLowerCase().includes(filter.state.toLowerCase());
        }
      });
    }

    // Qualification
    if (filter.qualification !== "All Qualifications") {
      const qKey = filter.qualification.toLowerCase().split(" ")[0];
      list = list.filter(
        (j) => j.category === "government" && (j as GovtJob).qualification.toLowerCase().includes(qKey)
      );
    }

    // Experience
    if (filter.experience !== "All Experience Levels") {
      const eKey = filter.experience.toLowerCase().split(" ")[0];
      list = list.filter(
        (j) => j.category === "private" && (j as PrivateJob).experience_level.toLowerCase().includes(eKey)
      );
    }

    return list;
  }, [jobs, filter, viewMode, bookmarkedIds]);

  // Statistics
  const stats = useMemo(() => {
    const govtCount = jobs.filter((j) => j.category === "government").length;
    const privCount = jobs.filter((j) => j.category === "private").length;
    const totalVacancies = jobs
      .filter((j) => j.category === "government")
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

      {/* Hero Banner with Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
              <Flame className="w-3.5 h-3.5 text-amber-400" />
              100% Verified Aggregator • Updated Every 6 Hours
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              All India Job Portal
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Direct access to Central & State <span className="text-amber-400 font-semibold">Sarkari Bhartiyas</span>,
              admit cards, and top Indian <span className="text-indigo-400 font-semibold">Private & Tech Careers</span> with zero spam or intermediaries.
            </p>
          </div>

          {/* Quick Bookmark Tab Button */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setViewMode(viewMode === "feed" ? "bookmarks" : "feed")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold border transition-all ${
                viewMode === "bookmarks"
                  ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-500/25"
                  : "bg-slate-800/80 hover:bg-slate-800 text-slate-200 border-slate-700"
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
              Saved Jobs ({bookmarkedIds.length})
            </button>
          </div>
        </div>

        {/* Dynamic Metric Chips */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-800/80">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Total Openings
            </div>
            <div className="text-lg sm:text-2xl font-black text-white mt-0.5">
              {jobs.length}+
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 backdrop-blur-sm">
            <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" />
              Sarkari Vacancies
            </div>
            <div className="text-lg sm:text-2xl font-black text-amber-400 mt-0.5">
              {stats.totalVacancies.toLocaleString()}+
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-sm">
            <div className="text-[11px] font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1">
              <Building2 className="w-3.5 h-3.5" />
              Private Tech Roles
            </div>
            <div className="text-lg sm:text-2xl font-black text-indigo-300 mt-0.5">
              {stats.privCount}+
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 backdrop-blur-sm">
            <div className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Direct Official Link
            </div>
            <div className="text-lg sm:text-2xl font-black text-emerald-400 mt-0.5">
              100% Free
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs no-scrollbar">
        <span className="font-bold text-slate-400 shrink-0 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Popular:
        </span>
        {[
          "SSC CGL",
          "Railway RRB",
          "UPSC 2026",
          "Bank PO / Clerk",
          "10th/12th Pass",
          "React / Next.js",
          "Fresher Trainee",
          "Remote India",
        ].map((item) => (
          <button
            key={item}
            onClick={() => handleFilterChange({ searchQuery: item })}
            className="px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-amber-100 hover:text-amber-900 dark:hover:bg-slate-700 font-medium transition-colors shrink-0"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Filter Component */}
      <JobFilter
        filter={filter}
        onChange={handleFilterChange}
        totalCount={jobs.length}
        govtCount={stats.govtCount}
        privCount={stats.privCount}
        onReset={handleResetFilter}
      />

      {/* Jobs Grid Header */}
      <div className="flex items-center justify-between pt-2">
        <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
          Showing <span className="text-amber-600 dark:text-amber-400">{filteredJobs.length}</span>{" "}
          {viewMode === "bookmarks" ? "Saved Bookmarked" : "Available"} Opportunities
        </div>
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onOpenDetails={(j) => setSelectedJob(j)}
              isBookmarked={bookmarkedIds.includes(job.id)}
              onToggleBookmark={toggleBookmark}
              onShare={handleShare}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="text-center py-16 px-4 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No matching jobs found
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              We couldn't find any job opportunities matching your search or active filters. Try clearing your search or switching categories.
            </p>
          </div>
          <button
            onClick={handleResetFilter}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors shadow-md"
          >
            <RefreshCw className="w-4 h-4" />
            Reset All Filters
          </button>
        </div>
      )}

      {/* Detail Modal */}
      <JobDetailModal
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        isBookmarked={selectedJob ? bookmarkedIds.includes(selectedJob.id) : false}
        onToggleBookmark={toggleBookmark}
      />
    </div>
  );
}
