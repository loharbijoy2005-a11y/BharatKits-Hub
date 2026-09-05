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
        <div className="flex items-center justify-center p-2 rounded-full bg-blue-950/90 border border-blue-600/60 shadow-lg shadow-blue-950/50">
          <div className="relative w-8 h-8 flex items-center justify-center shrink-0">
            <svg
              viewBox="0 0 100 100"
              className="w-8 h-8 text-blue-300 animate-ashoka-spin drop-shadow-[0_0_6px_rgba(147,197,253,0.8)]"
              fill="currentColor"
            >
              <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="5" />
              <circle cx="50" cy="50" r="7" fill="currentColor" />
              {Array.from({ length: 24 }).map((_, i) => (
                <line
                  key={i}
                  x1="50"
                  y1="50"
                  x2={50 + 40 * Math.cos((i * 15 * Math.PI) / 180)}
                  y2={50 + 40 * Math.sin((i * 15 * Math.PI) / 180)}
                  stroke="currentColor"
                  strokeWidth="3"
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
