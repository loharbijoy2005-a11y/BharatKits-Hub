"use client";
import React, { useState, useMemo } from "react";
import { GOVT_PORTALS_DATA, GovtPortalItem } from "@/lib/govt-portals-data";
import {
  Landmark,
  ExternalLink,
  Search,
  Building,
  Train,
  CreditCard,
  ShieldCheck,
  Mail,
  BookOpen,
  Cpu,
  Globe,
  Sparkles,
  MapPin,
  CheckCircle2,
  Share2,
  Copy,
  Check,
  Zap,
} from "lucide-react";

const CATEGORY_TABS = [
  { id: "all", label: "All Portals (30+)", icon: Globe, color: "text-emerald-500" },
  { id: "central", label: "SSC & UPSC", icon: Landmark, color: "text-indigo-500" },
  { id: "railway", label: "Railways & RRB", icon: Train, color: "text-sky-500" },
  { id: "banking", label: "Banking & IBPS", icon: CreditCard, color: "text-cyan-500" },
  { id: "defence", label: "Defence & Army", icon: ShieldCheck, color: "text-red-500" },
  { id: "postal", label: "India Post GDS", icon: Mail, color: "text-amber-500" },
  { id: "teaching", label: "Teaching & CTET", icon: BookOpen, color: "text-rose-500" },
  { id: "psu", label: "PSU & ISRO/DRDO", icon: Cpu, color: "text-purple-500" },
  { id: "state_psc", label: "State PSCs & Police", icon: Building, color: "text-orange-500" },
  { id: "employment", label: "NCS & Apprenticeship", icon: Zap, color: "text-blue-500" },
];

export function GovtPortalsHub() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedState, setSelectedState] = useState("All");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Extract unique states/regions for filter
  const stateList = useMemo(() => {
    const set = new Set<string>();
    GOVT_PORTALS_DATA.forEach((item) => set.add(item.stateOrRegion));
    return ["All", ...Array.from(set)];
  }, []);

  const filteredPortals = useMemo(() => {
    return GOVT_PORTALS_DATA.filter((item) => {
      // Category match
      if (selectedCategory !== "all" && item.category !== selectedCategory) {
        return false;
      }
      // State match
      if (selectedState !== "All" && item.stateOrRegion !== selectedState) {
        return false;
      }
      // Search match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(q);
        const inAgency = item.agency.toLowerCase().includes(q);
        const inDesc = item.description.toLowerCase().includes(q);
        const inExam = (item.popularExam || "").toLowerCase().includes(q);
        const inTags = item.tags.some((t) => t.toLowerCase().includes(q));
        return inName || inAgency || inDesc || inExam || inTags;
      }
      return true;
    });
  }, [searchQuery, selectedCategory, selectedState]);

  const handleCopy = (item: GovtPortalItem) => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(`${item.name} Official Portal: ${item.url}`);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleShare = (item: GovtPortalItem) => {
    const text = `📌 *Official Govt Recruitment Portal:* ${item.name}\n🏢 ${item.agency}\n🔗 *Direct Apply Link:* ${item.url}\n\nVia BharatKits Hub Direct Directory`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank");
  };

  return (
    <section className="space-y-6">
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-amber-950/80 to-slate-900 border border-amber-500/30 p-6 sm:p-8 shadow-2xl text-white">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Direct Official Links Hub
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Official Sarkari Job Recruitment Websites
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Direct 1-click access to official government boards, commissions &amp; hiring portals (SSC, UPSC, RRB, IBPS, India Post GDS, Defence, State PSCs). Apply straight from the official source with zero date restrictions or third-party delays.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-amber-200/90">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" /> 100% Verified Official URLs (.gov.in / .nic.in / .ac.in)
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Direct Apply without Date Blockers
            </span>
          </div>
        </div>
      </div>

      {/* Search & State Filter Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search official portal name (e.g. SSC, UPSC, RRB, GDS, WBPSC, BPSC, IBPS)..."
            className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm"
          />
        </div>

        {/* State Filter Dropdown */}
        <div className="shrink-0 flex items-center gap-2">
          <label className="text-xs font-bold text-slate-500 shrink-0">State / Region:</label>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-sm text-slate-800 dark:text-slate-200"
          >
            {stateList.map((st) => (
              <option key={st} value={st}>
                {st === "All" ? "🌐 All India & States" : st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Category Sector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORY_TABS.map(({ id, label, icon: Icon, color }) => {
          const isActive = selectedCategory === id;
          return (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md scale-[1.02]"
                  : "bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? "text-amber-400 dark:text-slate-950" : color}`} />
              {label}
            </button>
          );
        })}
      </div>

      {/* Portals Cards Grid */}
      {filteredPortals.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <Globe className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">No official portal found</h3>
          <p className="text-xs text-slate-500 mt-1">Try resetting your search query or state filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
              setSelectedState("All");
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white shadow-md hover:bg-amber-600"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPortals.map((portal) => (
            <div
              key={portal.id}
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-amber-400/80 dark:hover:border-amber-500/60 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-200"
            >
              <div>
                {/* Card Top Badges */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60">
                      {portal.categoryLabel}
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      <MapPin className="w-2.5 h-2.5 text-rose-500" />
                      {portal.stateOrRegion}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(portal)}
                      title="Copy Portal Link"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      {copiedId === portal.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleShare(portal)}
                      title="Share Portal on WhatsApp"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Portal Name & Agency */}
                <h3 className="text-base font-black text-slate-900 dark:text-white leading-snug group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {portal.name}
                </h3>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-0.5">
                  {portal.agency}
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-2.5 leading-relaxed line-clamp-2">
                  {portal.description}
                </p>

                {/* Popular Exam Highlight Badge */}
                {portal.popularExam && (
                  <div className="mt-3 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                    <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>Popular Exams: <strong className="text-amber-700 dark:text-amber-400 font-bold">{portal.popularExam}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Direct Apply Button */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center gap-2">
                <a
                  href={portal.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-amber-500/20 transition-all group-hover:shadow-amber-500/30"
                >
                  🚀 Open Official Portal
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
