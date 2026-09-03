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
  Share2,
  Sparkles,
  ArrowRight,
  HelpCircle,
} from "lucide-react";
import {
  govtServices,
  ALL_INDIAN_STATES,
  POPULAR_STATES,
  ServiceItem,
} from "@/lib/govt-directory-data";

type TabFilter = "all" | "land" | "pan" | "identity" | "ration" | "edistrict" | "transport" | "business" | "welfare";

export default function GovtDirectory() {
  const [activeTab, setActiveTab] = useState<TabFilter>("all");
  const [landSelectedState, setLandSelectedState] = useState<string>("Bihar");
  const [rationSelectedState, setRationSelectedState] = useState<string>("Bihar");
  const [edistrictSelectedState, setEdistrictSelectedState] = useState<string>("Bihar");
  const [globalSearch, setGlobalSearch] = useState<string>("");
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

  const copyUrl = (id: string, url: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // State specific land record lookup
  const currentLandService = useMemo(() => {
    return (
      govtServices.find(
        (s) => s.category === "land" && s.state === landSelectedState
      ) || {
        id: "land-fallback",
        title: `${landSelectedState} Land Records & Revenue Portal`,
        description: `Official digital Land Records, Khasra/Khatauni, Jamabandi, and Mutation status portal for ${landSelectedState}.`,
        url: "https://bhulekh.gov.in/",
        category: "land" as const,
        state: landSelectedState,
        tags: ["land records", "bhulekh", "parcha"],
      }
    );
  }, [landSelectedState]);

  // State specific ration card lookup
  const currentRationService = useMemo(() => {
    return (
      govtServices.find(
        (s) => s.category === "ration" && s.state === rationSelectedState
      ) || {
        id: "ration-fallback",
        title: `${rationSelectedState} Food & Civil Supplies (Ration Card)`,
        description: `Check Ration Card eligibility, download e-Ration card, and view dealer allocations for ${rationSelectedState}.`,
        url: "https://nfsa.gov.in/",
        category: "ration" as const,
        state: rationSelectedState,
        tags: ["ration card", "food supplies", "pds"],
      }
    );
  }, [rationSelectedState]);

  // State specific e-District lookup
  const currentEdistrictService = useMemo(() => {
    return (
      govtServices.find(
        (s) => s.category === "edistrict" && s.state === edistrictSelectedState
      ) || {
        id: "edistrict-fallback",
        title: `${edistrictSelectedState} e-District Citizen Services`,
        description: `Apply for Caste (Jati), Income (Aay), and Domicile (Niwas/Resident) certificates in ${edistrictSelectedState}.`,
        url: "https://serviceonline.gov.in/",
        category: "edistrict" as const,
        state: edistrictSelectedState,
        tags: ["edistrict", "caste certificate", "income certificate"],
      }
    );
  }, [edistrictSelectedState]);

  // Central / General Services list (excluding individual state services that are in interactive widgets)
  const centralAndGeneralServices = useMemo(() => {
    return govtServices.filter((item) => {
      // Keep Central items OR match search
      if (item.state) return false; // State items handled via state selectors

      if (onlyBookmarks && !bookmarks.includes(item.id)) return false;

      if (activeTab === "pan" && !item.tags.some((t) => t.includes("pan"))) {
        return false;
      }
      if (activeTab === "identity" && item.category !== "identity") {
        return false;
      }
      if (activeTab === "transport" && item.category !== "transport") {
        return false;
      }
      if (activeTab === "business" && item.category !== "business") {
        return false;
      }
      if (activeTab === "welfare" && item.category !== "welfare") {
        return false;
      }

      if (globalSearch.trim() !== "") {
        const q = globalSearch.toLowerCase().trim();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesDesc && !matchesTags) return false;
      }

      return true;
    });
  }, [activeTab, globalSearch, bookmarks, onlyBookmarks]);

  return (
    <div className="space-y-8">
      {/* Top Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-950 via-slate-900 to-indigo-950 p-6 md:p-8 text-white border border-brand-800/40 shadow-xl">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/20 border border-brand-400/30 text-brand-300 text-xs font-bold mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Digital India 2026 Unified Govt Hub</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Govt Portals & State Land Parcha Hub
            </h2>
            <p className="text-xs md:text-sm text-slate-300 mt-2 max-w-2xl leading-relaxed">
              Direct access to <span className="text-emerald-300 font-bold">State Land Records (Bhulekh / Parcha / 7-12)</span> with 1-click state selector, verified <span className="text-blue-300 font-bold">Dual PAN Card Portals (Protean & UTIITSL)</span>, Ration Cards, and Central Identity Services.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                setActiveTab("land");
                const el = document.getElementById("land-parcha-hub");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Select Land State ↗</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("pan");
                const el = document.getElementById("pan-card-hub");
                el?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-black transition-all shadow-md flex items-center gap-1.5"
            >
              <CreditCard className="w-4 h-4" />
              <span>PAN Card Portals ↗</span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Search & Category Tabs */}
      <div className="utility-card p-5 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative flex-grow w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Quick search: 'pan card', 'land parcha', 'aadhaar', 'voter id', 'driving licence', 'challan'..."
              value={globalSearch}
              onChange={(e) => setGlobalSearch(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50 text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
            {globalSearch && (
              <button
                onClick={() => setGlobalSearch("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                Clear
              </button>
            )}
          </div>

          <button
            onClick={() => setOnlyBookmarks(!onlyBookmarks)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 ${
              onlyBookmarks
                ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                : "bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-amber-500"
            }`}
            title="Filter Starred Portals"
          >
            <Star className={`w-4 h-4 ${onlyBookmarks ? "fill-white" : bookmarks.length > 0 ? "text-amber-500 fill-amber-500" : ""}`} />
            <span>Saved ({bookmarks.length})</span>
          </button>
        </div>

        {/* Tab Filter Pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pt-1">
          {[
            { id: "all", label: "All Hubs & Portals", icon: Layers },
            { id: "land", label: "🌾 Land Parcha / Bhulekh", icon: FileSpreadsheet },
            { id: "pan", label: "🪪 PAN Card (Dual Servers)", icon: CreditCard },
            { id: "ration", label: "🍚 Ration Cards (State-wise)", icon: Wheat },
            { id: "edistrict", label: "📜 Certificates & e-District", icon: FileCheck },
            { id: "identity", label: "Aadhaar & Voter ID", icon: ShieldCheck },
            { id: "transport", label: "Transport & Challan", icon: Car },
            { id: "business", label: "ITR & GST Taxes", icon: Receipt },
            { id: "welfare", label: "PF & Welfare Schemes", icon: HeartHandshake },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabFilter)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all whitespace-nowrap flex items-center gap-1.5 shrink-0 ${
                  isActive
                    ? "bg-brand-600 text-white shadow-sm ring-2 ring-brand-400/30"
                    : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-600 dark:text-slate-300"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. UNIFIED STATE LAND PARCHA / BHULEKH INTERACTIVE HUB                    */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "land") && (
        <div
          id="land-parcha-hub"
          className="rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-br from-emerald-50/60 via-white to-teal-50/40 dark:from-emerald-950/30 dark:via-slate-900 dark:to-teal-950/20 p-6 md:p-8 shadow-lg space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-emerald-200/60 dark:border-emerald-800/40 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                    All-India Land Parcha & Bhulekh Hub
                  </h3>
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300">
                    28 States + UTs
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Select your state from the dropdown below to view your state&apos;s official Land Parcha, Khasra/Khatauni, Jamabandi, or 7/12 portal.
                </p>
              </div>
            </div>

            {/* State Dropdown Selector */}
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 border-emerald-500 bg-white dark:bg-slate-900 shadow-sm shrink-0">
              <MapPin className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <div className="flex flex-col">
                <label htmlFor="land-state-select" className="text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400">
                  Select State
                </label>
                <select
                  id="land-state-select"
                  value={landSelectedState}
                  onChange={(e) => setLandSelectedState(e.target.value)}
                  className="bg-transparent text-sm font-black focus:outline-none text-slate-900 dark:text-slate-100 cursor-pointer pr-4"
                >
                  {ALL_INDIAN_STATES.filter((s) => s !== "All India (Central)").map((st) => (
                    <option key={st} value={st} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white py-1">
                      📍 {st}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Popular Quick State Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 shrink-0 mr-1">
              ⚡ Quick Select:
            </span>
            {POPULAR_STATES.slice(0, 10).map((st) => (
              <button
                key={st}
                onClick={() => setLandSelectedState(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 ${
                  landSelectedState === st
                    ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-400/40"
                    : "bg-white dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 border border-emerald-200/60 dark:border-emerald-800/40"
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Active State Land Portal Result Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border-2 border-emerald-300/80 dark:border-emerald-800/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-300/50">
                  📍 {landSelectedState} Official Portal
                </span>
                <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  Verified Govt Link
                </span>
              </div>
              <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                {currentLandService.title}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
                {currentLandService.description}
              </p>
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                {currentLandService.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch md:items-center gap-2.5 w-full md:w-auto shrink-0">
              <button
                onClick={() => copyUrl(currentLandService.id, currentLandService.url)}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-100 transition-all flex items-center justify-center gap-1.5"
                title="Copy Official URL"
              >
                {copiedId === currentLandService.id ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <a
                href={currentLandService.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
              >
                <span>Open {landSelectedState} Land Portal</span>
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. DEDICATED PAN CARD HUB (DUAL WORKING SERVERS + INSTANT E-PAN)          */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "pan" || activeTab === "identity") && (
        <div
          id="pan-card-hub"
          className="rounded-3xl border-2 border-blue-500/40 bg-gradient-to-br from-blue-50/60 via-white to-indigo-50/40 dark:from-blue-950/30 dark:via-slate-900 dark:to-indigo-950/20 p-6 md:p-8 shadow-lg space-y-6"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-blue-200/60 dark:border-blue-800/40 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-md">
                <CreditCard className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white">
                    Official PAN Card Services Hub
                  </h3>
                  <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                    Dual Working Servers
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                  Apply for a New PAN Card (Form 49A/93), make corrections, track status, or get Instant Digital e-PAN.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-500 bg-blue-50 dark:bg-blue-950/50 px-3 py-1.5 rounded-xl border border-blue-200/50">
              <HelpCircle className="w-4 h-4 text-blue-500 shrink-0" />
              <span>Protean (NSDL) &amp; UTIITSL are both Govt Authorized</span>
            </div>
          </div>

          {/* Primary Dual Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Option 1: Protean NSDL Online */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-blue-300/70 dark:border-blue-800/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300">
                    Server 1 (Primary)
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> Protean NSDL
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Apply PAN via Protean (Form 49A)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
                  Official Protean online application form for new physical PAN, name/DOB corrections, and reprint of lost cards.
                </p>
              </div>
              <a
                href="https://onlineservices.proteantech.in/paam/endUserRegisterContact.html"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5"
              >
                <span>Open Protean Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Option 2: UTIITSL Official */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-indigo-300/70 dark:border-indigo-800/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300">
                    Server 2 (Alternate)
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" /> UTIITSL Govt
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Apply PAN via UTIITSL Portal
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
                  Official UTI Infrastructure Technology portal for new PAN cards, tracking application status, and e-PAN downloads.
                </p>
              </div>
              <a
                href="https://www.pan.utiitsl.com/PAN/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5"
              >
                <span>Open UTIITSL Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Option 3: Instant Digital e-PAN */}
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border-2 border-amber-300/70 dark:border-amber-800/70 shadow-sm flex flex-col justify-between hover:shadow-md transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                    Digital Instant Portal
                  </span>
                  <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Aadhaar OTP Based
                  </span>
                </div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white">
                  Instant e-PAN (Income Tax Dept)
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 mb-4 leading-relaxed">
                  Direct paperless allotment or download of digital e-PAN in minutes using Aadhaar authentication.
                </p>
              </div>
              <a
                href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/instant-e-pan"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all flex items-center justify-center gap-1.5"
              >
                <span>Instant e-PAN Portal</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Quick Sub-Links for PAN Verification & Link Aadhaar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs">
            <span className="font-extrabold text-slate-700 dark:text-slate-300">
              Quick PAN Tools:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/link-aadhaar-status"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-all flex items-center gap-1"
              >
                <span>Check Aadhaar-PAN Link Status</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://eportal.incometax.gov.in/iec/foservices/#/pre-login/verifyYourPANToken"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-all flex items-center gap-1"
              >
                <span>Verify PAN Details</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </a>
              <a
                href="https://www.protean-tinpan.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-slate-200 font-bold transition-all flex items-center gap-1"
              >
                <span>Protean TIN-PAN Hub</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 3. UNIFIED RATION CARD FINDER & E-DISTRICT WIDGETS                        */}
      {/* ========================================================================= */}
      {(activeTab === "all" || activeTab === "ration" || activeTab === "edistrict") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Ration Card Finder */}
          {(activeTab === "all" || activeTab === "ration") && (
            <div className="p-6 rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-50/50 via-white to-orange-50/30 dark:from-amber-950/20 dark:via-slate-900 dark:to-orange-950/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-amber-200/60 dark:border-amber-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0">
                    <Wheat className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      State Ration Card (PDS) Hub
                    </h4>
                    <p className="text-[11px] text-slate-500">Search Food &amp; Civil Supplies by state</p>
                  </div>
                </div>

                <select
                  aria-label="Select State for Ration Card"
                  value={rationSelectedState}
                  onChange={(e) => setRationSelectedState(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-amber-300 dark:border-amber-800 bg-white dark:bg-slate-900 text-xs font-black text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {ALL_INDIAN_STATES.filter((s) => s !== "All India (Central)").map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="text-[10px] font-black uppercase text-amber-700 dark:text-amber-400">
                  📍 {rationSelectedState} Ration Portal
                </div>
                <h5 className="text-sm font-black text-slate-900 dark:text-white">
                  {currentRationService.title}
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {currentRationService.description}
                </p>
                <div className="pt-2">
                  <a
                    href={currentRationService.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black transition-all"
                  >
                    <span>Open {rationSelectedState} Ration Portal</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* e-District Certificate Finder */}
          {(activeTab === "all" || activeTab === "edistrict") && (
            <div className="p-6 rounded-3xl border-2 border-purple-500/40 bg-gradient-to-br from-purple-50/50 via-white to-pink-50/30 dark:from-purple-950/20 dark:via-slate-900 dark:to-pink-950/10 shadow-sm space-y-4">
              <div className="flex items-center justify-between gap-3 border-b border-purple-200/60 dark:border-purple-800/40 pb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">
                      e-District &amp; Certificates
                    </h4>
                    <p className="text-[11px] text-slate-500">Caste, Income, Domicile certificates</p>
                  </div>
                </div>

                <select
                  aria-label="Select State for e-District Certificates"
                  value={edistrictSelectedState}
                  onChange={(e) => setEdistrictSelectedState(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-purple-300 dark:border-purple-800 bg-white dark:bg-slate-900 text-xs font-black text-slate-800 dark:text-slate-200 cursor-pointer"
                >
                  {ALL_INDIAN_STATES.filter((s) => s !== "All India (Central)").map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-purple-200 dark:border-purple-800/60 space-y-2">
                <div className="text-[10px] font-black uppercase text-purple-700 dark:text-purple-400">
                  📍 {edistrictSelectedState} Citizen Services
                </div>
                <h5 className="text-sm font-black text-slate-900 dark:text-white">
                  {currentEdistrictService.title}
                </h5>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {currentEdistrictService.description}
                </p>
                <div className="pt-2">
                  <a
                    href={currentEdistrictService.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-black transition-all"
                  >
                    <span>Open {edistrictSelectedState} e-District</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. CENTRAL & NATIONAL GOVERNMENT PORTALS GRID                             */}
      {/* ========================================================================= */}
      {(activeTab === "all" ||
        activeTab === "identity" ||
        activeTab === "transport" ||
        activeTab === "business" ||
        activeTab === "welfare") && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="w-4 h-4 text-brand-600 dark:text-brand-400" />
              <span>National &amp; Central Citizen Services</span>
            </h3>
            <span className="text-xs font-bold text-slate-400">
              {centralAndGeneralServices.length} Portals Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {centralAndGeneralServices.map((item) => {
              const isBookmarked = bookmarks.includes(item.id);

              return (
                <div
                  key={item.id}
                  className="group relative utility-card p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-all bg-white dark:bg-slate-900"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3 gap-2">
                      <div className="flex items-center gap-1 text-[9px] uppercase font-black tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-200/50 dark:border-emerald-800/50">
                        <ShieldCheck className="w-3 h-3" />
                        <span>Official Central Portal</span>
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

                    <h4 className="text-sm font-black text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 mb-4">
                      {item.description}
                    </p>
                  </div>

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
        </div>
      )}
    </div>
  );
}
