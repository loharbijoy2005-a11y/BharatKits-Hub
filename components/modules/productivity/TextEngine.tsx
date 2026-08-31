"use client";
import React, { useState, useEffect } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { FileText, Copy, Check, Trash2, Search, ArrowRightLeft } from "lucide-react";

export default function TextEngine() {
  const [text, setText] = useState<string>("");
  const [copied, setCopied] = useState<boolean>(false);

  // Stats
  const [stats, setStats] = useState({
    words: 0,
    charsWithSpace: 0,
    charsNoSpace: 0,
    sentences: 0,
    paragraphs: 0,
    readingTime: "0 sec",
  });

  // Regex Search and Replace
  const [findPattern, setFindPattern] = useState<string>("");
  const [replacePattern, setReplacePattern] = useState<string>("");
  const [isRegex, setIsRegex] = useState<boolean>(false);
  const [caseInsensitive, setCaseInsensitive] = useState<boolean>(true);

  // Settle Stats
  useEffect(() => {
    const trimmed = text.trim();
    const words = trimmed === "" ? 0 : trimmed.split(/\s+/).filter((w) => w.length > 0).length;
    const charsWithSpace = text.length;
    const charsNoSpace = text.replace(/\s/g, "").length;
    const sentences = trimmed === "" ? 0 : text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length;
    const paragraphs = trimmed === "" ? 0 : text.split(/\n+/).filter((p) => p.trim().length > 0).length;

    const readSeconds = Math.round((words / 200) * 60);
    let readingTime = "0 sec";
    if (readSeconds > 0) {
      if (readSeconds < 60) {
        readingTime = `${readSeconds} sec`;
      } else {
        const m = Math.floor(readSeconds / 60);
        const s = readSeconds % 60;
        readingTime = `${m}m ${s}s`;
      }
    }

    setStats({
      words,
      charsWithSpace,
      charsNoSpace,
      sentences,
      paragraphs,
      readingTime,
    });
  }, [text]);

  // Transforms
  const handleUppercase = () => {
    setText((prev) => prev.toUpperCase());
  };

  const handleLowercase = () => {
    setText((prev) => prev.toLowerCase());
  };

  const handleTitleCase = () => {
    setText((prev) =>
      prev.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase())
    );
  };

  const handleCamelCase = () => {
    setText((prev) => {
      const clean = prev.replace(/[^a-zA-Z0-9\s]/g, "");
      return clean
        .split(/\s+/)
        .filter((w) => w.length > 0)
        .map((word, idx) => {
          if (idx === 0) return word.toLowerCase();
          return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        })
        .join("");
    });
  };

  const handleKebabCase = () => {
    setText((prev) => {
      return prev
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 0)
        .join("-");
    });
  };

  const handleSnakeCase = () => {
    setText((prev) => {
      return prev
        .toLowerCase()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .split(/\s+/)
        .filter((w) => w.length > 0)
        .join("_");
    });
  };

  const handleSentenceCase = () => {
    setText((prev) => {
      if (!prev) return "";
      return prev
        .toLowerCase()
        .replace(/(^\s*|[.!?]\s+)([a-z])/g, (m, p1, p2) => p1 + p2.toUpperCase());
    });
  };

  const handleReplace = () => {
    if (!findPattern) return;

    try {
      let regex: RegExp;
      if (isRegex) {
        const flags = "g" + (caseInsensitive ? "i" : "");
        regex = new RegExp(findPattern, flags);
      } else {
        // Escape literal search string
        const escaped = findPattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        const flags = "g" + (caseInsensitive ? "i" : "");
        regex = new RegExp(escaped, flags);
      }

      setText((prev) => prev.replace(regex, replacePattern));
    } catch (err: any) {
      alert("Invalid search expression: " + err.message);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setText("");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Editor Area */}
      <div className="lg:col-span-8 space-y-4">
        <div className="utility-card border rounded-3xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-400">
              Content Stream
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                disabled={!text}
                className="text-xs font-semibold text-slate-500 hover:text-brand-600 transition-colors border border-slate-200 dark:border-slate-800 hover:border-brand-500 px-3 py-1.5 rounded-lg flex items-center gap-1 bg-slate-50 dark:bg-slate-900 disabled:opacity-40"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                Copy Output
              </button>
              <button
                onClick={handleClear}
                disabled={!text}
                className="text-xs font-semibold text-red-500 hover:text-red-750 transition-colors border border-slate-200 dark:border-slate-800 hover:border-red-500 px-3 py-1.5 rounded-lg flex items-center gap-1 bg-slate-50 dark:bg-slate-900 disabled:opacity-40"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Clear
              </button>
            </div>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type or paste your markdown, logs, code, or article values here..."
            rows={12}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-y leading-relaxed font-semibold placeholder:text-slate-400 dark:placeholder:text-slate-700 text-slate-805 dark:text-slate-150"
          />
        </div>

        {/* Find and replace module */}
        <div className="utility-card border rounded-3xl p-5 shadow-sm space-y-4">
          <h4 className="text-xs font-extrabold uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
            <Search className="w-4 h-4" /> Find & Replace Regex Engine
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Search target</span>
              <input
                type="text"
                placeholder="Find value"
                value={findPattern}
                onChange={(e) => setFindPattern(e.target.value)}
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150"
              />
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase font-bold">Replace target</span>
              <input
                type="text"
                placeholder="Replace value"
                value={replacePattern}
                onChange={(e) => setReplacePattern(e.target.value)}
                className="w-full mt-1.5 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <div className="flex gap-4">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={isRegex}
                  onChange={(e) => setIsRegex(e.target.checked)}
                  className="w-3.5 h-3.5 text-brand-600 rounded border-slate-350 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-500 font-bold">Use Regex</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={caseInsensitive}
                  onChange={(e) => setCaseInsensitive(e.target.checked)}
                  className="w-3.5 h-3.5 text-brand-600 rounded border-slate-350 focus:ring-brand-500"
                />
                <span className="text-xs text-slate-500 font-bold">Case Insensitive</span>
              </label>
            </div>
            
            <Button
              size="sm"
              disabled={!findPattern || !text}
              onClick={handleReplace}
              className="flex items-center gap-1"
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> Execute Replace All
            </Button>
          </div>
        </div>
      </div>

      {/* Control Console & stats Side */}
      <div className="lg:col-span-4 space-y-6">
        {/* Case switches */}
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Case Transforms
          </h3>
          <div className="flex flex-col gap-2">
            {[
              { name: "UPPERCASE", handler: handleUppercase },
              { name: "lowercase", handler: handleLowercase },
              { name: "Title Case", handler: handleTitleCase },
              { name: "camelCase", handler: handleCamelCase },
              { name: "kebab-case", handler: handleKebabCase },
              { name: "snake_case", handler: handleSnakeCase },
              { name: "Sentence case", handler: handleSentenceCase },
            ].map((item) => (
              <button
                key={item.name}
                onClick={item.handler}
                disabled={!text}
                className="w-full py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-950 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-xs rounded-xl text-slate-700 dark:text-slate-300 transition-all hover:border-brand-500 disabled:opacity-40 disabled:pointer-events-none"
              >
                {item.name}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Metrics */}
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Analysis Report
          </h3>
          <div className="space-y-3.5 text-xs font-semibold text-slate-500">
            <div className="flex justify-between items-center">
              <span>Words</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-205">{stats.words}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Characters (with spaces)</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-205">{stats.charsWithSpace}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Characters (no spaces)</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-205">{stats.charsNoSpace}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Sentences</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-205">{stats.sentences}</span>
            </div>
            <div className="flex justify-between items-center">
              <span>Paragraphs</span>
              <span className="font-extrabold text-slate-800 dark:text-slate-205">{stats.paragraphs}</span>
            </div>
            <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/40 flex justify-between items-center">
              <span className="font-bold">Est. Reading Time</span>
              <span className="font-black text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/40 px-2.5 py-0.5 rounded-lg">
                {stats.readingTime}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
