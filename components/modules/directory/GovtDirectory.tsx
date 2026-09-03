"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  ExternalLink,
  Search,
  Star,
  Landmark,
  ShieldCheck,
  MapPin,
  FileSpreadsheet,
  CreditCard,
  Wheat,
  FileCheck,
  Car,
  Receipt,
  HeartHandshake,
  Layers,
  CheckCircle2,
  AlertCircle,
  Share2,
  Sparkles,
} from "lucide-react";
import {
  govtServices,
  ALL_INDIAN_STATES,
  POPULAR_STATES,
  ServiceItem,
} from "@/lib/govt-directory-data";

type CategoryFilter = "all" | "land" | "identity" | "ration" | "edistrict" | "transport" | "business" | "welfare";

interface CategoryMeta {
  id: CategoryFilter;
  label: string;
  shortLabel: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeColor: string;
}

const CATEGORIES: CategoryMeta[] = [
  {
    id: "all",
    label: "All Services",
    shortLabel: "All",
    icon: Layers,
    color: "from-slate-600 to-slate-800",
    badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
  },
  {
    id: "land",
    label: "Land Records & Bhulekh (Parcha)",
    shortLabel: "Land Parcha",
    icon: FileSpreadsheet,
    color: "from-emerald-500 to-teal-600",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-800",
  },
  {
    id: "identity",
    label: "PAN & Identity (Aadhaar, Voter)",
    shortLabel: "PAN & Identity",
    icon: CreditCard,
    color: "from-blue-500 to-indigo-600",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-800",
  },
  {
    id: "ration",
    label: "Ration Cards & PDS",
    shortLabel: "Ration Cards",
    icon: Wheat,
    color: "from-amber-500 to-orange-600",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-800",
  },
  {
    id: "edistrict",
    label: "e-District & Certificates",
    shortLabel: "Certificates",
    icon: FileCheck,
    color: "from-purple-500 to-pink-600",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-400 dark:border-purple-800",
  },
  {
    id: "transport",
    label: "Transport & e-Challan",
    shortLabel: "Transport",
    icon: Car,
    color: "from-sky-500 to-blue-600",
    badgeColor: "bg-sky-50 text-sky-700 border-sky-200 dark:bg-sky-950/40 dark:text-sky-400 dark:border-sky-800",
  },
  {
    id: "business",
    label: "Taxes & Business (ITR, GST)",
    shortLabel: "Taxes & GST",
    icon: Receipt,
    color: "from-indigo-500 to-violet-600",
    badgeColor: "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/40 dark:text-indigo-400 dark:border-indigo-800",
  },
  {
    id: "welfare",
    label: "Welfare & Pension (PF, Kisan)",
    shortLabel: "Welfare",
    icon: HeartHandshake,
    color: "from-rose-500 to-red-600",
    badgeColor: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-800",
  },
];

export default function GovtDirectory() {
  const [selectedCat, setSelectedCat] = useState<CategoryFilter>("all");
  const [selectedState, setSelectedState] = useState<string>("All India (Central)");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [onlyBookmarks, setOnlyBookmarks] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("bharatkits_bookmarks");
      if (saved) {
        setBookmarks(JSON.parse(saved));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleBookmark = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    let updated = [...bookmarks];
    if (updated.includes(id)) {
      updated = updated.filter((item) => item !== id);
    } else {
      updated.push(id);
    }
    setBookmarks(updated);
    try {
      localStorage.setItem("bharatkits_bookmarks", JSON.stringify(updated));
    } catch {
      // ignore
    }
  };

  const copyUrl = (id: string, url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filtered Services Computation
  const filteredServices = useMemo(() => {
    return govtServices.filter((item) => {
      // Bookmark filter
      if (onlyBookmarks && !bookmarks.includes(item.id)) {
        return false;
      }

      // State filter
      if (selectedState !== "All India (Central)") {
        // If a specific state is chosen, show services of that state OR central services (if no category chosen or general)
        const isExactState = item.state === selectedState;
        const isCentral = !item.state;
        if (!isExactState && !isCentral) return false;
      }

      // Category filter
      if (selectedCat !== "all" && item.category !== selectedCat) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesState = item.state?.toLowerCase().includes(q) || false;
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesState && !matchesTags) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCat, selectedState, searchQuery, bookmarks, onlyBookmarks]);

  // Counts for each category in current state selection
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: 0 };
    CATEGORIES.forEach((c) => {
      counts[c.id] = 0;
    });

    govtServices.forEach((item) => {
      const matchState =
        selectedState === "All India (Central)" || item.state === selectedState || !item.state;
      if (matchState) {
        counts.all = (counts.all || 0) + 1;
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    return counts;
  }, [selectedState]);

  return (
    <div className="space-y-6">
      {/* Top Banner / Title Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-900 via-indigo-950 to-slate-950 p-6 md:p-8 text-white border border-brand-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>All India 28 States & 8 UTs Direct Official Directory</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Govt Portal & State Land Records Directory
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Direct, verified government URLs for <span className="text-amber-300 font-bold">Land Parcha / Bhulekh (Khasra/Khatauni/7-12)</span>,{" "}
              <span className="text-sky-300 font-bold">Instant e-PAN & Protean NSDL</span>, Ration Cards, and state e-District certificates across India.
            </p>
          </div>

          {/* Quick PAN Action Card */}
          <div className="shrink-0 bg-white/10 backdrop-blur-md border border-white/15 p-4 rounded-2xl flex flex-col gap-2 max-w-xs">
            <div className="flex items-center gap-2 text-xs font-black uppercase text-amber-300">
              <CreditCard className="w-4 h-4" />
              <span>Quick PAN Card Links</span>
            </div>
            <p className="text-[11px] text-slate-200 leading-tight">
              Instant 10-Min Free e-PAN or Physical NSDL / UTIITSL PAN Card.
            </p>
            <div className="flex gap-2 mt-1">
              <button
                onClick={() => {
                  setSelectedCat("identity");
                  setSearchQuery("pan");
                }}
                className="px-3 py-1.5 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold transition-all text-center"
              >
                View PAN Links ↗
              </button>
              <button
                onClick={() => {
                  setSelectedCat("land");
                  setSearchQuery("");
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-500/40 hover:bg-emerald-500/60 text-white text-xs font-extrabold transition-all border border-emerald-400/30 text-center"
              >
                Land Parcha ↗
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Search & State Filter Control Box */}
      <div className="utility-card p-5 md:p-6 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-grow">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by state, 'parcha', 'khasra', 'pan card', 'jamabandi', 'ration'..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-100 font-semibold transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          {/* State Dropdown Selector */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2 shrink-0">
            <div className="flex items-center gap-2 px-3 py-2 rounded-2xl border border-brand-200 dark:border-brand-900/60 bg-brand-50/50 dark:bg-brand-950/30 w-full sm:w-auto">
              <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400 shrink-0" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black uppercase text-brand-600 dark:text-brand-400">Select State / UT</span>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="bg-transparent text-xs font-extrabold focus:outline-none text-slate-900 dark:text-slate-100 cursor-pointer pr-4"
                >
                  {ALL_INDIAN_STATES.map((st) => (
                    <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1">
                      {st === "All India (Central)" ? "🇮🇳 All India (All States & Central)" : `📍 ${st}`}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bookmarks Toggle */}
            <button
              onClick={() => setOnlyBookmarks(!onlyBookmarks)}
              className={`px-3.5 py-3 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
                onlyBookmarks
                  ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                  : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500"
              }`}
              title="Filter Starred Portals"
            >
              <Star className={`w-4 h-4 ${onlyBookmarks ? "fill-white" : bookmarks.length > 0 ? "text-amber-500 fill-amber-500" : ""}`} />
              <span className="hidden sm:inline">Saved ({bookmarks.length})</span>
            </button>
          </div>
        </div>

        {/* Popular States Fast Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 pb-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 shrink-0 mr-1 flex items-center gap-1">
            ⚡ Quick State:
          </span>
          <button
            onClick={() => setSelectedState("All India (Central)")}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
              selectedState === "All India (Central)"
                ? "bg-brand-600 text-white"
                : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300"
            }`}
          >
            🇮🇳 All India
          </button>
          {POPULAR_STATES.map((st) => (
            <button
              key={st}
              onClick={() => setSelectedState(st)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all shrink-0 ${
                selectedState === st
                  ? "bg-brand-600 text-white"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pt-2 border-t border-slate-100 dark:border-slate-800/80">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const count = categoryCounts[cat.id] ?? 0;
            const isActive = selectedCat === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCat(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow-sm"
                    : "bg-slate-100/80 hover:bg-slate-200/80 dark:bg-slate-800/60 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200/50 dark:border-slate-700/50"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "" : "text-slate-500 dark:text-slate-400"}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-black ${
                    isActive
                      ? "bg-white/20 text-white dark:bg-slate-950/20 dark:text-slate-950"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected State & Active Filter Status Bar */}
      {selectedState !== "All India (Central)" && (
        <div className="flex items-center justify-between p-3.5 px-5 rounded-2xl bg-brand-50/80 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800 text-xs">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="font-extrabold text-slate-800 dark:text-slate-200">
              Showing State Portals for <span className="text-brand-700 dark:text-brand-300 underline font-black">{selectedState}</span>
            </span>
            <span className="text-slate-500 hidden md:inline">
              (Includes Land Records/Parcha, Food/Ration, and e-District Services)
            </span>
          </div>
          <button
            onClick={() => setSelectedState("All India (Central)")}
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline shrink-0"
          >
            Reset to All India ✕
          </button>
        </div>
      )}

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="py-20 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-950/20 space-y-3">
          <Landmark className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="font-black text-base text-slate-800 dark:text-slate-200">No Government Services Found</p>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            We couldn&apos;t find any portal matching &quot;{searchQuery}&quot; in {selectedState}. Try selecting &quot;All India&quot; or searching another keyword.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCat("all");
              setSelectedState("All India (Central)");
              setOnlyBookmarks(false);
            }}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-all inline-block mt-2"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredServices.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            const isPAN = item.tags.some((t) => t.includes("pan"));
            const isLand = item.category === "land" || item.tags.some((t) => t.includes("parcha") || t.includes("khasra") || t.includes("bhulekh"));

            return (
              <div
                key={item.id}
                className={`group relative utility-card p-5 rounded-3xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-all bg-white dark:bg-slate-900 ${
                  item.featured
                    ? "border-brand-200/80 dark:border-brand-800/80 ring-1 ring-brand-500/10"
                    : "border-slate-200/80 dark:border-slate-800/80"
                }`}
              >
                <div>
                  {/* Top Meta: Badge, State, Star */}
                  <div className="flex justify-between items-start mb-3 gap-2">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <div className="flex items-center gap-1 text-[9px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Official Portal</span>
                      </div>

                      {item.state ? (
                        <span className="text-[9px] font-black uppercase tracking-wider text-brand-700 bg-brand-50 dark:text-brand-300 dark:bg-brand-950/60 px-2 py-0.5 rounded-md border border-brand-200 dark:border-brand-800">
                          📍 {item.state}
                        </span>
                      ) : (
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-600 bg-slate-100 dark:text-slate-300 dark:bg-slate-800 px-2 py-0.5 rounded-md">
                          🇮🇳 Central / All India
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => copyUrl(item.id, item.url, e)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
                        title="Copy Portal URL"
                      >
                        {copiedId === item.id ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <Share2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={(e) => toggleBookmark(item.id, e)}
                        className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                        title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                      >
                        <Star
                          className={`w-4 h-4 ${
                            isBookmarked ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-700"
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Category Pill / Highlighting */}
                  {isLand && (
                    <div className="mt-1.5 mb-1 flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400">
                      <FileSpreadsheet className="w-3 h-3" />
                      <span>Land Records / Parcha / RoR</span>
                    </div>
                  )}

                  {isPAN && (
                    <div className="mt-1.5 mb-1 flex items-center gap-1 text-[10px] font-extrabold text-blue-700 dark:text-blue-400">
                      <CreditCard className="w-3 h-3" />
                      <span>Verified PAN Service</span>
                    </div>
                  )}

                  {/* Description */}
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 mb-4">
                    {item.description}
                  </p>
                </div>

                {/* Card Footer: Domain & Direct Link */}
                <div className="pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-2 mt-auto">
                  <span className="text-[10px] font-mono text-slate-400 truncate max-w-[150px]">
                    {item.url.replace(/^https?:\/\//, "").replace(/\/.*$/, "")}
                  </span>

                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-brand-50 hover:bg-brand-600 text-brand-700 hover:text-white dark:bg-brand-950/60 dark:hover:bg-brand-600 dark:text-brand-300 dark:hover:text-white text-xs font-extrabold transition-all border border-brand-200/60 dark:border-brand-800/60 shrink-0 group/link"
                  >
                    <span>Visit Portal</span>
                    <ExternalLink className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Footer Advisory Note */}
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong className="text-slate-700 dark:text-slate-300">Direct Official Links:</strong> All URLs point directly to authentic Central and State government domains (.gov.in / .nic.in). Always verify URL in browser address bar.
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400 shrink-0">
          Updated for 2026 Digital India
        </span>
      </div>
    </div>
  );
}
