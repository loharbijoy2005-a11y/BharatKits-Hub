"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export function TirangaBanner() {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white select-none border-b border-orange-500/30">
      {/* Animated Waving Tricolor Gradient Background */}
      <div className="absolute inset-0 opacity-85 animate-tiranga-wave" />

      {/* Dark tint overlay for crystal-clear readability */}
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-[1px]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs">
        
        {/* Left Side: Patriotic Badge & Animated Ashoka Chakra */}
        <div className="flex items-center gap-2.5">
          <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
            {/* Spinning Ashoka Chakra SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-5 h-5 text-blue-700 dark:text-blue-400 animate-ashoka-spin drop-shadow-md"
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

          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-wide uppercase px-2 py-0.5 rounded-full bg-white/20 text-white text-[10px] backdrop-blur-md border border-white/30 shadow-xs">
              🇮🇳 JAI HIND
            </span>
            <span className="font-bold text-slate-100 hidden sm:inline-block">
              BharatKits Hub • Digital India Citizen &amp; Cafe Portal
            </span>
          </div>
        </div>

        {/* Center / Right Tagline */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-200">
          <span className="hidden md:flex items-center gap-1.5 text-amber-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            100% Free &amp; Encrypted Local Tools
          </span>
          <span className="hidden sm:inline text-white/50">•</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30 text-[10px] font-bold">
            ⚡ Live Scraping Active
          </span>
        </div>
      </div>

      {/* Bottom Tricolor Decorative Strip */}
      <div className="h-1 w-full grid grid-cols-3">
        <div className="bg-[#FF9933]" />
        <div className="bg-white" />
        <div className="bg-[#138808]" />
      </div>
    </div>
  );
}
