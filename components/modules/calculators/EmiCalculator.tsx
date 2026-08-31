"use client";
import React, { useState, useEffect } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BigNumber } from "bignumber.js";
import { Calculator, Calendar, DollarSign, ArrowRight, Table } from "lucide-react";

interface ScheduleItem {
  month: number;
  openingBalance: number;
  emi: number;
  interest: number;
  principal: number;
  closingBalance: number;
}

export default function EmiCalculator() {
  const [principal, setPrincipal] = useState<string>("500000"); // 5 Lakhs default
  const [rate, setRate] = useState<string>("8.5"); // 8.5% default
  const [tenureYears, setTenureYears] = useState<number>(5);

  const [emi, setEmi] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

  useEffect(() => {
    const P = parseFloat(principal);
    const annualR = parseFloat(rate);
    const years = tenureYears;

    if (isNaN(P) || P <= 0 || isNaN(annualR) || annualR <= 0 || years <= 0) {
      setEmi(0);
      setTotalInterest(0);
      setTotalPayment(0);
      setSchedule([]);
      return;
    }

    const n = years * 12; // total months
    const r = annualR / (12 * 100); // monthly interest rate

    // EMI formula: P * r * (1+r)^n / ((1+r)^n - 1)
    const factor = Math.pow(1 + r, n);
    const calculatedEmi = (P * r * factor) / (factor - 1);

    const calculatedTotalPayment = calculatedEmi * n;
    const calculatedTotalInterest = calculatedTotalPayment - P;

    setEmi(calculatedEmi);
    setTotalPayment(calculatedTotalPayment);
    setTotalInterest(calculatedTotalInterest);

    // Amortization Schedule
    const amortSchedule: ScheduleItem[] = [];
    let currentBalance = P;

    for (let i = 1; i <= n; i++) {
      const interestPaid = currentBalance * r;
      const principalPaid = calculatedEmi - interestPaid;
      let closingBalance = currentBalance - principalPaid;
      if (closingBalance < 0 || i === n) closingBalance = 0;

      amortSchedule.push({
        month: i,
        openingBalance: currentBalance,
        emi: calculatedEmi,
        interest: interestPaid,
        principal: principalPaid,
        closingBalance: closingBalance,
      });

      currentBalance = closingBalance;
    }

    setSchedule(amortSchedule);
  }, [principal, rate, tenureYears]);

  const format = (val: number) => {
    return "₹" + Math.round(val).toLocaleString("en-IN");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Parameter Controls */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Loan Configuration
          </h3>

          {/* Loan Principal */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
              <span>Loan Amount</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{format(parseFloat(principal) || 0)}</span>
            </div>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
            />
            <input
              type="range"
              min="50000"
              max="5000000"
              step="50000"
              value={parseFloat(principal) || 50000}
              onChange={(e) => setPrincipal(e.target.value)}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
            />
          </div>

          {/* Interest Rate */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
              <span>Interest Rate (p.a. %)</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{rate}%</span>
            </div>
            <input
              type="number"
              step="0.1"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
            />
            <input
              type="range"
              min="5"
              max="20"
              step="0.1"
              value={parseFloat(rate) || 5}
              onChange={(e) => setRate(e.target.value)}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
            />
          </div>

          {/* Loan Tenure */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
              <span>Tenure (Years)</span>
              <span className="font-mono text-brand-600 dark:text-brand-400">{tenureYears} Years</span>
            </div>
            <input
              type="number"
              value={tenureYears}
              onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
            />
            <input
              type="range"
              min="1"
              max="30"
              value={tenureYears}
              onChange={(e) => setTenureYears(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
            />
          </div>
        </div>
      </div>

      {/* Amortization results Dashboard */}
      <div className="lg:col-span-7 space-y-6">
        <div className="bg-gradient-to-tr from-brand-600 to-indigo-650 dark:from-brand-950/40 dark:to-indigo-950/40 text-white p-6 rounded-3xl border border-brand-500/20 shadow-md">
          <div className="space-y-5">
            <span className="text-[10px] uppercase tracking-widest font-black opacity-75">EMI Calculation Summary</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <span className="text-xs opacity-75 block font-medium">Monthly Loan EMI</span>
                <span className="text-xl font-bold text-brand-200 dark:text-brand-300">{format(emi)}</span>
              </div>
              <div>
                <span className="text-xs opacity-75 block font-medium">Principal Amount</span>
                <span className="text-xl font-bold">{format(parseFloat(principal) || 0)}</span>
              </div>
              <div>
                <span className="text-xs opacity-75 block font-medium">Total Interest Margin</span>
                <span className="text-xl font-bold">{format(totalInterest)}</span>
              </div>
              
              <div className="col-span-2 sm:col-span-3 border-t border-white/10 pt-4 flex justify-between items-center">
                <div>
                  <span className="text-xs opacity-75 block font-extrabold uppercase">Total Accumulated Repayment</span>
                  <span className="text-2xl font-black text-white">{format(totalPayment)}</span>
                </div>
                <Calculator className="w-8 h-8 opacity-30" />
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Amortization table list */}
        {schedule.length > 0 && (
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
            <h4 className="text-xs font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Table className="w-4 h-4" /> Monthly Repayment Amortization Schedule
            </h4>

            <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden max-h-[300px] overflow-y-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-extrabold uppercase sticky top-0">
                    <th className="p-3 text-center w-12">Month</th>
                    <th className="p-3">Opening Bal</th>
                    <th className="p-3">Principal paid</th>
                    <th className="p-3">Interest paid</th>
                    <th className="p-3 text-right">Remaining Bal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                  {schedule.map((item) => (
                    <tr key={item.month} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 text-slate-700 dark:text-slate-205">
                      <td className="p-3 text-center font-bold text-slate-400">{item.month}</td>
                      <td className="p-3 font-mono">{format(item.openingBalance)}</td>
                      <td className="p-3 font-mono text-emerald-600 dark:text-emerald-500 font-semibold">+{format(item.principal)}</td>
                      <td className="p-3 font-mono text-red-500 font-semibold">-{format(item.interest)}</td>
                      <td className="p-3 font-mono font-extrabold text-right">{format(item.closingBalance)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
