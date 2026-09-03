"use client";
import React from "react";
import {
  JobFilterState,
  GOV_BOARDS_LIST,
  INDIAN_STATES_LIST,
  QUALIFICATIONS_LIST,
  EXP_LEVELS_LIST,
} from "@/lib/jobs-data";
import {
  Search,
  X,
  Filter,
  Landmark,
  Building2,
  Layers,
  MapPin,
  GraduationCap,
  Briefcase,
  RotateCcw,
} from "lucide-react";

interface JobFilterProps {
  filter: JobFilterState;
  onChange: (updated: Partial<JobFilterState>) => void;
  totalCount: number;
  govtCount: number;
  privCount: number;
  onReset: () => void;
}

export function JobFilter({
  filter,
  onChange,
  totalCount,
  govtCount,
  privCount,
  onReset,
}: JobFilterProps) {
  const isGovt = filter.category === "government";
  const isPriv = filter.category === "private";

  return (
    <div className="space-y-4">
      {/* Top Primary Navigation Tabs */}
      <div className="flex items-center justify-center sm:justify-start gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 max-w-fit mx-auto sm:mx-0 shadow-inner">
        <button
          onClick={() => onChange({ category: "all" })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter.category === "all"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-500" />
          All Openings ({totalCount})
        </button>

        <button
          onClick={() => onChange({ category: "government" })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            isGovt
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Landmark className="w-4 h-4" />
          🏛️ Sarkari Jobs ({govtCount})
        </button>

        <button
          onClick={() => onChange({ category: "private" })}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            isPriv
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          💼 Private Jobs ({privCount})
        </button>
      </div>

      {/* Search & Dynamic Filter Controls Container */}
      <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={filter.searchQuery}
            onChange={(e) => onChange({ searchQuery: e.target.value })}
            placeholder={
              isGovt
                ? "Search Sarkari jobs (e.g., SSC CGL, UPSC, Railway, 10th Pass, Bank)..."
                : isPriv
                ? "Search Tech & Corporate jobs (e.g., React, Python, Remote, TCS, Analyst)..."
                : "Search all Indian jobs by role, department, company, skills, or state..."
            }
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onChange({ searchQuery: "" })}
              className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* Board or Experience depending on category */}
          {filter.category !== "private" ? (
            <div className="relative">
              <select
                value={filter.govBoard}
                onChange={(e) => onChange({ govBoard: e.target.value })}
                aria-label="Filter by Board or Commission"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                {GOV_BOARDS_LIST.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="relative">
              <select
                value={filter.experience}
                onChange={(e) => onChange({ experience: e.target.value })}
                aria-label="Filter by Experience Level"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {EXP_LEVELS_LIST.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Qualification for Govt / Experience for All */}
          {filter.category === "government" ? (
            <div className="relative">
              <select
                value={filter.qualification}
                onChange={(e) => onChange({ qualification: e.target.value })}
                aria-label="Filter by Qualification"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40"
              >
                {QUALIFICATIONS_LIST.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="relative">
              <select
                value={filter.experience}
                onChange={(e) => onChange({ experience: e.target.value })}
                aria-label="Filter by Experience Level"
                className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
              >
                {EXP_LEVELS_LIST.map((exp) => (
                  <option key={exp} value={exp}>
                    {exp}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* State / Location */}
          <div className="relative">
            <select
              value={filter.state}
              onChange={(e) => onChange({ state: e.target.value })}
              aria-label="Filter by State or Location"
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs font-medium text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            >
              {INDIAN_STATES_LIST.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Reset Filters */}
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-600 dark:text-slate-400 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
