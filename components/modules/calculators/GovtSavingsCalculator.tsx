"use client";
import React, { useState } from "react";
import {
  PiggyBank,
  TrendingUp,
  Table,
  Calculator,
  Coins,
  Info,
} from "lucide-react";

type SchemeType = "ssy" | "ppf" | "nps" | "rd";

interface SSYScheduleItem {
  year: number;
  age: number;
  openingBalance: number;
  deposit: number;
  interest: number;
  closingBalance: number;
}

interface PPFScheduleItem {
  year: number;
  openingBalance: number;
  deposit: number;
  interest: number;
  closingBalance: number;
}

interface NPSScheduleItem {
  year: number;
  openingBalance: number;
  deposits: number;
  interest: number;
  closingBalance: number;
}

interface RDScheduleItem {
  month: number;
  openingBalance: number;
  deposit: number;
  interest: number;
  closingBalance: number;
}

export default function GovtSavingsCalculator() {
  const [activeScheme, setActiveScheme] = useState<SchemeType>("ssy");

  // Format currency helper
  const formatINR = (val: number) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  // --- SSY STATE ---
  const [ssyDeposit, setSsyDeposit] = useState<string>("100000"); // Default 1 Lakh
  const [ssyRate, setSsyRate] = useState<string>("8.2"); // Default 8.2%
  const [ssyGirlAge, setSsyGirlAge] = useState<number>(5);
  const [ssyStartYear, setSsyStartYear] = useState<number>(new Date().getFullYear());

  // --- PPF STATE ---
  const [ppfDeposit, setPpfDeposit] = useState<string>("100000"); // Default 1 Lakh
  const [ppfRate, setPpfRate] = useState<string>("7.1"); // Default 7.1%
  const [ppfTenure, setPpfTenure] = useState<number>(15); // Default 15 years

  // --- NPS STATE ---
  const [npsMonthly, setNpsMonthly] = useState<string>("5000"); // Default 5k/month
  const [npsRate, setNpsRate] = useState<string>("10.0"); // Default 10%
  const [npsAge, setNpsAge] = useState<number>(30); // Default 30 years old
  const [npsAnnuityPercent, setNpsAnnuityPercent] = useState<number>(40); // Min 40%
  const [npsAnnuityRate, setNpsAnnuityRate] = useState<string>("6.0"); // Default 6%

  // --- RD STATE ---
  const [rdMonthly, setRdMonthly] = useState<string>("5000"); // Default 5k/month
  const [rdRate, setRdRate] = useState<string>("6.8"); // Default 6.8%
  const [rdTenureMonths, setRdTenureMonths] = useState<number>(60); // Default 5 Years = 60 months

  // --- SSY CALCULATIONS ---
  const ssyDepNum = parseFloat(ssyDeposit);
  const ssyRateNum = parseFloat(ssyRate);
  const ssyGirlAgeNum = ssyGirlAge;

  const ssyStartAge = ssyGirlAgeNum;
  const ssyMaxDepositYear = 15;
  const ssyMaturityYear = 21;
  
  let ssyInvested = 0;
  let ssyInterest = 0;
  let ssyMaturity = 0;
  const ssySchedule: SSYScheduleItem[] = [];

  if (!isNaN(ssyDepNum) && ssyDepNum > 0 && !isNaN(ssyRateNum) && ssyRateNum > 0 && ssyGirlAgeNum >= 0 && ssyGirlAgeNum <= 10) {
    let balance = 0;
    for (let y = 1; y <= ssyMaturityYear; y++) {
      const opening = balance;
      const annualDep = y <= ssyMaxDepositYear ? Math.min(ssyDepNum, 150000) : 0;
      ssyInvested += annualDep;
      
      const interestEarned = Math.round((opening + annualDep) * (ssyRateNum / 100));
      balance = opening + annualDep + interestEarned;

      ssySchedule.push({
        year: ssyStartYear + y - 1,
        age: ssyStartAge + y - 1,
        openingBalance: opening,
        deposit: annualDep,
        interest: interestEarned,
        closingBalance: balance,
      });
    }
    ssyMaturity = balance;
    ssyInterest = ssyMaturity - ssyInvested;
  }

  // --- PPF CALCULATIONS ---
  const ppfDepNum = parseFloat(ppfDeposit);
  const ppfRateNum = parseFloat(ppfRate);
  const ppfTenureNum = ppfTenure;

  let ppfInvested = 0;
  let ppfInterest = 0;
  let ppfMaturity = 0;
  const ppfSchedule: PPFScheduleItem[] = [];

  if (!isNaN(ppfDepNum) && ppfDepNum > 0 && !isNaN(ppfRateNum) && ppfRateNum > 0 && ppfTenureNum >= 15 && ppfTenureNum <= 30) {
    let balance = 0;
    for (let y = 1; y <= ppfTenureNum; y++) {
      const opening = balance;
      const annualDep = Math.min(ppfDepNum, 150000);
      ppfInvested += annualDep;

      const interestEarned = Math.round((opening + annualDep) * (ppfRateNum / 100));
      balance = opening + annualDep + interestEarned;

      ppfSchedule.push({
        year: y,
        openingBalance: opening,
        deposit: annualDep,
        interest: interestEarned,
        closingBalance: balance,
      });
    }
    ppfMaturity = balance;
    ppfInterest = ppfMaturity - ppfInvested;
  }

  // --- NPS CALCULATIONS ---
  const npsMonthlyNum = parseFloat(npsMonthly);
  const npsRateNum = parseFloat(npsRate);
  const npsAgeNum = npsAge;
  const npsAnnuityPercentNum = npsAnnuityPercent;
  const npsAnnuityRateNum = parseFloat(npsAnnuityRate);

  let npsInvested = 0;
  let npsInterest = 0;
  let npsCorpus = 0;
  let npsLumpSum = 0;
  let npsAnnuity = 0;
  let npsMonthlyPension = 0;
  const npsSchedule: NPSScheduleItem[] = [];

  if (
    !isNaN(npsMonthlyNum) && npsMonthlyNum > 0 &&
    !isNaN(npsRateNum) && npsRateNum > 0 &&
    npsAgeNum >= 18 && npsAgeNum < 60 &&
    npsAnnuityPercentNum >= 40 && npsAnnuityPercentNum <= 100 &&
    !isNaN(npsAnnuityRateNum) && npsAnnuityRateNum > 0
  ) {
    const yearsTo60 = 60 - npsAgeNum;
    const r_monthly = npsRateNum / 12 / 100;
    let balance = 0;

    for (let y = 1; y <= yearsTo60; y++) {
      const opening = balance;
      let yearlyDeposits = 0;
      let yearlyInterest = 0;

      for (let m = 1; m <= 12; m++) {
        balance += npsMonthlyNum;
        yearlyDeposits += npsMonthlyNum;
        npsInvested += npsMonthlyNum;

        const interest = balance * r_monthly;
        balance += interest;
        yearlyInterest += interest;
      }

      npsSchedule.push({
        year: y,
        openingBalance: opening,
        deposits: yearlyDeposits,
        interest: Math.round(yearlyInterest),
        closingBalance: Math.round(balance),
      });
    }

    npsCorpus = Math.round(balance);
    npsAnnuity = Math.round(npsCorpus * (npsAnnuityPercentNum / 100));
    npsLumpSum = npsCorpus - npsAnnuity;
    npsMonthlyPension = Math.round((npsAnnuity * (npsAnnuityRateNum / 100)) / 12);
    npsInterest = npsCorpus - npsInvested;
  }

  // --- RD CALCULATIONS ---
  const rdMonthlyNum = parseFloat(rdMonthly);
  const rdRateNum = parseFloat(rdRate);
  const rdTenureMonthsNum = rdTenureMonths;

  let rdInvested = 0;
  let rdInterest = 0;
  let rdMaturity = 0;
  const rdSchedule: RDScheduleItem[] = [];

  if (!isNaN(rdMonthlyNum) && rdMonthlyNum > 0 && !isNaN(rdRateNum) && rdRateNum > 0 && rdTenureMonthsNum > 0) {
    let balance = 0;
    let accruedInterest = 0;

    for (let m = 1; m <= rdTenureMonthsNum; m++) {
      const opening = balance;
      balance += rdMonthlyNum;
      rdInvested += rdMonthlyNum;

      const monthlyInt = balance * (rdRateNum / 100) / 12;
      accruedInterest += monthlyInt;

      let creditedInt = 0;
      if (m % 3 === 0 || m === rdTenureMonthsNum) {
        creditedInt = Math.round(accruedInterest);
        balance += creditedInt;
        accruedInterest = 0;
      }

      rdSchedule.push({
        month: m,
        openingBalance: opening,
        deposit: rdMonthlyNum,
        interest: creditedInt,
        closingBalance: balance,
      });
    }
    rdMaturity = balance;
    rdInterest = rdMaturity - rdInvested;
  }

  return (
    <div className="space-y-6">
      {/* Scheme Tab Selector */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-200/30 dark:border-slate-800/30 w-fit max-w-full">
        {[
          { id: "ssy", label: "Sukanya Samriddhi (SSY)", icon: PiggyBank },
          { id: "ppf", label: "Provident Fund (PPF)", icon: Coins },
          { id: "nps", label: "National Pension (NPS)", icon: TrendingUp },
          { id: "rd", label: "Recurring Deposit (RD)", icon: Calculator },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveScheme(tab.id as SchemeType)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                activeScheme === tab.id
                  ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm border border-slate-200/10"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-150"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in">
        
        {/* --- PARAMETERS SIDE --- */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* SSY PARAMETERS */}
          {activeScheme === "ssy" && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                SSY Scheme Settings
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Yearly Deposit</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{formatINR(ssyDepNum || 0)}</span>
                </div>
                <input
                  type="number"
                  min="250"
                  max="150000"
                  value={ssyDeposit}
                  onChange={(e) => setSsyDeposit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="500"
                  max="150000"
                  step="500"
                  value={ssyDepNum || 500}
                  onChange={(e) => setSsyDeposit(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">Min ₹250 | Max ₹1,50,000 p.a. (Govt limits)</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Girl Child Age</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{ssyGirlAge} Years old</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="10"
                  step="1"
                  value={ssyGirlAge}
                  onChange={(e) => setSsyGirlAge(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">SSY accounts can only be opened up to age 10.</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Interest Rate (% p.a.)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{ssyRate}%</span>
                </div>
                <input
                  type="number"
                  step="0.05"
                  value={ssyRate}
                  onChange={(e) => setSsyRate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="5"
                  max="12"
                  step="0.1"
                  value={ssyRateNum || 8.2}
                  onChange={(e) => setSsyRate(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide block">Account Start Year</label>
                <input
                  type="number"
                  value={ssyStartYear}
                  onChange={(e) => setSsyStartYear(parseInt(e.target.value) || new Date().getFullYear())}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
              </div>
            </div>
          )}

          {/* PPF PARAMETERS */}
          {activeScheme === "ppf" && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                PPF Scheme Settings
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Yearly Deposit</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{formatINR(ppfDepNum || 0)}</span>
                </div>
                <input
                  type="number"
                  min="500"
                  max="150000"
                  value={ppfDeposit}
                  onChange={(e) => setPpfDeposit(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="500"
                  max="150000"
                  step="500"
                  value={ppfDepNum || 500}
                  onChange={(e) => setPpfDeposit(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">Min ₹500 | Max ₹1,50,000 p.a. (Govt limits)</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Investment Duration</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{ppfTenure} Years</span>
                </div>
                <input
                  type="number"
                  min="15"
                  max="30"
                  value={ppfTenure}
                  onChange={(e) => setPpfTenure(Math.max(15, Math.min(30, parseInt(e.target.value) || 15)))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="15"
                  max="30"
                  step="5"
                  value={ppfTenure}
                  onChange={(e) => setPpfTenure(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">Standard PPF lock-in is 15 years, extendable in blocks of 5.</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
                  <span>Interest Rate (% p.a.)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{ppfRate}%</span>
                </div>
                <input
                  type="number"
                  step="0.05"
                  value={ppfRate}
                  onChange={(e) => setPpfRate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="5"
                  max="12"
                  step="0.1"
                  value={ppfRateNum || 7.1}
                  onChange={(e) => setPpfRate(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>
            </div>
          )}

          {/* NPS PARAMETERS */}
          {activeScheme === "nps" && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                NPS Retirement Settings
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Monthly Contribution</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{formatINR(npsMonthlyNum || 0)}</span>
                </div>
                <input
                  type="number"
                  min="500"
                  value={npsMonthly}
                  onChange={(e) => setNpsMonthly(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="500"
                  max="50000"
                  step="500"
                  value={npsMonthlyNum || 500}
                  onChange={(e) => setNpsMonthly(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Current Age</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{npsAge} Years old</span>
                </div>
                <input
                  type="number"
                  min="18"
                  max="59"
                  value={npsAge}
                  onChange={(e) => setNpsAge(Math.max(18, Math.min(59, parseInt(e.target.value) || 18)))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="18"
                  max="59"
                  value={npsAge}
                  onChange={(e) => setNpsAge(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">Retirement corpus calculations compound up to age 60.</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Expected Return Rate (% p.a.)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{npsRate}%</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={npsRate}
                  onChange={(e) => setNpsRate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="5"
                  max="15"
                  step="0.5"
                  value={npsRateNum || 10}
                  onChange={(e) => setNpsRate(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="space-y-2 border-t border-slate-100 dark:border-slate-800 pt-4">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Reinvest in Annuity (%)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{npsAnnuityPercent}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  step="5"
                  value={npsAnnuityPercent}
                  onChange={(e) => setNpsAnnuityPercent(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">Min 40% of the corpus must buy annuity (monthly pension scheme).</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Expected Annuity Rate (% p.a.)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{npsAnnuityRate}%</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  value={npsAnnuityRate}
                  onChange={(e) => setNpsAnnuityRate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="3"
                  max="10"
                  step="0.1"
                  value={npsAnnuityRateNum || 6}
                  onChange={(e) => setNpsAnnuityRate(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>
            </div>
          )}

          {/* RD PARAMETERS */}
          {activeScheme === "rd" && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                RD Scheme Settings
              </h3>
              
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Monthly Deposit</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{formatINR(rdMonthlyNum || 0)}</span>
                </div>
                <input
                  type="number"
                  min="10"
                  value={rdMonthly}
                  onChange={(e) => setRdMonthly(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="100"
                  max="50000"
                  step="100"
                  value={rdMonthlyNum || 100}
                  onChange={(e) => setRdMonthly(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Tenure (Months)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{rdTenureMonths} Months ({rdTenureMonths / 12} Years)</span>
                </div>
                <input
                  type="number"
                  min="6"
                  max="120"
                  value={rdTenureMonths}
                  onChange={(e) => setRdTenureMonths(Math.max(6, Math.min(120, parseInt(e.target.value) || 6)))}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="6"
                  max="120"
                  step="6"
                  value={rdTenureMonths}
                  onChange={(e) => setRdTenureMonths(parseInt(e.target.value))}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
                <span className="text-[10px] text-slate-400 font-semibold block">RD tenures generally range from 6 months to 10 years (120 months).</span>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-400 uppercase tracking-wide">
                  <span>Interest Rate (% p.a.)</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">{rdRate}%</span>
                </div>
                <input
                  type="number"
                  step="0.05"
                  value={rdRate}
                  onChange={(e) => setRdRate(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-bold text-slate-800 dark:text-slate-200"
                />
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.1"
                  value={rdRateNum || 6.8}
                  onChange={(e) => setRdRate(e.target.value)}
                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
                />
              </div>
            </div>
          )}

        </div>

        {/* --- RESULTS & SCHEDULE SIDE --- */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* RESULTS CARD */}
          <div className="bg-gradient-to-tr from-brand-600 to-indigo-650 dark:from-brand-950/40 dark:to-indigo-950/40 text-white p-6 rounded-3xl border border-brand-500/20 shadow-md">
            <div className="space-y-5">
              <span className="text-[10px] uppercase tracking-widest font-black opacity-75">
                {activeScheme.toUpperCase()} Return Summary
              </span>
              
              {/* SSY/PPF/RD simple returns layout */}
              {activeScheme !== "nps" && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
                  <div>
                    <span className="text-xs opacity-75 block font-medium">Total Invested</span>
                    <span className="text-xl font-bold">
                      {activeScheme === "ssy" && formatINR(ssyInvested)}
                      {activeScheme === "ppf" && formatINR(ppfInvested)}
                      {activeScheme === "rd" && formatINR(rdInvested)}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs opacity-75 block font-medium">Interest Margin</span>
                    <span className="text-xl font-bold text-brand-200 dark:text-brand-300">
                      {activeScheme === "ssy" && "+" + formatINR(ssyInterest)}
                      {activeScheme === "ppf" && "+" + formatINR(ppfInterest)}
                      {activeScheme === "rd" && "+" + formatINR(rdInterest)}
                    </span>
                  </div>
                  <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 sm:border-l border-white/10 pt-4 sm:pt-0 sm:pl-6">
                    <span className="text-xs opacity-75 block font-medium">Maturity Value</span>
                    <span className="text-xl font-black text-emerald-350 dark:text-emerald-400">
                      {activeScheme === "ssy" && formatINR(ssyMaturity)}
                      {activeScheme === "ppf" && formatINR(ppfMaturity)}
                      {activeScheme === "rd" && formatINR(rdMaturity)}
                    </span>
                  </div>
                  
                  <div className="col-span-2 sm:col-span-3 border-t border-white/10 pt-4 flex items-center gap-3">
                    <Info className="w-4 h-4 shrink-0 text-brand-200" />
                    <span className="text-[10px] opacity-75 leading-relaxed">
                      {activeScheme === "ssy" && "Sukanya Samriddhi Yojana offers tax-free maturity after 21 years from account start. Annual compounding applies."}
                      {activeScheme === "ppf" && "PPF deposits are eligible for tax exemption under Section 80C. Entire maturity amount is fully tax-free."}
                      {activeScheme === "rd" && "Recurring Deposit returns are computed with quarterly compounding. Interest is subject to TDS based on slab."}
                    </span>
                  </div>
                </div>
              )}

              {/* NPS retirement complex corpus layout */}
              {activeScheme === "nps" && (
                <div className="space-y-4 pt-1">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-5">
                    <div>
                      <span className="text-xs opacity-75 block font-medium">Total Invested</span>
                      <span className="text-lg font-bold">{formatINR(npsInvested)}</span>
                    </div>
                    <div>
                      <span className="text-xs opacity-75 block font-medium">Interest Earned</span>
                      <span className="text-lg font-bold text-brand-200 dark:text-brand-300">+{formatINR(npsInterest)}</span>
                    </div>
                    <div>
                      <span className="text-xs opacity-75 block font-medium">Retirement Corpus</span>
                      <span className="text-lg font-black text-emerald-350 dark:text-emerald-400">{formatINR(npsCorpus)}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <span className="text-xs opacity-75 block font-medium">Tax-free Lump Sum ({(100 - npsAnnuityPercent)}%)</span>
                      <span className="text-base font-bold text-white">{formatINR(npsLumpSum)}</span>
                    </div>
                    <div>
                      <span className="text-xs opacity-75 block font-medium">Annuity Reinvest ({npsAnnuityPercent}%)</span>
                      <span className="text-base font-bold text-indigo-200">{formatINR(npsAnnuity)}</span>
                    </div>
                    <div className="bg-white/10 dark:bg-slate-900/40 p-3 rounded-2xl border border-white/10 dark:border-slate-800/30">
                      <span className="text-[10px] uppercase font-black opacity-80 block text-brand-200">Est. Monthly Pension</span>
                      <span className="text-lg font-black text-emerald-300">{formatINR(npsMonthlyPension)}</span>
                    </div>
                  </div>

                  <div className="border-t border-white/10 pt-3 flex items-center gap-3">
                    <Info className="w-4 h-4 shrink-0 text-brand-200" />
                    <span className="text-[10px] opacity-75 leading-relaxed">
                      NPS mandates at least 40% annuity reinvestment to generate monthly pension payouts after retirement at age 60.
                    </span>
                  </div>
                </div>
              )}

            </div>
          </div>

          {/* SCHEDULE TABLES */}
          
          {/* SSY Schedule */}
          {activeScheme === "ssy" && ssySchedule.length > 0 && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Table className="w-4 h-4" /> 21-Year SSY Compounding Schedule
                </h4>
              </div>
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-extrabold uppercase sticky top-0">
                      <th className="p-3 text-center w-12">Year</th>
                      <th className="p-3 text-center w-12">Age</th>
                      <th className="p-3">Opening Bal</th>
                      <th className="p-3">Deposit</th>
                      <th className="p-3">Interest Added</th>
                      <th className="p-3 text-right">Closing Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {ssySchedule.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 text-slate-700 dark:text-slate-200">
                        <td className="p-3 text-center font-bold text-slate-400">{item.year}</td>
                        <td className="p-3 text-center font-bold text-slate-500">{item.age}</td>
                        <td className="p-3 font-mono">{formatINR(item.openingBalance)}</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-500 font-semibold">
                          {item.deposit > 0 ? "+" + formatINR(item.deposit) : "₹0"}
                        </td>
                        <td className="p-3 font-mono text-indigo-500 font-medium">+{formatINR(item.interest)}</td>
                        <td className="p-3 font-mono font-extrabold text-right">{formatINR(item.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* PPF Schedule */}
          {activeScheme === "ppf" && ppfSchedule.length > 0 && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Table className="w-4 h-4" /> PPF Annual Maturity Breakdown
                </h4>
              </div>
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-extrabold uppercase sticky top-0">
                      <th className="p-3 text-center w-12">Year</th>
                      <th className="p-3">Opening Bal</th>
                      <th className="p-3">Deposit</th>
                      <th className="p-3">Interest Added</th>
                      <th className="p-3 text-right">Closing Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {ppfSchedule.map((item) => (
                      <tr key={item.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 text-slate-700 dark:text-slate-200">
                        <td className="p-3 text-center font-bold text-slate-400">{item.year}</td>
                        <td className="p-3 font-mono">{formatINR(item.openingBalance)}</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-500 font-semibold">+{formatINR(item.deposit)}</td>
                        <td className="p-3 font-mono text-indigo-500 font-medium">+{formatINR(item.interest)}</td>
                        <td className="p-3 font-mono font-extrabold text-right">{formatINR(item.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* NPS Schedule */}
          {activeScheme === "nps" && npsSchedule.length > 0 && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Table className="w-4 h-4" /> NPS Annual Corpus Accumulation
                </h4>
              </div>
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-extrabold uppercase sticky top-0">
                      <th className="p-3 text-center w-12">Year</th>
                      <th className="p-3">Opening Bal</th>
                      <th className="p-3">Deposits (Annual)</th>
                      <th className="p-3">Interest Added</th>
                      <th className="p-3 text-right">Closing Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {npsSchedule.map((item) => (
                      <tr key={item.year} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 text-slate-700 dark:text-slate-200">
                        <td className="p-3 text-center font-bold text-slate-400">{item.year}</td>
                        <td className="p-3 font-mono">{formatINR(item.openingBalance)}</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-500 font-semibold">+{formatINR(item.deposits)}</td>
                        <td className="p-3 font-mono text-indigo-500 font-medium">+{formatINR(item.interest)}</td>
                        <td className="p-3 font-mono font-extrabold text-right">{formatINR(item.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* RD Schedule */}
          {activeScheme === "rd" && rdSchedule.length > 0 && (
            <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
              <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
                <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                  <Table className="w-4 h-4" /> RD Monthly Amortization Table
                </h4>
              </div>
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[11px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-extrabold uppercase sticky top-0">
                      <th className="p-3 text-center w-12">Month</th>
                      <th className="p-3">Opening Bal</th>
                      <th className="p-3">Deposit</th>
                      <th className="p-3">Interest Credited</th>
                      <th className="p-3 text-right">Closing Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {rdSchedule.map((item) => (
                      <tr key={item.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 text-slate-700 dark:text-slate-200">
                        <td className="p-3 text-center font-bold text-slate-400">{item.month}</td>
                        <td className="p-3 font-mono">{formatINR(item.openingBalance)}</td>
                        <td className="p-3 font-mono text-emerald-600 dark:text-emerald-500 font-semibold">+{formatINR(item.deposit)}</td>
                        <td className="p-3 font-mono text-indigo-500 font-medium">
                          {item.interest > 0 ? "+" + formatINR(item.interest) : "₹0 (Accruing)"}
                        </td>
                        <td className="p-3 font-mono font-extrabold text-right">{formatINR(item.closingBalance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
