"use client";
import React, { useState, useEffect } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Search, Star, Landmark, ShieldCheck, MapPin, CheckCircle2 } from "lucide-react";
import { govtServices, ALL_INDIAN_STATES, ServiceItem } from "@/lib/govt-directory-data";

export default function GovtDirectory() {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

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

  const getFilteredServices = () => {
    let list = [...govtServices];

    // Filter by State if a specific state is selected
    if (selectedState !== "All States" && selectedState !== "All India (Central)") {
      const stateOnly = list.filter((s) => s.state?.toLowerCase() === selectedState.toLowerCase());
      const central = list.filter((s) => !s.state);
      // Place selected state items first
      list = [...stateOnly, ...central];
    }

    return list.filter((item) => {
      // If state is selected and category is land/ration/edistrict, ensure strict state match
      if (selectedState !== "All States" && selectedState !== "All India (Central)") {
        if (item.state && item.state.toLowerCase() !== selectedState.toLowerCase()) {
          return false;
        }
      }

      // Category filter
      const matchesCat =
        selectedCat === "all" ||
        item.category === selectedCat ||
        (selectedCat === "land" && item.category === "land") ||
        (selectedCat === "welfare" && (item.category === "welfare" || item.category === "land" || item.category === "ration" || item.category === "edistrict"));

      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        (item.state || "").toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCat && matchesSearch;
    });
  };

  const filtered = getFilteredServices();

  return (
    <div className="space-y-6">
      {/* Search and State Filters Header */}
      <div className="utility-card p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search Banglarbhumi, Bhulekh, Land Records, Parcha, Aadhaar, Ration..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white font-bold placeholder-slate-400"
            />
          </div>

          <div className="flex items-center gap-2 shrink-0 p-2 rounded-2xl bg-amber-500/10 border border-amber-500/30">
            <MapPin className="w-4 h-4 text-rose-500 shrink-0" />
            <span className="text-xs font-black text-amber-900 dark:text-amber-300">SELECT STATE:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 rounded-xl border border-amber-300 dark:border-amber-700 bg-white dark:bg-slate-900 text-xs font-black focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-900 dark:text-white shadow-xs"
            >
              <option value="All States">🌐 All States &amp; Central Portals</option>
              {ALL_INDIAN_STATES.map((st) => (
                <option key={st} value={st}>
                  📍 {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: "all", label: "All Services" },
            { id: "land", label: "🏞️ Land Records & Parcha (भूमि/पर्चा)" },
            { id: "identity", label: "🪪 Identity (Aadhaar/PAN/Voter)" },
            { id: "ration", label: "🌾 Ration Card (डिजिटल राशन)" },
            { id: "edistrict", label: "📜 e-District Certificates" },
            { id: "transport", label: "🚗 Transport & Driving (DL/RC)" },
            { id: "business", label: "💼 Taxes & GST" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 text-xs font-extrabold rounded-xl transition-all whitespace-nowrap ${
                selectedCat === cat.id
                  ? "bg-slate-900 text-white dark:bg-amber-500 dark:text-slate-950 shadow-md scale-[1.02]"
                  : "bg-slate-100 hover:bg-slate-200 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-300 border border-slate-200 dark:border-slate-800"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filter Banner indicator */}
      {selectedState !== "All States" && (
        <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800/60 flex items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-amber-900 dark:text-amber-300 font-black">
            <MapPin className="w-4 h-4 text-rose-500" />
            Showing Land Records &amp; Citizen Services for: <span className="underline text-amber-700 dark:text-amber-400 font-black text-sm">{selectedState}</span>
          </div>
          <button
            onClick={() => setSelectedState("All States")}
            className="px-3 py-1 rounded-lg bg-amber-200 dark:bg-amber-900 text-amber-950 dark:text-amber-100 font-extrabold hover:bg-amber-300 transition-colors"
          >
            Show All States
          </button>
        </div>
      )}

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-500 border border-dashed border-slate-300 dark:border-slate-800 rounded-3xl bg-white dark:bg-slate-900">
          <Landmark className="w-12 h-12 mx-auto text-amber-500 mb-3" />
          <p className="font-black text-base text-slate-900 dark:text-white">No Services Found for {selectedState}</p>
          <p className="text-xs font-bold text-slate-600 dark:text-slate-400 mt-1">Try selecting another category or clicking &quot;Show All States&quot;.</p>
          <button
            onClick={() => {
              setSelectedCat("all");
              setSelectedState("All States");
              setSearchQuery("");
            }}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-black bg-amber-500 text-white shadow-md hover:bg-amber-600"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative utility-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between hover:shadow-lg hover:border-amber-400/80 transition-all bg-white dark:bg-slate-900"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-emerald-800 bg-emerald-100 dark:text-emerald-300 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md border border-emerald-300">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Official Portal
                      </span>
                      {item.state && (
                        <span className="inline-flex items-center gap-1 text-[10px] uppercase font-black tracking-wider text-amber-900 bg-amber-100 dark:text-amber-300 dark:bg-amber-950/60 px-2 py-0.5 rounded-md border border-amber-300">
                          <MapPin className="w-3 h-3 text-rose-500" /> {item.state}
                        </span>
                      )}
                    </div>

                    <button
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-colors"
                      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isBookmarked ? "text-amber-500 fill-amber-500" : "text-slate-400 dark:text-slate-600"
                        }`}
                      />
                    </button>
                  </div>

                  {/* Title with Deep Black Contrast */}
                  <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors leading-snug">
                    {item.title}
                  </h3>

                  {/* Description with High Contrast Bold Slate */}
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed mt-2.5 mb-6">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 shadow-md shadow-amber-500/20 flex items-center justify-center gap-1.5 transition-all mt-auto"
                >
                  🚀 Open Direct Govt Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
