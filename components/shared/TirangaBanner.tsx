"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export function TirangaBanner() {
  return (
    <div className="relative overflow-hidden bg-slate-900 text-white select-none shadow-xs">
      {/* Static Crisp Background with 3-Stripe Indian Accent Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 opacity-95" />

      {/* Gentle Silk Sheen Light Animation across the banner */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 animate-tiranga-sheen" />
      </div>

      {/* Top Saffron Accent Line */}
      <div className="h-1 w-full bg-[#FF9933] relative z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Side: Patriotic Badge & Title */}
        <div className="flex items-center gap-2.5">
          <span className="font-extrabold tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 via-white to-emerald-600 text-slate-950 text-[10px] shadow-xs">
            🇮🇳 JAI HIND
          </span>
          <span className="font-bold text-slate-100 hidden sm:inline-block">
            BharatKits Hub • Digital India Citizen Portal
          </span>
        </div>

        {/* CENTER: Prominent Centered Spinning Ashoka Chakra Badge */}
        <div className="flex items-center gap-2 py-1 px-3.5 rounded-full bg-slate-950/80 border border-blue-500/40 shadow-md backdrop-blur-md mx-auto sm:mx-0">
          <div className="relative w-5 h-5 flex items-center justify-center shrink-0">
            {/* Spinning 24-Spoke Ashoka Chakra SVG */}
            <svg
              viewBox="0 0 100 100"
              className="w-5 h-5 text-blue-400 animate-ashoka-spin drop-shadow-md"
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
          <span className="text-[11px] font-black tracking-widest text-blue-200 uppercase">
            ASHOKA CHAKRA 🇮🇳
          </span>
        </div>

        {/* Right Tagline */}
        <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-200">
          <span className="hidden md:flex items-center gap-1.5 text-amber-300 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            100% Free Encrypted Local Tools
          </span>
          <span className="hidden sm:inline text-slate-600">•</span>
          <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-400/30 text-[10px] font-bold">
            ⚡ Live Scraping Active
          </span>
        </div>
      </div>

      {/* Bottom Emerald Green Accent Line */}
      <div className="h-1 w-full bg-[#138808] relative z-10" />
    </div>
  );
}
