"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export function TirangaBanner() {
  return (
    <div className="relative overflow-hidden bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 select-none shadow-xs border-b border-slate-200 dark:border-slate-800">
      {/* Top Saffron Accent Line */}
      <div className="h-1 w-full bg-[#FF9933]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Side: Patriotic Badge & Title */}
        <div className="flex items-center gap-2.5">
          <span className="font-black tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 via-amber-100 to-emerald-600 text-slate-900 text-[10px] shadow-2xs border border-orange-300/40">
            🇮🇳 JAI HIND
          </span>
          <span className="font-bold text-slate-700 dark:text-slate-200 hidden sm:inline-block">
            BharatKits Hub • Digital India Citizen Portal
          </span>
        </div>

        {/* CENTER: Prominent Centered Spinning Ashoka Chakra Badge */}
        <div className="flex items-center justify-center p-1 rounded-full bg-blue-50/80 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 shadow-2xs mx-auto sm:mx-0">
          <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
            {/* Spinning 24-Spoke Navy Blue Ashoka Chakra SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-6 h-6 text-[#000080] dark:text-blue-400 animate-ashoka-spin drop-shadow-xs"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="6" />
              <circle cx="50" cy="50" r="8" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="3.5"
                />
              ))}
            </svg>
          </div>
        </div>

        {/* Right Tagline */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
          <span className="hidden md:flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
            100% Free Encrypted Local Tools
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-slate-700">•</span>
          <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300/60 dark:border-emerald-800/40 text-[10px] font-bold">
            ⚡ Live Scraping Active
          </span>
        </div>
      </div>

      {/* Bottom Emerald Green Accent Line */}
      <div className="h-1 w-full bg-[#138808]" />
    </div>
  );
}
