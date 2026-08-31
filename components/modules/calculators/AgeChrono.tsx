"use client";
import React, { useState, useEffect, useRef } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Calendar, Cake, Gift, Heart, CalendarDays, Compass } from "lucide-react";

export default function AgeChrono() {
  const [birthdate, setBirthdate] = useState<string>("");
  const [hasCalculated, setHasCalculated] = useState<boolean>(false);
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

  const [zodiac, setZodiac] = useState({ name: "", icon: "" });
  const [chineseZodiac, setChineseZodiac] = useState({ name: "", icon: "" });
  const [bornDay, setBornDay] = useState<string>("");

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const getZodiac = (day: number, month: number) => {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return { name: "Aries", icon: "♈" };
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return { name: "Taurus", icon: "♉" };
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return { name: "Gemini", icon: "♊" };
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return { name: "Cancer", icon: "♋" };
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return { name: "Leo", icon: "♌" };
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return { name: "Virgo", icon: "♍" };
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return { name: "Libra", icon: "♎" };
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return { name: "Scorpio", icon: "♏" };
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return { name: "Sagittarius", icon: "♐" };
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return { name: "Capricorn", icon: "♑" };
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return { name: "Aquarius", icon: "♒" };
    return { name: "Pisces", icon: "♓" };
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
    
    // Parse DOB in local timezone to avoid UTC day-shift
    const parts = birthdate.split("-");
    const dob = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
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
      
      // Calculate diff in Y/M/D
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

      // Calculate next birthday countdown
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

    // Set Zodiac and birth attributes
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    setBornDay(weekdays[dob.getDay()]);
    setZodiac(getZodiac(dob.getDate(), dob.getMonth() + 1));
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
      {/* Date picker Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Chronology Inputs
          </h3>

          <div className="space-y-2">
            <label htmlFor="dob-input" className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
              Select Date of Birth
            </label>
            <input
              type="date"
              id="dob-input"
              value={birthdate}
              onChange={(e) => setBirthdate(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm font-bold text-slate-850 dark:text-slate-150 focus:outline-none focus:ring-2 focus:ring-brand-500/50"
            />
          </div>

          <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed">
            Calculates exact chronological age markers down to seconds and tracks western/Chinese zodiac details offline.
          </p>

          {hasCalculated && (
            <Button variant="outline" size="sm" onClick={handleReset} className="w-full">
              Reset Calculator
            </Button>
          )}
        </div>
      </div>

      {/* Calculations output Side */}
      <div className="lg:col-span-7 space-y-6">
        {!hasCalculated ? (
          <div className="text-center py-20 text-slate-400 border border-slate-200/50 dark:border-slate-850 rounded-3xl bg-white/30 dark:bg-slate-950/20">
            <Calendar className="w-12 h-12 mx-auto text-slate-200 dark:text-slate-800 mb-3 animate-pulse" />
            <p className="text-base font-bold text-slate-750 dark:text-slate-300">Awaiting Birthdate</p>
            <p className="text-xs text-slate-400 mt-1">Please select your date of birth in the inputs block.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Age grid metrics */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/[0.01] group-hover:bg-brand-500/[0.03] transition-all"></div>
                <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
                  {ageStats.years}
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Years</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/[0.01] group-hover:bg-brand-500/[0.03] transition-all"></div>
                <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
                  {ageStats.months}
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Months</span>
              </div>
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-2xl text-center shadow-sm relative overflow-hidden group">
                <div className="absolute inset-0 bg-brand-500/[0.01] group-hover:bg-brand-500/[0.03] transition-all"></div>
                <span className="text-3xl sm:text-4xl font-black text-brand-600 dark:text-brand-400">
                  {ageStats.days}
                </span>
                <span className="block text-[10px] uppercase font-bold tracking-wider text-slate-400 mt-1">Days</span>
              </div>
            </div>

            {/* Next Birthday countdown */}
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

              {/* Progress bar */}
              <div className="mt-5 space-y-1.5">
                <div className="w-full bg-black/25 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-white h-full rounded-full transition-all duration-1000"
                    style={{ width: `${nextBirthday.percentage}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Total Timelines stats list */}
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

            {/* Zodiac / Birthday facts */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-xl flex items-center gap-3 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-brand-50 dark:bg-brand-950 flex items-center justify-center text-brand-600 dark:text-brand-400 shrink-0">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">Born Day</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{bornDay}</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-xl flex items-center gap-3 shadow-sm">
                <span className="text-2xl text-brand-500 shrink-0 select-none">{zodiac.icon}</span>
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">Zodiac</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{zodiac.name}</span>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/60 p-4 rounded-xl flex items-center gap-3 shadow-sm">
                <span className="text-2xl text-brand-500 shrink-0 select-none">{chineseZodiac.icon}</span>
                <div>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">Chinese Year</span>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{chineseZodiac.name}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
