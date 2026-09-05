"use client";
import React from "react";
import {
  JobFilterState,
  GOV_BOARDS_LIST,
  ALL_SECTORS_LIST,
  INDIAN_STATES_LIST,
  QUALIFICATIONS_LIST,
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
  Mail,
  Train,
  ShieldCheck,
  Building,
  CreditCard,
  Cpu,
  Stethoscope,
} from "lucide-react";

interface JobFilterProps {
  filter: JobFilterState;
  onChange: (updated: Partial<JobFilterState>) => void;
  totalCount: number;
  govtCount: number;
  privCount: number;
  onReset: () => void;
}

export const SECTOR_PILL_CONFIG: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}[] = [
  { label: "All Sectors", icon: Layers, color: "text-emerald-500" },
  { label: "Teaching & Education", icon: BookOpen, color: "text-rose-500" },
  { label: "Panchayat & Postal", icon: Mail, color: "text-amber-500" },
  { label: "Railway", icon: Train, color: "text-sky-500" },
  { label: "Police & Defence", icon: ShieldCheck, color: "text-red-500" },
  { label: "Central SSC & UPSC", icon: Landmark, color: "text-indigo-500" },
  { label: "State PSC & Subordinate", icon: Building, color: "text-orange-500" },
  { label: "Banking & Finance", icon: CreditCard, color: "text-cyan-500" },
  { label: "PSU & Engineering", icon: Cpu, color: "text-purple-500" },
  { label: "Medical & Health", icon: Stethoscope, color: "text-teal-500" },
  { label: "Private & Corporate", icon: Briefcase, color: "text-blue-500" },
];

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
      {/* Top Primary Segmented Switcher: All | Government | Private */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 shadow-inner">
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
            🏛️ Sarkari &amp; Public ({govtCount})
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

        {/* Live Filter Counter Status */}
        <div className="text-xs text-slate-500 dark:text-slate-400 hidden md:block">
          Active Sector: <span className="font-bold text-slate-800 dark:text-slate-200">{filter.sector || "All Sectors"}</span>
        </div>
      </div>

      {/* Interactive Sector Filter Pills Strip */}
      <div className="relative">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-1 no-scrollbar scroll-smooth">
          {SECTOR_PILL_CONFIG.map((pill) => {
            const Icon = pill.icon;
            const isSelected = (filter.sector || "All Sectors") === pill.label;

            return (
              <button
                key={pill.label}
                onClick={() => {
                  const newCategory =
                    pill.label === "Private & Corporate"
                      ? "private"
                      : pill.label === "All Sectors"
                      ? filter.category
                      : "government";
                  onChange({
                    sector: pill.label,
                    category: newCategory,
                  });
                }}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 border ${
                  isSelected
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md"
                    : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-slate-400 dark:hover:border-slate-600"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-amber-400 dark:text-amber-600" : pill.color}`} />
                <span>{pill.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Search & Detailed Dropdown Filter Controls */}
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
              filter.sector === "Teaching & Education"
                ? "Search Teaching (CTET, KVS, BPSC TRE, B.Ed, PRT, TGT)..."
                : filter.sector === "Panchayat & Postal"
                ? "Search Post Office & Panchayat (GDS, Sachiv, Patwari, 10th Pass)..."
                : filter.sector === "Railway"
                ? "Search Railway (RRB NTPC, ALP, Technician, Group D)..."
                : filter.sector === "Medical & Health"
                ? "Search Medical (AIIMS NORCET, Nursing Officer, NHM, CHO, Pharmacist)..."
                : isGovt
                ? "Search Sarkari & State jobs (SSC, UPSC, Railway, Police, Bank, 10th Pass)..."
                : isPriv
                ? "Search Tech & Corporate jobs (React, Python, Remote, TCS, Analyst)..."
                : "Search all Indian jobs by role, department, state, sector, or qualification..."
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

        {/* Dropdowns Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {/* Prominent State / Region Filter */}
          <div className="relative p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <label className="block text-[11px] uppercase font-black text-amber-800 dark:text-amber-300 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-rose-500" /> 📍 SELECT STATE / REGION (राज्य चुनें)
            </label>
            <select
              value={filter.state}
              onChange={(e) => onChange({ state: e.target.value })}
              className="w-full py-2 px-3 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs font-black text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-2xs"
            >
              {INDIAN_STATES_LIST.map((st) => (
                <option key={st} value={st}>
                  {st === "All India" ? "🇮🇳 All India Jobs (सभी राज्य)" : `📍 ${st} Jobs`}
                </option>
              ))}
            </select>
          </div>

          {/* Qualification Filter */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <GraduationCap className="w-3 h-3 text-emerald-500" /> Educational Qualification
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

          {/* Authority / Recruiting Body Filter */}
          <div className="relative">
            <label className="block text-[10px] uppercase font-bold text-slate-400 mb-1 flex items-center gap-1">
              <Landmark className="w-3 h-3 text-indigo-500" /> Recruiting Body / Board
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
              {filter.sector && filter.sector !== "All Sectors" && (
                <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 font-semibold text-[11px]">
                  📌 {filter.sector}
                </span>
              )}
              {filter.state !== "All India" && (
                <span className="px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                  📍 {filter.state}
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
