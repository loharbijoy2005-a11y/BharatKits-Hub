"use client";
import React, { useEffect, useState } from "react";
import { ShieldCheck, Sun, Moon, Search, X, Landmark } from "lucide-react";

interface HeaderProps {
  searchVal: string;
  onSearch: (val: string) => void;
  onGoHome: () => void;
  showSearch: boolean;
}

export function Header({ searchVal, onSearch, onGoHome, showSearch }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const savedTheme =
      (localStorage.getItem("omnikits_theme") as "light" | "dark") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
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
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-850 shadow-sm transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <button
          onClick={onGoHome}
          className="flex items-center gap-2 group shrink-0 focus:outline-none"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-500 via-slate-400 to-emerald-600 flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
            <Landmark className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-orange-600 via-slate-400 to-emerald-600 dark:from-orange-400 dark:to-emerald-450 bg-clip-text text-transparent">
            BharatKits
          </span>
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
            placeholder="Search citizen tools... (e.g. Aadhaar, photo resize, challan)"
            className="w-full pl-10 pr-10 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 dark:focus:border-brand-400 transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600 text-slate-800 dark:text-slate-100"
          />
          {searchVal && (
            <button
              onClick={() => onSearch("")}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-650 dark:hover:text-slate-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-250/50 dark:border-emerald-900/30 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 select-none">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            100% Client-Side Privacy
          </span>
          
          <button
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="w-10 h-10 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 flex items-center justify-center text-lg border border-transparent hover:border-slate-250/50 dark:hover:border-slate-700/50 transition-all text-slate-600 dark:text-slate-400"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}
