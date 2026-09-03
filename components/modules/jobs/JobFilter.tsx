"use client";
import React from "react";
import {
  JobFilterState,
  GOV_BOARDS_LIST,
  ALL_SECTORS_LIST,
  INDIAN_STATES_LIST,
  QUALIFICATIONS_LIST,
  EXP_LEVELS_LIST,
} from "@/lib/jobs-data";
import {
  Search,
  X,
  Landmark,
  Building2,
  Layers,
  MapPin,
  GraduationCap,
  Briefcase,
  RotateCcw,
  BookOpen,
} from "lucide-react";

interface JobFilterProps {
  filter: JobFilterState;
  onChange: (updated: Partial<JobFilterState>) => void;
  totalCount: number;
  govtCount: number;
  teachingCount: number;
  privCount: number;
  onReset: () => void;
}

export function JobFilter({
  filter,
  onChange,
  totalCount,
  govtCount,
  teachingCount,
  privCount,
  onReset,
}: JobFilterProps) {
  const isGovt = filter.category === "government";
  const isTeaching = filter.category === "teaching";
  const isPriv = filter.category === "private";

  return (
    <div className="space-y-4">
      {/* Segmented Main Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 max-w-fit mx-auto sm:mx-0 shadow-inner">
        <button
          onClick={() => onChange({ category: "all" })}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            filter.category === "all"
              ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4 text-emerald-500" />
          All Jobs ({totalCount})
        </button>

        <button
          onClick={() => onChange({ category: "government" })}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            isGovt
              ? "bg-amber-500 text-white shadow-md shadow-amber-500/25"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Landmark className="w-4 h-4" />
          🏛️ Sarkari &amp; State ({govtCount})
        </button>

        <button
          onClick={() => onChange({ category: "teaching" })}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            isTeaching
              ? "bg-rose-500 text-white shadow-md shadow-rose-500/25"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          🎓 Teaching &amp; TET ({teachingCount})
        </button>

        <button
          onClick={() => onChange({ category: "private" })}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            isPriv
              ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/25"
              : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
          }`}
        >
          <Building2 className="w-4 h-4" />
          💼 Private &amp; Tech ({privCount})
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
              isTeaching
                ? "Search Teaching & TET jobs (e.g., CTET, KVS, BPSC TRE, B.Ed, PRT, TGT)..."
                : isGovt
                ? "Search Sarkari & State jobs (e.g., SSC, UPSC, Railway, WBPSC, UP Police, 10th Pass)..."
                : isPriv
                ? "Search Tech & Corporate jobs (e.g., React, Python, Remote, TCS, Analyst)..."
                : "Search all Indian jobs by title, department, company, state, or qualification..."
            }
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          {filter.searchQuery && (
            <button
              onClick={() => onChange({ searchQuery: "" })}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Dropdown Filters Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
          {/* State / Location Filter */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-rose-500" /> State / Region
            </label>
            <select
              value={filter.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {INDIAN_STATES_LIST.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          {/* Sector / Board Filter */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-amber-500" /> Sector / Category
            </label>
            <select
              value={filter.sector || "All Sectors"}
              onChange={(e) => onChange({ sector: e.target.value })}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {ALL_SECTORS_LIST.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Qualification Filter */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-emerald-500" /> Qualification
            </label>
            <select
              value={filter.qualification}
              onChange={(e) => onChange({ qualification: e.target.value })}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {QUALIFICATIONS_LIST.map((qual) => (
                <option key={qual} value={qual}>
                  {qual}
                </option>
              ))}
            </select>
          </div>

          {/* Experience / Board Filter */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Landmark className="w-3 h-3 text-indigo-500" /> Authority / Board
            </label>
            <select
              value={filter.govBoard}
              onChange={(e) => onChange({ govBoard: e.target.value })}
              className="w-full py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs font-medium text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500"
            >
              {GOV_BOARDS_LIST.map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips & Reset Button */}
        {(filter.searchQuery ||
          filter.state !== "All India" ||
          (filter.sector && filter.sector !== "All Sectors") ||
          filter.govBoard !== "All Boards" ||
          filter.qualification !== "All Qualifications") && (
          <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-slate-400 text-[11px]">Applied Filters:</span>
              {filter.state !== "All India" && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                  📍 {filter.state}
                </span>
              )}
              {filter.sector && filter.sector !== "All Sectors" && (
                <span className="px-2 py-0.5 rounded-md bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-400 font-semibold text-[11px]">
                  🎓 {filter.sector}
                </span>
              )}
              {filter.qualification !== "All Qualifications" && (
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-semibold text-[11px]">
                  🎓 {filter.qualification}
                </span>
              )}
            </div>

            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              Reset All Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
