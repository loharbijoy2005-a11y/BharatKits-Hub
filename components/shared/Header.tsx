"use client";
import React, { useEffect, useState } from "react";
import { ShieldCheck, Sun, Moon, Search, X, Landmark } from "lucide-react";
import { TirangaBanner } from "./TirangaBanner";

interface HeaderProps {
  searchVal: string;
  onSearch: (val: string) => void;
  onGoHome: () => void;
  showSearch: boolean;
}

export function Header({ searchVal, onSearch, onGoHome, showSearch }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Clear any legacy dark setting if user previously opened dark mode
    const savedTheme = (localStorage.getItem("omnikits_theme") as "light" | "dark") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem("omnikits_theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Animated Waving Indian Tricolor Banner */}
      <TirangaBanner />

      <div className="glass border-b border-orange-500/20 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button
            onClick={onGoHome}
            className="flex items-center gap-2.5 group shrink-0 focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-amber-500 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform border border-amber-300/40">
              <Landmark className="w-5.5 h-5.5 text-white" />
            </div>
            <div className="flex flex-col text-left">
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-orange-600 via-slate-800 to-emerald-700 dark:from-orange-400 dark:via-slate-100 dark:to-emerald-400 bg-clip-text text-transparent">
                BharatKits
              </span>
              <span className="text-[9px] font-extrabold tracking-widest text-slate-400 uppercase">
                Digital India Hub 🇮🇳
              </span>
            </div>
          </button>

          {/* Search Bar (Shared element inside Header) */}
          <div className={`relative max-w-md w-full transition-opacity duration-200 ${showSearch ? "opacity-100" : "opacity-30 pointer-events-none"}`}>
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400 dark:text-slate-500">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="search"
              value={searchVal}
              disabled={!showSearch}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search citizen tools... (e.g. Sarkari job, photo resize, Aadhaar, PAN)"
              className="w-full pl-10 pr-10 py-2 rounded-xl border border-orange-500/30 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/40 focus:border-orange-500 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-slate-900 dark:text-slate-100 shadow-xs"
            />
            {searchVal && (
              <button
                onClick={() => onSearch("")}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300/60 dark:border-emerald-800/40 text-[11px] font-bold text-emerald-800 dark:text-emerald-300 select-none shadow-2xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              100% Encrypted Local Processing
            </span>
            
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              className="w-10 h-10 rounded-xl hover:bg-orange-50 dark:hover:bg-slate-800/80 flex items-center justify-center text-lg border border-orange-200/50 dark:border-slate-700/50 transition-all text-slate-700 dark:text-slate-300 shadow-2xs"
            >
              {theme === "dark" ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
