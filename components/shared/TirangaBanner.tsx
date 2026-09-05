"use client";
import React from "react";
import { Sparkles } from "lucide-react";

export function TirangaBanner() {
  return (
    <div className="relative overflow-hidden select-none shadow-sm">
      {/* TOP: Saffron stripe */}
      <div className="h-1.5 w-full bg-[#FF9933]" />

      {/* MIDDLE: White background — TRUE tricolor */}
      <div className="bg-white w-full py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-3 items-center">

          {/* COL 1 — LEFT: JAI HIND badge + Portal title */}
          <div className="flex items-center gap-2">
            <span className="font-black tracking-wide uppercase px-2.5 py-0.5 rounded-md bg-gradient-to-r from-orange-500 via-amber-400 to-emerald-500 text-white text-[10px] shadow-sm border border-amber-300/80 ring-1 ring-orange-500/30 shrink-0">
              🇮🇳 JAI HIND
            </span>
            <span className="font-extrabold text-slate-800 tracking-wide text-[11px] hidden sm:inline-block">
              BharatKits Hub • Digital India Citizen Portal
            </span>
          </div>

          {/* COL 2 — CENTER: Ashoka Chakra (perfectly centered) */}
          <div className="flex items-center justify-center">
            <div className="p-2 rounded-full bg-blue-50 border border-blue-200 shadow-sm">
              <svg
                viewBox="0 0 100 100"
                className="w-8 h-8 text-[#000080] animate-ashoka-spin"
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

          {/* COL 3 — RIGHT: Encrypted tagline */}
          <div className="flex items-center justify-end gap-1.5 text-[11px] font-bold text-slate-600">
            <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-pulse shrink-0" />
            <span className="hidden sm:inline">100% Free Encrypted Citizen Utility Hub</span>
          </div>

        </div>
      </div>

      {/* BOTTOM: Green stripe */}
      <div className="h-1.5 w-full bg-[#138808]" />
    </div>
  );
}
