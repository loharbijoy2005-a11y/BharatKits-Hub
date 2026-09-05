"use client";
import React, { useEffect, useState } from "react";

interface GovLoadingBarProps {
  isLoading: boolean;
}

export function GovLoadingBar({ isLoading }: GovLoadingBarProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLoading) {
      setProgress(25);
      timer = setTimeout(() => setProgress(85), 60);
    } else {
      setProgress(100);
      timer = setTimeout(() => setProgress(0), 200);
    }
    return () => clearTimeout(timer);
  }, [isLoading]);

  if (progress === 0 && !isLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy={isLoading}
      className="fixed top-0 left-0 right-0 z-[99999] h-[3px] bg-transparent pointer-events-none overflow-hidden"
    >
      <span className="sr-only">
        {isLoading ? "Updating portal view..." : "Portal view updated"}
      </span>
      <div
        className="h-full bg-gradient-to-r from-[#FF9933] via-amber-500 to-[#138808] transition-all duration-150 cubic-bezier(0.16, 1, 0.3, 1) shadow-[0_0_8px_rgba(249,115,22,0.6)]"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1,
        }}
      />
    </div>
  );
}
