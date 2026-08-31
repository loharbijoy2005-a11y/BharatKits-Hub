"use client";
import React, { useState, useEffect } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { ExternalLink, Search, Star, Landmark, ShieldCheck, MapPin } from "lucide-react";

interface ServiceItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: "identity" | "transport" | "business" | "welfare";
  state?: string; // state specific
}

const generalServices: ServiceItem[] = [
  // Identity
  {
    id: "uidai",
    title: "UIDAI Aadhaar Portal",
    description: "Download Aadhaar, update address, check link status, and lock/unlock biometrics online.",
    url: "https://myaadhaar.uidai.gov.in/",
    category: "identity",
  },
  {
    id: "pan-card",
    title: "PAN Card Services (NSDL/UTIITSL)",
    description: "Apply for a new PAN card, update details, track status, or link PAN with Aadhaar.",
    url: "https://www.onlineservices.nsdl.com/paam/endUserRegisterContact.html",
    category: "identity",
  },
  {
    id: "voter-id",
    title: "Voter Portal (NVSP / ECI)",
    description: "Register to vote, download e-EPIC card, search voter list name, or request corrections.",
    url: "https://voters.eci.gov.in/",
    category: "identity",
  },
  {
    id: "digilocker",
    title: "DigiLocker Portal",
    description: "Access and issue authentic electronic certificates like Marksheets, DL, and insurance records.",
    url: "https://www.digilocker.gov.in/",
    category: "identity",
  },
  // Transport
  {
    id: "parivahan-dl",
    title: "Driving Licence Services (Sarathi)",
    description: "Apply for Learner's/Permanent Driving Licence, renew DL, or add vehicle class endorsements.",
    url: "https://sarathi.parivahan.gov.in/",
    category: "transport",
  },
  {
    id: "parivahan-rc",
    title: "Vehicle RC Services (Vahan)",
    description: "Check RC details, transfer ownership, apply for fitness certificates or NOC.",
    url: "https://vahan.parivahan.gov.in/",
    category: "transport",
  },
  {
    id: "echallan",
    title: "e-Challan Transport Portal",
    description: "Check pending traffic violations, pay traffic e-challans, or submit dispute appeals.",
    url: "https://echallan.parivahan.gov.in/",
    category: "transport",
  },
  // Business
  {
    id: "gst-portal",
    title: "GST e-Filing Portal",
    description: "File monthly/quarterly GST returns, track refunds, register new GSTINs, or search tax rates.",
    url: "https://www.gst.gov.in/",
    category: "business",
  },
  {
    id: "income-tax",
    title: "Income Tax e-Filing Portal",
    description: "File Income Tax Returns (ITR), check refund status, verify e-Return, or link Aadhaar.",
    url: "https://www.incometax.gov.in/",
    category: "business",
  },
  {
    id: "udyam-msme",
    title: "Udyam MSME Registration",
    description: "Register small and micro enterprises online with zero cost to obtain official Udyam certificates.",
    url: "https://udyamregistration.gov.in/",
    category: "business",
  },
  // Welfare / General
  {
    id: "eshram",
    title: "e-Shram Portal",
    description: "National database of unorganized workers to avail central welfare schemes and insurance benefits.",
    url: "https://eshram.gov.in/",
    category: "welfare",
  },
];

const stateServices: ServiceItem[] = [
  // West Bengal
  {
    id: "wb-land",
    title: "Banglarbhumi Land Records",
    description: "Search land records, check mutation status, Khatian/Plot information in West Bengal.",
    url: "https://banglarbhumi.gov.in/",
    category: "welfare",
    state: "West Bengal",
  },
  {
    id: "wb-ration",
    title: "West Bengal Digital Ration Card",
    description: "Check Khadya Sathi ration card status, apply online, link Aadhaar with WB Ration.",
    url: "https://food.wb.gov.in/",
    category: "welfare",
    state: "West Bengal",
  },
  // Uttar Pradesh
  {
    id: "up-land",
    title: "Bhulekh Uttar Pradesh",
    description: "Check UP plot Khasra/Khatauni land records, verify register status, and registry copies.",
    url: "https://upbhulekh.gov.in/",
    category: "welfare",
    state: "Uttar Pradesh",
  },
  {
    id: "up-ration",
    title: "FCS UP Ration Card Portal",
    description: "Search UP ration card list online, check unit additions, or apply for new cards.",
    url: "https://fcs.up.gov.in/",
    category: "welfare",
    state: "Uttar Pradesh",
  },
  // Bihar
  {
    id: "bihar-land",
    title: "Bhumi Jankari Bihar",
    description: "Search Bihar land records, Jamabandi registration details, LPC, and mutation logs.",
    url: "http://biharbhumijankari.gov.in/",
    category: "welfare",
    state: "Bihar",
  },
  {
    id: "bihar-ration",
    title: "EPDS Bihar Ration Card",
    description: "Check Bihar ration list, download RC details, and verify monthly distributions.",
    url: "http://epds.bihar.gov.in/",
    category: "welfare",
    state: "Bihar",
  },
  // Maharashtra
  {
    id: "maha-land",
    title: "Mahabhulekh Land Records (7/12)",
    description: "Search Maharashtra 7/12 (Satbara) Utara, 8A, and property card details online.",
    url: "https://bhulekh.mahabhumi.gov.in/",
    category: "welfare",
    state: "Maharashtra",
  },
  // Karnataka
  {
    id: "karnataka-land",
    title: "Bhoomi Karnataka Land Portal",
    description: "Check RTC, Mutation status, survey maps, and dispute logs online in Karnataka.",
    url: "https://landrecords.karnataka.gov.in/",
    category: "welfare",
    state: "Karnataka",
  },
];

const statesList = [
  "All States",
  "Bihar",
  "Karnataka",
  "Maharashtra",
  "Uttar Pradesh",
  "West Bengal",
];

export default function GovtDirectory() {
  const [selectedCat, setSelectedCat] = useState<string>("all");
  const [selectedState, setSelectedState] = useState<string>("All States");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("bharatkits_bookmarks");
    if (saved) {
      setBookmarks(JSON.parse(saved));
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
    localStorage.setItem("bharatkits_bookmarks", JSON.stringify(updated));
  };

  const getFilteredServices = () => {
    let list = [...generalServices];
    
    // Add state specific services if they match the selected state
    if (selectedState !== "All States") {
      const match = stateServices.filter((s) => s.state === selectedState);
      list = [...list, ...match];
    } else {
      list = [...list, ...stateServices];
    }

    return list.filter((item) => {
      const matchesCat = selectedCat === "all" || item.category === selectedCat;
      const matchesSearch =
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesSearch;
    });
  };

  const filtered = getFilteredServices();

  return (
    <div className="space-y-6">
      {/* Search and Filters Header */}
      <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-grow max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search voter, aadhaar, challan, land record..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150 font-semibold"
            />
          </div>
          
          <div className="flex items-center gap-2 shrink-0">
            <MapPin className="w-4 h-4 text-brand-600 dark:text-brand-400" />
            <span className="text-xs font-bold text-slate-500">Filter State:</span>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: "all", label: "All Services" },
            { id: "identity", label: "Identity & KYC" },
            { id: "transport", label: "Transport & Driving" },
            { id: "business", label: "Taxes & Business" },
            { id: "welfare", label: "Citizen Welfare & Land" },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCat(cat.id)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap ${
                selectedCat === cat.id
                  ? "bg-brand-600 text-white shadow-sm"
                  : "bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 text-slate-500 border border-slate-200/40 dark:border-slate-800/40"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Services Grid */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-white/40 dark:bg-slate-950/20">
          <Landmark className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800 mb-3" />
          <p className="font-extrabold text-sm text-slate-800 dark:text-slate-300">No Services Found</p>
          <p className="text-xs text-slate-400 mt-1">Try changing category filters or searching another keyword.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => {
            const isBookmarked = bookmarks.includes(item.id);
            return (
              <div
                key={item.id}
                className="group relative utility-card p-6 rounded-3xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-all bg-white dark:bg-slate-900"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                      <span className="text-[9px] uppercase font-black tracking-widest text-slate-400 dark:text-slate-500">
                        Official Link
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => toggleBookmark(item.id, e)}
                      className="p-1 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-950 text-slate-400 transition-colors"
                      title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}
                    >
                      <Star
                        className={`w-4 h-4 ${
                          isBookmarked ? "text-amber-500 fill-amber-500" : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    </button>
                  </div>

                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-brand-650 dark:group-hover:text-brand-400 transition-colors">
                    {item.title}
                  </h3>
                  
                  {item.state && (
                    <span className="inline-block text-[8px] font-black uppercase tracking-wider text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-950/40 px-1.5 py-0.5 rounded mt-1.5">
                      {item.state} State
                    </span>
                  )}
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-2 mb-6">
                    {item.description}
                  </p>
                </div>

                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-xs font-bold text-brand-600 dark:text-brand-400 flex items-center gap-1 hover:gap-1.5 transition-all mt-auto"
                >
                  Visit Portal <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
