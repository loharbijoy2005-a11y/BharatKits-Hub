"use client";
import React, { useState, useEffect } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { BigNumber } from "bignumber.js";
import { Calculator, Users, Plus, Trash2, Download, Receipt, Copy, Check } from "lucide-react";

interface InvoiceItem {
  id: string;
  name: string;
  amount: number;
  gstRate: number;
  isInclusive: boolean;
}

export default function GstSplitter() {
  const [currency, setCurrency] = useState<string>("₹");
  
  // Single calculator inputs
  const [baseAmount, setBaseAmount] = useState<string>("");
  const [gstRate, setGstRate] = useState<number>(18);
  const [customGstRate, setCustomGstRate] = useState<string>("");
  const [isInclusive, setIsInclusive] = useState<boolean>(false);
  const [splitCount, setSplitCount] = useState<number>(1);

  // Single calculator results
  const [totals, setTotals] = useState({
    base: new BigNumber(0),
    gst: new BigNumber(0),
    cgst: new BigNumber(0),
    sgst: new BigNumber(0),
    total: new BigNumber(0),
    share: new BigNumber(0),
  });

  // Invoice list features
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([]);
  const [newItem, setNewItem] = useState({ name: "", amount: "", gstRate: 18, isInclusive: false });
  const [copied, setCopied] = useState(false);

  // Slabs list
  const gstSlabs = [5, 12, 18, 28];

  // Re-run single GST calculations
  useEffect(() => {
    const rate = customGstRate !== "" ? parseFloat(customGstRate) || 0 : gstRate;
    const amountVal = new BigNumber(baseAmount || 0);
    const countVal = new BigNumber(splitCount || 1);

    let base = new BigNumber(0);
    let gst = new BigNumber(0);
    let total = new BigNumber(0);

    if (isInclusive) {
      total = amountVal;
      // GST = Total - (Total / (1 + (Rate / 100)))
      const divisor = new BigNumber(1).plus(new BigNumber(rate).div(100));
      base = total.div(divisor);
      gst = total.minus(base);
    } else {
      base = amountVal;
      // GST = Base * (Rate / 100)
      gst = base.times(new BigNumber(rate).div(100));
      total = base.plus(gst);
    }

    const cgst = gst.div(2);
    const sgst = gst.div(2);
    const share = total.div(countVal);

    setTotals({
      base,
      gst,
      cgst,
      sgst,
      total,
      share,
    });
  }, [baseAmount, gstRate, customGstRate, isInclusive, splitCount]);

  const handleAddInvoiceItem = () => {
    const amt = parseFloat(newItem.amount);
    if (!newItem.name.trim() || isNaN(amt) || amt <= 0) return;

    setInvoiceItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        amount: amt,
        gstRate: newItem.gstRate,
        isInclusive: newItem.isInclusive,
      },
    ]);
    setNewItem({ name: "", amount: "", gstRate: 18, isInclusive: false });
  };

  const handleRemoveInvoiceItem = (id: string) => {
    setInvoiceItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Compile Invoice totals
  const getInvoiceTotals = () => {
    let baseSum = new BigNumber(0);
    let gstSum = new BigNumber(0);
    let totalSum = new BigNumber(0);

    invoiceItems.forEach((item) => {
      const amt = new BigNumber(item.amount);
      if (item.isInclusive) {
        const div = new BigNumber(1).plus(new BigNumber(item.gstRate).div(100));
        const itemBase = amt.div(div);
        baseSum = baseSum.plus(itemBase);
        gstSum = gstSum.plus(amt.minus(itemBase));
        totalSum = totalSum.plus(amt);
      } else {
        const itemGst = amt.times(new BigNumber(item.gstRate).div(100));
        baseSum = baseSum.plus(amt);
        gstSum = gstSum.plus(itemGst);
        totalSum = totalSum.plus(amt.plus(itemGst));
      }
    });

    return {
      base: baseSum,
      gst: gstSum,
      total: totalSum,
    };
  };

  const invoiceTotals = getInvoiceTotals();

  const handleCopySummary = () => {
    const { base, gst, total } = invoiceTotals;
    let summaryText = `--- OMNIKITS INVOICE SUMMARY ---\n`;
    invoiceItems.forEach((item, idx) => {
      const taxType = item.isInclusive ? "Inclusive" : "Exclusive";
      summaryText += `${idx + 1}. ${item.name}: ${currency}${item.amount} (${item.gstRate}% GST ${taxType})\n`;
    });
    summaryText += `--------------------------------\n`;
    summaryText += `Subtotal (Base): ${currency}${base.toFixed(2)}\n`;
    summaryText += `Total Tax (GST): ${currency}${gst.toFixed(2)}\n`;
    summaryText += `Grand Total: ${currency}${total.toFixed(2)}\n`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadInvoice = () => {
    const { base, gst, total } = invoiceTotals;
    const invoiceDoc = {
      items: invoiceItems,
      totals: {
        baseAmount: base.toNumber(),
        gstAmount: gst.toNumber(),
        grandTotal: total.toNumber(),
      },
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(invoiceDoc, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `omnikits_invoice_${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const format = (bn: BigNumber) => {
    return currency + bn.toNumber().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Input parameters Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
          <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
            Quick Bill Parameters
          </h3>

          {/* Currency selection & Amount */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">Base Amount</label>
            <div className="flex gap-2.5">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-20 px-2 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-150"
              >
                <option value="₹">₹ (INR)</option>
                <option value="$">$ (USD)</option>
                <option value="€">€ (EUR)</option>
                <option value="£">£ (GBP)</option>
              </select>
              <input
                type="number"
                placeholder="0.00"
                value={baseAmount}
                onChange={(e) => setBaseAmount(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/50 font-extrabold text-slate-800 dark:text-slate-150"
              />
            </div>
          </div>

          {/* Inclusive / Exclusive */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">GST Treatment</label>
            <div className="grid grid-cols-2 gap-2 bg-slate-100/50 dark:bg-slate-950 p-1 rounded-xl border border-slate-200/50 dark:border-slate-850">
              <button
                type="button"
                onClick={() => setIsInclusive(false)}
                className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                  !isInclusive
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                GST Exclusive (+ tax)
              </button>
              <button
                type="button"
                onClick={() => setIsInclusive(true)}
                className={`py-2 text-xs font-extrabold rounded-lg transition-all ${
                  isInclusive
                    ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-sm"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
                }`}
              >
                GST Inclusive (tax incl.)
              </button>
            </div>
          </div>

          {/* Rates preset */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">GST Rate (%)</label>
            <div className="grid grid-cols-4 gap-2">
              {gstSlabs.map((rate) => (
                <button
                  key={rate}
                  type="button"
                  onClick={() => {
                    setGstRate(rate);
                    setCustomGstRate("");
                  }}
                  className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                    gstRate === rate && customGstRate === ""
                      ? "bg-brand-600 text-white border-brand-600 shadow-sm"
                      : "border-slate-200 dark:border-slate-800 hover:bg-slate-55 dark:hover:bg-slate-900 text-slate-500"
                  }`}
                >
                  {rate}%
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] text-slate-400 uppercase font-bold shrink-0">Custom Rate</span>
              <input
                type="number"
                placeholder="Or enter custom rate %"
                value={customGstRate}
                onChange={(e) => setCustomGstRate(e.target.value)}
                className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150"
              />
            </div>
          </div>

          {/* Split Bill count */}
          <div className="space-y-2 border-t border-slate-105 dark:border-slate-800 pt-4">
            <div className="flex justify-between items-center text-xs font-bold text-slate-700 dark:text-slate-350 uppercase tracking-wide">
              <span>Split Bill Between</span>
              <input
                type="number"
                min="1"
                max="100"
                value={splitCount}
                onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-12 text-center bg-transparent border-b border-slate-300 dark:border-slate-700 focus:border-brand-500 focus:outline-none font-bold text-slate-800 dark:text-slate-150"
              />
            </div>
            <input
              type="range"
              min="1"
              max="20"
              value={splitCount}
              onChange={(e) => setSplitCount(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600 dark:accent-brand-400"
            />
          </div>
        </div>
      </div>

      {/* Calculations output & invoice summary list Side */}
      <div className="lg:col-span-7 space-y-6">
        {/* Quick Calculations Result Dashboard */}
        <div className="bg-gradient-to-tr from-brand-600 to-indigo-600 dark:from-brand-950/40 dark:to-indigo-950/40 text-white p-6 rounded-3xl border border-brand-500/25 shadow-lg relative overflow-hidden">
          <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-white/5 dark:bg-brand-500/5 rounded-full blur-3xl"></div>
          <div className="relative space-y-5">
            <span className="text-[10px] uppercase tracking-widest font-black opacity-75">Calculation Result</span>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 pt-2">
              <div>
                <span className="text-xs opacity-75 block font-medium">Base Amount</span>
                <span className="text-xl font-bold">{format(totals.base)}</span>
              </div>
              <div>
                <span className="text-xs opacity-75 block font-medium">CGST (Tax / 2)</span>
                <span className="text-xl font-bold">{format(totals.cgst)}</span>
              </div>
              <div>
                <span className="text-xs opacity-75 block font-medium">SGST (Tax / 2)</span>
                <span className="text-xl font-bold">{format(totals.sgst)}</span>
              </div>
              <div>
                <span className="text-xs opacity-75 block font-medium">Total GST Tax</span>
                <span className="text-xl font-bold text-indigo-200 dark:text-indigo-300">{format(totals.gst)}</span>
              </div>
              <div className="col-span-2 border-t border-white/20 dark:border-slate-800/50 sm:border-t-0 sm:border-l sm:border-white/20 sm:pl-6 pt-4 sm:pt-0">
                <span className="text-xs opacity-75 block font-extrabold uppercase">Grand Total Bill</span>
                <span className="text-3xl font-black text-white">{format(totals.total)}</span>
              </div>
            </div>
            
            {splitCount > 1 && (
              <div className="bg-white/10 dark:bg-slate-900/40 border border-white/10 dark:border-slate-800/30 p-4 rounded-2xl mt-4 flex items-center justify-between">
                <div>
                  <span className="text-xs opacity-75 block font-medium">Per Person Share</span>
                  <span className="text-2xl font-black text-white">{format(totals.share)}</span>
                </div>
                <div className="text-right">
                  <Users className="w-8 h-8 opacity-40" />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Invoice Summary Builder */}
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-6">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <CardTitle>Invoice Ledger Summary</CardTitle>
              <CardDescription>Compile a list of multiple tax-grouped items</CardDescription>
            </div>
            {invoiceItems.length > 0 && (
              <div className="flex gap-2">
                <button
                  onClick={handleCopySummary}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-colors"
                  title="Copy Text Ledger"
                >
                  {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleDownloadInvoice}
                  className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 transition-colors"
                  title="Download JSON Ledger"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Add Item form */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-900">
            <div className="sm:col-span-4">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Item Description</span>
              <input
                type="text"
                placeholder="Item name"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150"
              />
            </div>
            <div className="sm:col-span-3">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Price</span>
              <input
                type="number"
                placeholder="Amount"
                value={newItem.amount}
                onChange={(e) => setNewItem((prev) => ({ ...prev, amount: e.target.value }))}
                className="w-full mt-1.5 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150"
              />
            </div>
            <div className="sm:col-span-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">GST %</span>
              <select
                value={newItem.gstRate}
                onChange={(e) => setNewItem((prev) => ({ ...prev, gstRate: parseInt(e.target.value) }))}
                className="w-full mt-1.5 px-2 py-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150"
              >
                <option value={5}>5%</option>
                <option value={12}>12%</option>
                <option value={18}>18%</option>
                <option value={28}>28%</option>
              </select>
            </div>
            <div className="sm:col-span-3 flex items-center justify-between gap-2 mt-2 sm:mt-0">
              <label className="flex items-center gap-1.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={newItem.isInclusive}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, isInclusive: e.target.checked }))}
                  className="w-3.5 h-3.5 text-brand-650 rounded border-slate-350"
                />
                <span className="text-[10px] font-bold text-slate-500">Tax Incl.</span>
              </label>
              
              <Button type="button" size="sm" onClick={handleAddInvoiceItem} className="h-8">
                <Plus className="w-3.5 h-3.5 mr-1" /> Add
              </Button>
            </div>
          </div>

          {/* Ledger Table */}
          {invoiceItems.length > 0 ? (
            <div className="space-y-4">
              <div className="border border-slate-150 dark:border-slate-800 rounded-2xl overflow-hidden">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-800 text-slate-400 font-extrabold uppercase">
                      <th className="p-3">Item</th>
                      <th className="p-3">Base Price</th>
                      <th className="p-3 text-center">GST Rate</th>
                      <th className="p-3 text-right">Final Amount</th>
                      <th className="p-3 text-center w-12">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {invoiceItems.map((item) => {
                      const baseItemAmt = new BigNumber(item.amount);
                      let displayBase = baseItemAmt;
                      let displayTotal = baseItemAmt;
                      if (item.isInclusive) {
                        const div = new BigNumber(1).plus(new BigNumber(item.gstRate).div(100));
                        displayBase = baseItemAmt.div(div);
                      } else {
                        const tax = baseItemAmt.times(new BigNumber(item.gstRate).div(100));
                        displayTotal = baseItemAmt.plus(tax);
                      }
                      return (
                        <tr key={item.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/20 text-slate-750 dark:text-slate-200">
                          <td className="p-3 font-semibold">{item.name}</td>
                          <td className="p-3 font-mono">{currency}{displayBase.toFixed(2)}</td>
                          <td className="p-3 text-center font-bold text-slate-500">{item.gstRate}% {item.isInclusive ? "(Incl)" : ""}</td>
                          <td className="p-3 text-right font-mono font-extrabold">{currency}{displayTotal.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleRemoveInvoiceItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Cumulative totals */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-500 font-semibold">
                  <span>Ledger Subtotal (Base)</span>
                  <span className="font-mono">{format(invoiceTotals.base)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-500 font-semibold">
                  <span>Ledger Accumulated GST</span>
                  <span className="font-mono">{format(invoiceTotals.gst)}</span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-slate-800/40 pt-2 text-slate-850 dark:text-white font-extrabold">
                  <span>Ledger Grand Total</span>
                  <span className="font-mono text-sm text-brand-650 dark:text-brand-400">{format(invoiceTotals.total)}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Receipt className="w-8 h-8 mx-auto text-slate-200 dark:text-slate-800 mb-2" />
              <p className="text-xs font-semibold">Ledger is empty</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Add items above to compile dynamic ledger reports.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
