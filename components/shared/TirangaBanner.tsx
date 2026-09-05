"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export function TirangaBanner() {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white select-none shadow-sm border-b border-slate-800">
      {/* Top Saffron Accent Line */}
      <div className="h-1.5 w-full bg-[#FF9933]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-10 flex items-center justify-between gap-3 text-xs">
        
        {/* Left Side: Patriotic Badge & Title */}
        <div className="flex items-center gap-2.5">
          <span className="font-black tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 text-slate-950 text-[10px] shadow-sm font-extrabold">
            🇮🇳 JAI HIND
          </span>
          <span className="font-extrabold text-white tracking-wide text-xs hidden sm:inline-block">
            BharatKits Hub • Digital India Citizen Portal
          </span>
        </div>

        {/* CENTER: Prominent Centered Spinning Navy Ashoka Chakra Badge */}
        <div className="flex items-center justify-center p-1.5 rounded-full bg-blue-950/80 border border-blue-700/80 shadow-md">
          <div className="relative w-6 h-6 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 100 100"
              className="w-6 h-6 text-blue-400 animate-ashoka-spin drop-shadow-sm"
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
        <div className="flex items-center gap-2 text-xs font-black text-amber-300">
          <span className="hidden md:flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            100% Free Encrypted Citizen Utility Hub
          </span>
        </div>
      </div>

      {/* Bottom Emerald Green Accent Line */}
      <div className="h-1.5 w-full bg-[#138808]" />
    </div>
  );
}
