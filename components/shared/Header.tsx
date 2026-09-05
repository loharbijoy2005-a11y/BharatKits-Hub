"use client";
import React, { useEffect, useState } from "react";
import { ShieldCheck, Sun, Moon, Search, X, Landmark, Sparkles } from "lucide-react";
import { TirangaBanner } from "./TirangaBanner";

interface HeaderProps {
  searchVal: string;
  onSearch: (val: string) => void;
  onGoHome: () => void;
  showSearch: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  size: number;
  color: string;
  delay: number;
}

interface PulseRing {
  id: number;
  x: number;
  y: number;
  color: string;
}

export function Header({ searchVal, onSearch, onGoHome, showSearch }: HeaderProps) {
  const [theme, setTheme] = useState<"light" | "dark">("light");
  const [particles, setParticles] = useState<Particle[]>([]);
  const [pulseRing, setPulseRing] = useState<PulseRing | null>(null);
  const [isRotating, setIsRotating] = useState(false);

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("omnikits_theme") as "light" | "dark") || "light";
      setTheme(savedTheme);
      if (savedTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleTheme = (e: React.MouseEvent<HTMLButtonElement>) => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    try {
      localStorage.setItem("omnikits_theme", nextTheme);
    } catch {
      // ignore
    }

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Trigger Icon Rotation
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 600);

    // Get click position for particle burst
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Palette depending on next theme
    const colors =
      nextTheme === "dark"
        ? ["#818cf8", "#c084fc", "#38bdf8", "#fbbf24", "#ffffff", "#6366f1"]
        : ["#f59e0b", "#f97316", "#10b981", "#ef4444", "#fbbf24", "#ea580c"];

    // Spawn Pulse Ring
    setPulseRing({
      id: Date.now(),
      x: centerX,
      y: centerY,
      color: nextTheme === "dark" ? "rgba(99, 102, 241, 0.4)" : "rgba(245, 158, 11, 0.4)",
    });

    // Generate 26 floating mini-particle blobs
    const newParticles: Particle[] = Array.from({ length: 26 }).map((_, index) => {
      const angle = (index / 26) * 2 * Math.PI + (Math.random() - 0.5) * 0.5;
      const distance = 80 + Math.random() * 140; // Floating radius
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance - 20; // Upward bias

      return {
        id: Date.now() + index,
        x: centerX,
        y: centerY,
        dx,
        dy,
        size: Math.floor(Math.random() * 10) + 5, // 5px to 15px
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 0.1,
      };
    });

    setParticles(newParticles);

    // Clean up particles after animation finishes
    setTimeout(() => {
      setParticles([]);
      setPulseRing(null);
    }, 900);
  };

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Particle Burst Overlay Portal */}
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[99999] overflow-hidden">
          {/* Expanding Radial Pulse Wave Ring */}
          {pulseRing && (
            <div
              className="absolute rounded-full border-2 animate-theme-ring pointer-events-none"
              style={{
                left: `${pulseRing.x}px`,
                top: `${pulseRing.y}px`,
                width: "120px",
                height: "120px",
                marginLeft: "-60px",
                marginTop: "-60px",
                borderColor: pulseRing.color,
                boxShadow: `0 0 40px ${pulseRing.color}`,
              }}
            />
          )}

          {/* Micro Particles Floating & Fading Away */}
          {particles.map((p) => (
            <div
              key={p.id}
              className="absolute rounded-full animate-theme-particle shadow-md"
              style={
                {
                  left: `${p.x}px`,
                  top: `${p.y}px`,
                  width: `${p.size}px`,
                  height: `${p.size}px`,
                  marginLeft: `-${p.size / 2}px`,
                  marginTop: `-${p.size / 2}px`,
                  backgroundColor: p.color,
                  boxShadow: `0 0 12px ${p.color}`,
                  "--dx": `${p.dx}px`,
                  "--dy": `${p.dy}px`,
                  animationDelay: `${p.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Animated Waving Indian Tricolor Banner */}
      <TirangaBanner />

      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-xs transition-colors duration-400">
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
              <span className="font-black text-xl tracking-tight text-slate-900 dark:text-white transition-colors duration-400">
                Bharat<span className="text-orange-600 dark:text-orange-400">Kits</span>
              </span>
              <span className="text-[9px] font-extrabold tracking-widest text-slate-500 dark:text-slate-400 uppercase transition-colors duration-400">
                Digital India Hub 🇮🇳
              </span>
            </div>
          </button>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            <a
              href="https://github.com/loharbijoy2005-a11y/BharatKits-Hub"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 transition-all shadow-xs"
              title="View GitHub Repository"
            >
              <span className="text-sm">⭐</span>
              <span>GitHub</span>
            </a>

            {/* Interactive Theme Toggle Button with Particle Sparkle Effect */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle dark mode"
              title={`Switch to ${theme === "dark" ? "Light" : "Dark"} Mode`}
              className="relative w-11 h-11 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-amber-100 dark:hover:bg-slate-700 flex items-center justify-center border border-slate-300 dark:border-slate-700 transition-all duration-300 shadow-md group overflow-hidden"
            >
              <div
                className={`transition-transform duration-500 ease-out ${
                  isRotating ? "rotate-[360deg] scale-125" : "group-hover:scale-110"
                }`}
              >
                {theme === "dark" ? (
                  <Sun className="w-5 h-5 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]" />
                ) : (
                  <Moon className="w-5 h-5 text-slate-800 drop-shadow-[0_0_6px_rgba(30,41,59,0.3)]" />
                )}
              </div>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
