"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Languages, Copy, Check, Trash2, Sparkles, HelpCircle, RefreshCw } from "lucide-react";

// Convert Unicode Hindi to Kruti Dev 010 Legacy Font (PURS FUNCTION)
const unicodeToKrutiDev = (unicodeStr: string): string => {
  if (!unicodeStr.trim()) {
    return "";
  }

  let text = unicodeStr;

  // Mapping arrays
  const array_one = [
    "क़", "ख़", "ग़", "ज़", "ड़", "ढ़", "फ़",
    "ॐ", "कृ", "क्र", "ष्ट", "ष्ठ", "ज्ञ", "द्व", "द्य", "द्व", "श्र", "दृ", "त्त", "रु", "रू",
    "ऑ", "ॉ", "ो", "ौ", "ा", "ी", "ु", "ू", "ृ", "े", "ै", "ं", "ँ", "ः", "ाँ",
    "अ", "आ", "इ", "ई", "उ", "ऊ", "ए", "ऐ", "ओ", "औ",
    "क", "ख", "ग", "घ", "ङ",
    "च", "छ", "ज", "झ", "ञ",
    "ट", "ठ", "ड", "ढ", "ण",
    "त", "थ", "द", "ध", "न",
    "प", "फ", "ब", "भ", "म",
    "य", "र", "ल", "व", "श", "ष", "स", "ह",
    "१", "२", "३", "४", "५", "६", "७", "८", "९", "०",
    "।"
  ];

  const array_two = [
    "d+", "[k+", "x+", "t+", "M+", "<-+", "Q+",
    "vksE", "—", "Ø", "\"V", "B", "K", "n~o", "|", "n~o", "J", "–", "Ùk", "#", "yw",
    "vkW", "kW", "ks", "kS", "k", "h", "q", "w", "`", "s", "S", "a", "¡", "%", "k¡",
    "v", "vk", "b", "bZ", "m", "Å", "s", "S", "vks", "vksS",
    "d", "[k", "x", "?k", "³",
    "p", "N", "t", "÷", "¥",
    "V", "B", "M", "<", "`.k",
    "r", "Fk", "n", "èk", "u",
    "i", "Q", "c", "Hk", "e",
    ";", "j", "y", "o", "'k", "[k", "l", "g",
    "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
    "t"
  ];

  // Swapping choti ee 'ि' rules (Kruti Dev types 'ि' BEFORE the letter)
  text = text.replace(/([क-ह]़?्?)([क-ह]़?्?)(ि)/g, "f$1$2");
  text = text.replace(/([क-ह]़?्?)(ि)/g, "f$1");
  text = text.replace(/([क-ह]़?्?)([क-ह]़?्?)(ी)/g, "$1$2h");
  text = text.replace(/([क-ह]़?्?)(ी)/g, "$1h");

  // Replace half consonants
  const halfConsonants: { [key: string]: string } = {
    "क्": "D", "ख्": "[", "ग्": "X", "घ्": "?",
    "च्": "P", "ज्": "T", "झ्": "÷k",
    "त्": "R", "थ्": "F", "ध्": "è", "न्": "U",
    "प्": "I", "ब्": "C", "भ्": "H", "म्": "E",
    "ल्": "Y", "व्": "O", "श्": "'", "ष्": "\\", "स्": "L"
  };

  Object.keys(halfConsonants).forEach((half) => {
    text = text.split(half).join(halfConsonants[half]);
  });

  // Replace full characters
  for (let i = 0; i < array_one.length; i++) {
    text = text.split(array_one[i]).join(array_two[i]);
  }

  // Refine Reph (half 'र' coming after a letter, rendered at top)
  text = text.replace(/र्([क-ह])/g, "$1Z");

  return text;
};

export default function HindiFontConverter() {
  const [inputText, setInputText] = useState<string>("");
  const [transliteratedText, setTransliteratedText] = useState<string>("");
  const [mode, setMode] = useState<"transliterate" | "kruti">("transliterate");
  const [copied, setCopied] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Helper for JSONP calls to bypass CORS block
  const jsonpTransliterate = (text: string): Promise<unknown> => {
    return new Promise((resolve, reject) => {
      if (typeof window === "undefined") {
        reject(new Error("Window is undefined"));
        return;
      }
      const callbackName = `googleInputToolsCallback_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
      
      // @ts-expect-error register dynamic global callback
      window[callbackName] = (data: unknown) => {
        resolve(data);
        cleanup();
      };

      const script = document.createElement("script");
      script.src = `https://inputtools.google.com/request?text=${encodeURIComponent(
        text
      )}&itc=hi-t-i0-und&num=1&cb=${callbackName}`;
      script.async = true;
      
      const cleanup = () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
        // @ts-expect-error delete dynamic global callback
        delete window[callbackName];
      };

      script.onerror = (err) => {
        reject(err);
        cleanup();
      };

      document.body.appendChild(script);
    });
  };

  // Transliterate Hinglish to Hindi using free Google API via JSONP
  const transliterateHinglish = async (text: string) => {
    if (!text.trim()) {
      setTransliteratedText("");
      return;
    }
    setLoading(true);
    try {
      const data = (await jsonpTransliterate(text)) as [string, Array<[string, string[]]>];
      if (data && data[0] === "SUCCESS") {
        const words = data[1] as Array<[string, string[]]>;
        const result = words
          .map((wordArr) => {
            const suggestions = wordArr[1];
            return suggestions && suggestions.length > 0 ? suggestions[0] : wordArr[0];
          })
          .join(" ");
        // Preserve newlines if multiple paragraphs
        const lines = text.split("\n");
        let wordIdx = 0;
        const reconstituted = lines
          .map((line) => {
            const lineWordCount = line.split(/\s+/).filter((w) => w.length > 0).length;
            const lineWords = words.slice(wordIdx, wordIdx + lineWordCount);
            wordIdx += lineWordCount;
            return lineWords.map((w) => (w[1] && w[1].length > 0 ? w[1][0] : w[0])).join(" ");
          })
          .join("\n");

        setTransliteratedText(reconstituted || result);
      }
    } catch (err) {
      console.error("Transliteration API failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTransliterateClick = () => {
    if (mode === "transliterate") {
      transliterateHinglish(inputText);
    }
  };

  // Derive output text during render to satisfy ESLint
  const outputText = mode === "kruti" ? unicodeToKrutiDev(inputText) : transliteratedText;

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setInputText("");
    setTransliteratedText("");
  };

  return (
    <div className="space-y-6">
      {/* Mode Selector pills */}
      <div className="flex gap-2 p-1 bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-200/30 dark:border-slate-800/30 w-fit">
        <button
          onClick={() => {
            setMode("transliterate");
            handleClear();
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
            mode === "transliterate"
              ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
              : "text-slate-500 hover:text-slate-950 dark:hover:text-slate-200"
          }`}
        >
          Hinglish to Hindi (Phonetic)
        </button>
        <button
          onClick={() => {
            setMode("kruti");
            handleClear();
          }}
          className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
            mode === "kruti"
              ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
              : "text-slate-500 hover:text-slate-950 dark:hover:text-slate-200"
          }`}
        >
          Hindi Unicode to Kruti Dev 010
        </button>
      </div>

      {/* Editor Main Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
        
        {/* INPUT BOX */}
        <div className="utility-card p-5 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              {mode === "transliterate" ? "English / Hinglish Input" : "Hindi Unicode Input"}
            </span>
            <button
              onClick={handleClear}
              disabled={!inputText}
              className="text-[10px] text-red-500 font-extrabold hover:text-red-700 disabled:opacity-40 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" /> clear
            </button>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={
              mode === "transliterate"
                ? "Type Hinglish phonetic words (e.g., 'mera bharat mahan' then click convert)..."
                : "Paste normal Hindi Unicode text here (e.g., 'मेरा भारत महान')..."
            }
            rows={10}
            className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-y leading-relaxed font-semibold placeholder:text-slate-400 text-slate-805 dark:text-slate-200"
          />

          {mode === "transliterate" && (
            <Button
              onClick={handleTransliterateClick}
              disabled={loading || !inputText}
              className="w-full py-2.5 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Translating...
                </>
              ) : (
                <>
                  <Languages className="w-4 h-4" /> Convert to Hindi Unicode
                </>
              )}
            </Button>
          )}
        </div>

        {/* OUTPUT BOX */}
        <div className="utility-card p-5 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <span className="text-xs font-black uppercase text-slate-400 tracking-wider">
              {mode === "transliterate" ? "Hindi Unicode Output" : "Kruti Dev 010 Output (Legacy)"}
            </span>
            <button
              onClick={handleCopy}
              disabled={!outputText}
              className="text-[10px] text-brand-600 hover:text-brand-700 disabled:opacity-40 font-extrabold flex items-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />} copy
            </button>
          </div>

          <textarea
            value={outputText}
            readOnly
            placeholder={
              mode === "transliterate"
                ? "Converted Devanagari Hindi text will appear here..."
                : "Converted Kruti Dev legacy characters will appear here. Note: Apply 'Kruti Dev 010' font in MS Word/Excel to read."
            }
            rows={10}
            className={`w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950/40 text-sm focus:outline-none resize-y leading-relaxed font-semibold text-slate-805 dark:text-slate-200 ${
              mode === "kruti" ? "font-mono" : ""
            }`}
          />

          {mode === "kruti" && (
            <div className="bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 p-3 rounded-2xl flex gap-2.5 items-start">
              <HelpCircle className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                <span className="font-extrabold text-slate-650 dark:text-slate-350 block mb-0.5">How to use Kruti Dev Output:</span>
                Copy this output, paste it in MS Word, and select **Kruti Dev 010** font. It will instantly format back into perfect Hindi! Useful for government database uploads.
              </div>
            </div>
          )}

          {mode === "transliterate" && (
            <div className="bg-brand-50/40 dark:bg-brand-950/15 border border-brand-100/50 dark:border-brand-950/40 p-3 rounded-2xl flex gap-2.5 items-start">
              <Sparkles className="w-4 h-4 text-brand-500 shrink-0 mt-0.5" />
              <div className="text-[10px] text-slate-400 font-semibold leading-relaxed">
                Phonetic conversion lets you type Hindi in English letters (e.g. typing &apos;namaskar&apos; yields &apos;नमस्कार&apos;). Fast and easy regional typing!
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
