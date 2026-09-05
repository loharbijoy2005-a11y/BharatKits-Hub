"use client";
import React, { useState, useEffect, useRef } from "react";
import { CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar as CalendarIcon, Cake, Gift, CalendarDays, ChevronLeft, ChevronRight, Check, Compass, Sparkles, Sun } from "lucide-react";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

interface ZodiacDetail {
  name: string;
  rashiName: string;
  icon: string;
  element: string;
  rulingPlanet: string;
}

/**
 * Smart Date Parser for Indian & ISO Formats.
 * Correctly interprets 12.10.2005 or 12/10/2005 as 12th October 2005 (Day: 12, Month: 10).
 */
function parseDateSmart(input: string): { year: number; month: number; day: number } | null {
  if (!input || !input.trim()) return null;
  const s = input.trim();

  // Pattern 1: YYYY-MM-DD or YYYY/MM/DD or YYYY.MM.DD
  if (/^\d{4}[-/. ]\d{1,2}[-/. ]\d{1,2}$/.test(s)) {
    const parts = s.split(/[-/. ]/);
    const y = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const d = parseInt(parts[2], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= 2100) {
      return { year: y, month: m, day: d };
    }
  }

  // Pattern 2: DD.MM.YYYY or DD/MM/YYYY or DD-MM-YYYY (Indian Standard)
  if (/^\d{1,2}[-/. ]\d{1,2}[-/. ]\d{4}$/.test(s)) {
    const parts = s.split(/[-/. ]/);
    const d = parseInt(parts[0], 10);
    const m = parseInt(parts[1], 10);
    const y = parseInt(parts[2], 10);
    if (m >= 1 && m <= 12 && d >= 1 && d <= 31 && y >= 1900 && y <= 2100) {
      return { year: y, month: m, day: d };
    }
  }

  return null;
}

function formatIso(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  return `${year}-${mm}-${dd}`;
}

function formatIndianDisplay(year: number, month: number, day: number): string {
  const mm = String(month).padStart(2, "0");
  const dd = String(day).padStart(2, "0");
  const monthName = MONTH_NAMES[month - 1] || "";
  return `${dd} ${monthName} ${year} (${dd}.${mm}.${year})`;
}

interface CalendarDatePickerProps {
  label: string;
  id: string;
  value: string; // ISO format YYYY-MM-DD
  onChange: (isoValue: string) => void;
}

function CalendarDatePicker({ label, id, value, onChange }: CalendarDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  const parsed = parseDateSmart(value);
  const currentYear = new Date().getFullYear();

  const dayVal = parsed ? parsed.day : "";
  const monthVal = parsed ? parsed.month : "";
  const yearVal = parsed ? parsed.year : "";

  const [viewYear, setViewYear] = useState<number>(parsed ? parsed.year : currentYear);
  const [viewMonth, setViewMonth] = useState<number>(parsed ? parsed.month - 1 : new Date().getMonth());

  useEffect(() => {
    if (parsed) {
      const dd = String(parsed.day).padStart(2, "0");
      const mm = String(parsed.month).padStart(2, "0");
      setRawText(`${dd}.${mm}.${parsed.year}`);
    } else {
      setRawText("");
    }
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const updateDate = (y: number, m: number, d: number) => {
    const iso = formatIso(y, m, d);
    onChange(iso);
    setViewYear(y);
    setViewMonth(m - 1);
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value;
    setRawText(text);
    const res = parseDateSmart(text);
    if (res) {
      updateDate(res.year, res.month, res.day);
    }
  };

  const handleDaySelect = (d: number) => {
    const mVal = monthVal || (viewMonth + 1);
    const yVal = yearVal || viewYear;
    updateDate(Number(yVal), Number(mVal), d);
  };

  const handleMonthSelect = (m: number) => {
    const dVal = dayVal || 1;
    const yVal = yearVal || viewYear;
    updateDate(Number(yVal), m, Number(dVal));
  };

  const handleYearSelect = (y: number) => {
    const dVal = dayVal || 1;
    const mVal = monthVal || (viewMonth + 1);
    updateDate(y, Number(mVal), Number(dVal));
  };

  const daysInViewMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInViewMonth; d++) {
    daysArray.push(d);
  }

  const yearsOptions = [];
  for (let y = 2030; y >= 1920; y--) {
    yearsOptions.push(y);
  }

  return (
    <div className="space-y-2 relative" ref={popoverRef}>
      <label htmlFor={id} className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wide flex items-center justify-between">
        <span>{label}</span>
        <span className="text-[10px] text-brand-600 dark:text-brand-400 font-medium lowercase">Format: DD.MM.YYYY</span>
      </label>

      <div className="space-y-2">
        <div className="flex gap-2">
          <input
            type="text"
            id={id}
            placeholder="e.g. 12.10.2005"
            value={rawText}
            onChange={handleTextInputChange}
            className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-500/50 shadow-sm"
          />

          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className={`px-3.5 py-2.5 rounded-xl border font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm ${
              isOpen
                ? "bg-brand-600 text-white border-brand-600"
                : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700"
            }`}
            title="Open Interactive Calendar Widget"
          >
            <CalendarIcon className="w-4 h-4" />
            <span className="hidden sm:inline">Calendar</span>
          </button>
        </div>

        {/* Dropdowns for Explicit DD / MM / YYYY */}
        <div className="grid grid-cols-3 gap-2">
          <select
            value={dayVal}
            onChange={(e) => handleDaySelect(Number(e.target.value))}
            className="px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="" disabled>Day (DD)</option>
            {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
              <option key={d} value={d}>
                {String(d).padStart(2, "0")}
              </option>
            ))}
          </select>

          <select
            value={monthVal}
            onChange={(e) => handleMonthSelect(Number(e.target.value))}
            className="px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="" disabled>Month (MM)</option>
            {MONTH_NAMES.map((name, idx) => (
              <option key={name} value={idx + 1}>
                {name} ({String(idx + 1).padStart(2, "0")})
              </option>
            ))}
          </select>

          <select
            value={yearVal}
            onChange={(e) => handleYearSelect(Number(e.target.value))}
            className="px-2.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
          >
            <option value="" disabled>Year (YYYY)</option>
            {yearsOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {parsed ? (
        <div className="p-2.5 px-3 rounded-xl bg-brand-50 dark:bg-brand-950/40 border border-brand-200 dark:border-brand-800/60 text-xs text-brand-700 dark:text-brand-300 font-medium flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-brand-600 dark:text-brand-400 shrink-0" />
            <span>Selected Date: <strong>{formatIndianDisplay(parsed.year, parsed.month, parsed.day)}</strong></span>
          </span>
        </div>
      ) : (
        <div className="text-[11px] text-amber-600 dark:text-amber-400 italic">
          Enter date in DD.MM.YYYY format (e.g. 12.10.2005) or use calendar dropdowns.
        </div>
      )}

      {/* Popover Calendar Grid */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 z-50 w-full max-w-sm p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl space-y-3 animate-fade-in">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11);
                  setViewYear(viewYear - 1);
                } else {
                  setViewMonth(viewMonth - 1);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex gap-1">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                className="bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={name} value={idx} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {name}
                  </option>
                ))}
              </select>

              <select
                value={viewYear}
                onChange={(e) => setViewYear(Number(e.target.value))}
                className="bg-transparent font-bold text-xs text-slate-800 dark:text-slate-200 cursor-pointer focus:outline-none"
              >
                {yearsOptions.map((y) => (
                  <option key={y} value={y} className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0);
                  setViewYear(viewYear + 1);
                } else {
                  setViewMonth(viewMonth + 1);
                }
              }}
              className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-400"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center">
            {WEEKDAY_SHORT.map((wd) => (
              <span key={wd} className="text-[10px] font-extrabold uppercase text-slate-400">
                {wd}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysArray.map((dayNum, idx) => {
              if (dayNum === null) {
                return <div key={`empty-${idx}`} />;
              }

              const isSelected =
                parsed &&
                parsed.year === viewYear &&
                parsed.month === viewMonth + 1 &&
                parsed.day === dayNum;

              const isToday =
                new Date().getFullYear() === viewYear &&
                new Date().getMonth() === viewMonth &&
                new Date().getDate() === dayNum;

              return (
                <button
                  key={dayNum}
                  type="button"
                  onClick={() => {
                    updateDate(viewYear, viewMonth + 1, dayNum);
                    setIsOpen(false);
                  }}
                  className={`py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? "bg-brand-600 text-white shadow-md scale-105"
                      : isToday
                      ? "border border-brand-500 text-brand-600 dark:text-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                const now = new Date();
                updateDate(now.getFullYear(), now.getMonth() + 1, now.getDate());
                setIsOpen(false);
              }}
              className="text-xs text-brand-600 dark:text-brand-400 font-bold hover:underline"
            >
              Select Today
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AgeChrono() {
  const [birthdate, setBirthdate] = useState<string>("");
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);

  // Live Age States
  const [ageStats, setAgeStats] = useState({
    years: 0,
    months: 0,
    days: 0,
    totalMonths: 0,
    totalWeeks: 0,
    totalDays: 0,
    totalHours: 0,
    totalMinutes: 0,
    totalSeconds: 0,
  });

  const [nextBirthday, setNextBirthday] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    percentage: 0,
  });

  const [zodiac, setZodiac] = useState<ZodiacDetail>({
    name: "",
    rashiName: "",
    icon: "",
    element: "",
    rulingPlanet: "",
  });
  const [chineseZodiac, setChineseZodiac] = useState({ name: "", icon: "" });
  const [bornDay, setBornDay] = useState<string>("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getZodiacDetail = (day: number, month: number): ZodiacDetail => {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19))
      return { name: "Aries", rashiName: "Mesh (Aries)", icon: "♈", element: "Fire", rulingPlanet: "Mars" };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20))
      return { name: "Taurus", rashiName: "Vrishabh (Taurus)", icon: "♉", element: "Earth", rulingPlanet: "Venus" };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20))
      return { name: "Gemini", rashiName: "Mithun (Gemini)", icon: "♊", element: "Air", rulingPlanet: "Mercury" };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22))
      return { name: "Cancer", rashiName: "Kark (Cancer)", icon: "♋", element: "Water", rulingPlanet: "Moon" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22))
      return { name: "Leo", rashiName: "Singh (Leo)", icon: "♌", element: "Fire", rulingPlanet: "Sun" };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22))
      return { name: "Virgo", rashiName: "Kanya (Virgo)", icon: "♍", element: "Earth", rulingPlanet: "Mercury" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22))
      return { name: "Libra", rashiName: "Tula (Libra)", icon: "♎", element: "Air", rulingPlanet: "Venus" };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
      return { name: "Scorpio", rashiName: "Vrishchik (Scorpio)", icon: "♏", element: "Water", rulingPlanet: "Mars" };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
      return { name: "Sagittarius", rashiName: "Dhanu (Sagittarius)", icon: "♐", element: "Fire", rulingPlanet: "Jupiter" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
      return { name: "Capricorn", rashiName: "Makar (Capricorn)", icon: "♑", element: "Earth", rulingPlanet: "Saturn" };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
      return { name: "Aquarius", rashiName: "Kumbh (Aquarius)", icon: "♒", element: "Air", rulingPlanet: "Saturn" };
    return { name: "Pisces", rashiName: "Meen (Pisces)", icon: "♓", element: "Water", rulingPlanet: "Jupiter" };
  };

  const getChineseZodiac = (year: number) => {
    const animals = [
      { name: "Rat", icon: "🐀" },
      { name: "Ox", icon: "🐂" },
      { name: "Tiger", icon: "🐅" },
      { name: "Rabbit", icon: "🐇" },
      { name: "Dragon", icon: "🐉" },
      { name: "Snake", icon: "🐍" },
      { name: "Horse", icon: "🐎" },
      { name: "Goat", icon: "🐐" },
      { name: "Monkey", icon: "🐒" },
      { name: "Rooster", icon: "🐓" },
      { name: "Dog", icon: "🐕" },
      { name: "Pig", icon: "🐖" },
    ];
    const index = (year - 1900) % 12;
    return animals[index >= 0 ? index : (index + 12) % 12];
  };

  const calculateAge = () => {
    if (!birthdate) return;

    const parsedDob = parseDateSmart(birthdate);
    if (!parsedDob) return;

    const dob = new Date(parsedDob.year, parsedDob.month - 1, parsedDob.day);
    const now = new Date();

    if (dob > now) {
      alert("Birthdate cannot be set in the future!");
      setBirthdate("");
      setHasCalculated(false);
      return;
    }

    setHasCalculated(true);

    const updateAgeStats = () => {
      const current = new Date();

      let years = current.getFullYear() - dob.getFullYear();
      let months = current.getMonth() - dob.getMonth();
      let days = current.getDate() - dob.getDate();

      if (days < 0) {
        const prevMonth = new Date(current.getFullYear(), current.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }
      if (months < 0) {
        months += 12;
        years--;
      }

      const diffMs = current.getTime() - dob.getTime();
      const totalSeconds = Math.floor(diffMs / 1000);
      const totalMinutes = Math.floor(totalSeconds / 60);
      const totalHours = Math.floor(totalMinutes / 60);
      const totalDays = Math.floor(totalHours / 24);
      const totalWeeks = Math.floor(totalDays / 7);
      const totalMonths = (current.getFullYear() - dob.getFullYear()) * 12 + current.getMonth() - dob.getMonth();

      setAgeStats({
        years,
        months,
        days,
        totalMonths,
        totalWeeks,
        totalDays,
        totalHours,
        totalMinutes,
        totalSeconds,
      });

      // Next Birthday
      let nextBday = new Date(current.getFullYear(), dob.getMonth(), dob.getDate());
      if (nextBday < current) {
        nextBday = new Date(current.getFullYear() + 1, dob.getMonth(), dob.getDate());
      }

      const bdayDiff = nextBday.getTime() - current.getTime();
      const bSec = Math.floor(bdayDiff / 1000) % 60;
      const bMin = Math.floor(bdayDiff / (1000 * 60)) % 60;
      const bHr = Math.floor(bdayDiff / (1000 * 60 * 60)) % 24;
      const bDay = Math.floor(bdayDiff / (1000 * 60 * 60 * 24));

      const lastBday = new Date(nextBday.getFullYear() - 1, dob.getMonth(), dob.getDate());
      const elapsed = current.getTime() - lastBday.getTime();
      const totalYearMs = nextBday.getTime() - lastBday.getTime();
      const percentage = Math.min(100, Math.max(0, (elapsed / totalYearMs) * 100));

      setNextBirthday({
        days: bDay,
        hours: bHr,
        minutes: bMin,
        seconds: bSec,
        percentage,
      });
    };

    updateAgeStats();

    // Exact Birth Day of Week & Zodiac details
    const dayName = WEEKDAYS[dob.getDay()];
    setBornDay(dayName);
    setZodiac(getZodiacDetail(dob.getDate(), dob.getMonth() + 1));
    setChineseZodiac(getChineseZodiac(dob.getFullYear()));

    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(updateAgeStats, 1000);
  };

  useEffect(() => {
    if (birthdate) {
      calculateAge();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [birthdate]);

  const handleReset = () => {
    setBirthdate("");
    setHasCalculated(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <CardTitle>Age Calculator &amp; Birth Details</CardTitle>
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20">
              Instant
            </span>
          </div>

          <div className="space-y-4">
            <CalendarDatePicker
              id="dob-input"
              label="Select Date of Birth"
              value={birthdate}
              onChange={(val) => setBirthdate(val)}
            />
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            Calculates exact chronological age down to seconds, exact day of birth (e.g. Wednesday), Rashi, and Zodiac signs.
          </p>

          {hasCalculated && (
            <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
              Reset Calculator
            </Button>
          )}
        </div>
      </div>

      {/* Calculations & Output Side */}
      <div className="lg:col-span-7 space-y-6">
        {!hasCalculated ? (
          <div className="text-center py-20 text-slate-400 border border-slate-200/50 dark:border-slate-850 rounded-3xl bg-white/30 dark:bg-slate-950/20">
            <CalendarIcon className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800 mb-3 animate-pulse" />
            <p className="text-base font-bold text-slate-750 dark:text-slate-300">Awaiting Date of Birth</p>
            <p className="text-xs text-slate-400 mt-1">Select your birthdate above to view exact age, day of birth &amp; Rashi.</p>
          </div>
        ) : (
          <div className="space-y-6 animate-fade-in">
            {/* Day of the Week & Rashi Banner */}
            <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-brand-600 dark:from-indigo-950/60 dark:via-purple-950/60 dark:to-brand-950/60 text-white p-6 rounded-3xl border border-indigo-500/30 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/15 pb-3">
                <span className="text-[10px] uppercase font-black tracking-widest text-purple-200 flex items-center gap-1.5">
                  <Sun className="w-4 h-4 text-amber-300 animate-spin-slow" /> Day of Birth &amp; Zodiac Rashi
                </span>
                <Sparkles className="w-5 h-5 text-amber-300" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Birth Day of Week */}
                <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-purple-200 font-bold block">
                    Day of Birth
                  </span>
                  <div className="text-2xl font-black text-amber-300">
                    {bornDay}
                  </div>
                  <p className="text-[11px] text-white/80">You were born on a {bornDay}!</p>
                </div>

                {/* Rashi & Western Zodiac */}
                <div className="bg-black/20 p-4 rounded-2xl border border-white/10 space-y-1">
                  <span className="text-[10px] uppercase tracking-wider text-purple-200 font-bold block">
                    Rashi / Zodiac Sign
                  </span>
                  <div className="text-2xl font-black text-white flex items-center gap-2">
                    <span className="text-3xl">{zodiac.icon}</span>
                    <span>{zodiac.rashiName}</span>
                  </div>
                  <p className="text-[11px] text-white/80">
                    Element: {zodiac.element} | Planet: {zodiac.rulingPlanet}
                  </p>
                </div>
              </div>
            </div>

            {/* Age Grid Metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/[0.01] group-hover:bg-brand-500/[0.03] transition-all"></div>
                <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
                  {ageStats.years}
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Years</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/[0.01] group-hover:bg-brand-500/[0.03] transition-all"></div>
                <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
                  {ageStats.months}
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Months</span>
              </div>

              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-5 rounded-3xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/[0.01] group-hover:bg-brand-500/[0.03] transition-all"></div>
                <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
                  {ageStats.days}
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Days</span>
              </div>
            </div>

            {/* Next Birthday Countdown */}
            <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 dark:from-brand-950/40 dark:to-indigo-950/40 text-white p-5 rounded-3xl border border-brand-500/20 shadow-md">
              <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-4">
                <h4 className="text-xs uppercase font-extrabold tracking-widest text-brand-100 flex items-center gap-1.5">
                  <Gift className="w-4 h-4" /> Next Birthday Countdown
                </h4>
                <Cake className="w-5 h-5 text-brand-200 animate-bounce" />
              </div>
              
              <div className="grid grid-cols-4 gap-2 text-center">
                <div>
                  <span className="block text-2xl font-black">{nextBirthday.days}</span>
                  <span className="text-[10px] uppercase opacity-75 font-semibold">Days</span>
                </div>
                <div>
                  <span className="block text-2xl font-black">{String(nextBirthday.hours).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase opacity-75 font-semibold">Hours</span>
                </div>
                <div>
                  <span className="block text-2xl font-black">{String(nextBirthday.minutes).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase opacity-75 font-semibold">Mins</span>
                </div>
                <div>
                  <span className="block text-2xl font-black">{String(nextBirthday.seconds).padStart(2, "0")}</span>
                  <span className="text-[10px] uppercase opacity-75 font-semibold">Secs</span>
                </div>
              </div>

              <div className="mt-5 space-y-1.5">
                <div className="w-full bg-black/25 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-1000"
                    style={{ width: `${nextBirthday.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Chinese Zodiac & Extras */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Compass className="w-6 h-6 text-indigo-500" />
                <div>
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                    Chinese Zodiac Sign
                  </h4>
                  <p className="text-xs text-slate-500">
                    Based on your birth year: <strong className="text-slate-800 dark:text-slate-200">{chineseZodiac.name}</strong>
                  </p>
                </div>
              </div>
              <span className="text-3xl">{chineseZodiac.icon}</span>
            </div>

            {/* Total Elapsed stats */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 rounded-3xl p-5 shadow-sm space-y-4">
              <h4 className="text-xs uppercase font-extrabold text-slate-400 border-b border-slate-100 dark:border-slate-800 pb-2 flex items-center gap-1.5">
                <CalendarDays className="w-4 h-4" /> Total Elapsed Timeline
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="p-2.5 border border-slate-100 dark:border-slate-800/50 rounded-xl">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Months Lived</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{ageStats.totalMonths.toLocaleString()}</span>
                </div>
                <div className="p-2.5 border border-slate-100 dark:border-slate-800/50 rounded-xl">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Weeks Lived</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{ageStats.totalWeeks.toLocaleString()}</span>
                </div>
                <div className="p-2.5 border border-slate-100 dark:border-slate-800/50 rounded-xl">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Days Lived</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{ageStats.totalDays.toLocaleString()}</span>
                </div>
                <div className="p-2.5 border border-slate-100 dark:border-slate-800/50 rounded-xl">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Hours Lived</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{ageStats.totalHours.toLocaleString()}</span>
                </div>
                <div className="p-2.5 border border-slate-100 dark:border-slate-800/50 rounded-xl">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Minutes Lived</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{ageStats.totalMinutes.toLocaleString()}</span>
                </div>
                <div className="p-2.5 border border-slate-100 dark:border-slate-800/50 rounded-xl">
                  <span className="block text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Seconds Lived</span>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{ageStats.totalSeconds.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
