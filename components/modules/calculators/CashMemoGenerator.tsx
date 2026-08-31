"use client";
import React, { useState } from "react";
import { CardDescription, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { BigNumber } from "bignumber.js";
import { Receipt, Plus, Trash2, Download, RefreshCw, FileText, Check } from "lucide-react";

interface BillItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  gstRate: number; // %
}

// Convert numbers to Indian Rupees Words
function convertNumberToWords(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return "Zero Rupees Only";

  const singleDigits = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const doubleDigits = ["", "Ten", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teenDigits = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];

  const formatTens = (num: number): string => {
    if (num < 10) return singleDigits[num];
    if (num >= 10 && num < 20) return teenDigits[num - 10];
    return doubleDigits[Math.floor(num / 10)] + " " + singleDigits[num % 10];
  };

  const convertGroup = (num: number, suffix: string): string => {
    if (num === 0) return "";
    let str = "";
    if (num >= 100) {
      str += singleDigits[Math.floor(num / 100)] + " Hundred ";
      num %= 100;
    }
    if (num > 0) {
      str += formatTens(num) + " ";
    }
    return str + suffix + " ";
  };

  let remainder = rounded;
  let words = "";

  // Crore (1,00,00,000)
  const crore = Math.floor(remainder / 10000000);
  remainder %= 10000000;
  words += convertGroup(crore, "Crore");

  // Lakh (10,00,000)
  const lakh = Math.floor(remainder / 100000);
  remainder %= 100000;
  words += convertGroup(lakh, "Lakh");

  // Thousand (1,000)
  const thousand = Math.floor(remainder / 1000);
  remainder %= 1000;
  words += convertGroup(thousand, "Thousand");

  // Hundreds and units
  words += convertGroup(remainder, "");

  return `Rupees ${words.trim()} Only`;
}

export default function CashMemoGenerator() {
  // Merchant details
  const [shopName, setShopName] = useState<string>("Ganesh Kirana & General Store");
  const [shopGstin, setShopGstin] = useState<string>("27AAAAA1111A1Z1");
  const [shopAddress, setShopAddress] = useState<string>("Main Road Market, Ward No. 5, Patna, Bihar");
  const [shopPhone, setShopPhone] = useState<string>("9876543210");

  // Bill details
  const [billNo, setBillNo] = useState<string>(`INV-${Date.now().toString().slice(-6)}`);
  const [billDate, setBillDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [custName, setCustName] = useState<string>("");
  const [custPhone, setCustPhone] = useState<string>("");
  const [isInterstate, setIsInterstate] = useState<boolean>(false);

  // Bill items
  const [items, setItems] = useState<BillItem[]>([
    { id: "1", name: "Basmati Rice (Premium)", price: 80, qty: 5, gstRate: 5 },
    { id: "2", name: "Fortune Mustard Oil 1L", price: 160, qty: 2, gstRate: 12 },
  ]);

  const [newItem, setNewItem] = useState({ name: "", price: "", qty: "1", gstRate: 5 });
  const [generating, setGenerating] = useState<boolean>(false);

  const handleAddItem = () => {
    const prc = parseFloat(newItem.price);
    const qt = parseInt(newItem.qty);
    if (!newItem.name.trim() || isNaN(prc) || prc <= 0 || isNaN(qt) || qt <= 0) return;

    setItems((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newItem.name.trim(),
        price: prc,
        qty: qt,
        gstRate: newItem.gstRate,
      },
    ]);
    setNewItem({ name: "", price: "", qty: "1", gstRate: 5 });
  };

  const handleRemoveItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Compile calculations using BigNumber
  const getTotals = () => {
    let subtotal = new BigNumber(0);
    let totalGst = new BigNumber(0);

    items.forEach((item) => {
      const rowBase = new BigNumber(item.price).times(item.qty);
      const rowTax = rowBase.times(new BigNumber(item.gstRate).div(100));
      subtotal = subtotal.plus(rowBase);
      totalGst = totalGst.plus(rowTax);
    });

    const grandTotal = subtotal.plus(totalGst);

    return {
      subtotal: subtotal.toNumber(),
      totalGst: totalGst.toNumber(),
      grandTotal: grandTotal.toNumber(),
    };
  };

  const { subtotal, totalGst, grandTotal } = getTotals();

  const handleGenerateInvoicePdf = async () => {
    if (items.length === 0) {
      alert("Please add at least one item to the invoice!");
      return;
    }
    setGenerating(true);

    try {
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595.28, 841.89]); // A4 Page size
      const { width, height: pageHeight } = page.getSize();

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

      let currentY = pageHeight - 50;

      // Draw Cash Memo Border Box
      page.drawRectangle({
        x: 30,
        y: 30,
        width: width - 60,
        height: pageHeight - 60,
        borderWidth: 1,
        borderColor: rgb(0.8, 0.8, 0.8),
        color: rgb(1, 1, 1),
      });

      // Shop Name Header
      page.drawText(shopName.toUpperCase(), {
        x: 50,
        y: currentY,
        size: 16,
        font: boldFont,
        color: rgb(0.09, 0.38, 0.92), // Accent blue
      });
      
      page.drawText("RETAIL CASH MEMO / INVOICE", {
        x: width - 210,
        y: currentY + 3,
        size: 10,
        font: boldFont,
        color: rgb(0.4, 0.4, 0.4),
      });
      currentY -= 15;

      // Shop Details
      page.drawText(`${shopAddress} | Phone: ${shopPhone}`, {
        x: 50,
        y: currentY,
        size: 9,
        font: font,
        color: rgb(0.3, 0.3, 0.3),
      });
      currentY -= 12;

      if (shopGstin) {
        page.drawText(`GSTIN: ${shopGstin}`, {
          x: 50,
          y: currentY,
          size: 9,
          font: boldFont,
          color: rgb(0.2, 0.2, 0.2),
        });
        currentY -= 15;
      }

      // Divider line
      page.drawLine({
        start: { x: 40, y: currentY },
        end: { x: width - 40, y: currentY },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= 18;

      // Invoice Details Block (Bill No, Date, Customer details)
      page.drawText(`Invoice No: ${billNo}`, { x: 50, y: currentY, size: 9, font: boldFont });
      page.drawText(`Date: ${billDate}`, { x: width - 150, y: currentY, size: 9, font: font });
      currentY -= 14;

      if (custName) {
        page.drawText(`Billed To: ${custName} ${custPhone ? "(" + custPhone + ")" : ""}`, {
          x: 50,
          y: currentY,
          size: 9,
          font: font,
        });
        currentY -= 16;
      }

      // Items Table Headers
      page.drawRectangle({
        x: 40,
        y: currentY - 4,
        width: width - 80,
        height: 18,
        color: rgb(0.95, 0.95, 0.95),
      });

      page.drawText("S.No", { x: 45, y: currentY, size: 8, font: boldFont });
      page.drawText("Item Name", { x: 80, y: currentY, size: 8, font: boldFont });
      page.drawText("Qty", { x: 300, y: currentY, size: 8, font: boldFont });
      page.drawText("Rate", { x: 340, y: currentY, size: 8, font: boldFont });
      page.drawText("GST %", { x: 395, y: currentY, size: 8, font: boldFont });
      page.drawText("Final Price", { x: 480, y: currentY, size: 8, font: boldFont });
      currentY -= 20;

      // Table Rows
      items.forEach((item, idx) => {
        const rowBase = new BigNumber(item.price).times(item.qty);
        const rowTax = rowBase.times(new BigNumber(item.gstRate).div(100));
        const finalPrice = rowBase.plus(rowTax).toNumber();

        page.drawText(String(idx + 1), { x: 45, y: currentY, size: 9, font: font });
        page.drawText(item.name, { x: 80, y: currentY, size: 9, font: font });
        page.drawText(String(item.qty), { x: 300, y: currentY, size: 9, font: font });
        page.drawText("Rs." + item.price.toFixed(2), { x: 340, y: currentY, size: 9, font: font });
        page.drawText(`${item.gstRate}%`, { x: 395, y: currentY, size: 9, font: font });
        page.drawText("Rs." + finalPrice.toFixed(2), { x: 480, y: currentY, size: 9, font: boldFont });
        currentY -= 16;
      });

      currentY -= 10;
      page.drawLine({
        start: { x: 40, y: currentY },
        end: { x: width - 40, y: currentY },
        thickness: 1,
        color: rgb(0.8, 0.8, 0.8),
      });
      currentY -= 18;

      // Summary totals (Subtotal, GST Split, Grand Total)
      const halfX = width / 2;
      page.drawText(`Subtotal (Base): Rs.${subtotal.toFixed(2)}`, { x: halfX + 30, y: currentY, size: 9, font: font });
      currentY -= 14;

      if (isInterstate) {
        page.drawText(`IGST Output: Rs.${totalGst.toFixed(2)}`, { x: halfX + 30, y: currentY, size: 9, font: font });
        currentY -= 14;
      } else {
        const halfGst = totalGst / 2;
        page.drawText(`CGST Output (Local): Rs.${halfGst.toFixed(2)}`, { x: halfX + 30, y: currentY, size: 9, font: font });
        currentY -= 14;
        page.drawText(`SGST Output (Local): Rs.${halfGst.toFixed(2)}`, { x: halfX + 30, y: currentY, size: 9, font: font });
        currentY -= 14;
      }

      // Grand Total
      page.drawRectangle({
        x: halfX + 20,
        y: currentY - 4,
        width: width - halfX - 60,
        height: 18,
        color: rgb(0.95, 0.95, 0.98),
      });

      page.drawText(`Grand Total: Rs.${grandTotal.toFixed(2)}`, {
        x: halfX + 30,
        y: currentY,
        size: 10,
        font: boldFont,
        color: rgb(0.09, 0.38, 0.92),
      });
      
      // Amount in words
      const amountWords = convertNumberToWords(grandTotal);
      page.drawText(amountWords, {
        x: 50,
        y: currentY,
        size: 8,
        font: boldFont,
        color: rgb(0.4, 0.4, 0.4),
      });

      currentY -= 50;

      // Declarations & Signatures boxes
      page.drawText("Terms & Conditions:", { x: 50, y: currentY, size: 8, font: boldFont, color: rgb(0.5, 0.5, 0.5) });
      page.drawText("1. Goods once sold will not be taken back.", { x: 50, y: currentY - 12, size: 8, font: font, color: rgb(0.5, 0.5, 0.5) });
      page.drawText("2. Interest @18% will be charged if unpaid.", { x: 50, y: currentY - 22, size: 8, font: font, color: rgb(0.5, 0.5, 0.5) });

      page.drawText("For " + shopName, { x: width - 200, y: currentY, size: 9, font: boldFont });
      page.drawText("Authorized Signatory", { x: width - 200, y: currentY - 35, size: 8, font: font });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes as any], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `cash_memo_${billNo.toLowerCase()}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("PDF Invoice print failure:", err);
      alert("Error printing invoice memo. Check entries and retry.");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Configuration Side */}
      <div className="lg:col-span-7 space-y-6">
        {/* Merchant & Customer block */}
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Merchant & Billing Details
          </h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Shop / Merchant Name</span>
              <input
                type="text"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Shop GSTIN (Optional)</span>
              <input
                type="text"
                value={shopGstin}
                onChange={(e) => setShopGstin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
              />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Address & Phone Contact</span>
              <div className="grid grid-cols-3 gap-2">
                <input
                  type="text"
                  value={shopAddress}
                  placeholder="Shop Address"
                  onChange={(e) => setShopAddress(e.target.value)}
                  className="col-span-2 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                />
                <input
                  type="text"
                  value={shopPhone}
                  placeholder="Phone"
                  onChange={(e) => setShopPhone(e.target.value)}
                  className="col-span-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-semibold"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100 dark:border-slate-850">
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Customer Name</span>
              <input
                type="text"
                placeholder="Ramesh Gupta (Optional)"
                value={custName}
                onChange={(e) => setCustName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
              />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wide">Customer Phone</span>
              <input
                type="text"
                placeholder="987654XXXX (Optional)"
                value={custPhone}
                onChange={(e) => setCustPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-xs focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-850 dark:text-slate-150 font-bold"
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-slate-105 dark:border-slate-850">
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isInterstate}
                onChange={(e) => setIsInterstate(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded border-slate-350"
              />
              <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Interstate Sale (Apply IGST)</span>
            </label>
          </div>
        </div>

        {/* Add items Row list builder */}
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-2">
            Invoice Ledger Items
          </h3>
          
          <div className="grid grid-cols-12 gap-2.5 items-end bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-900">
            <div className="col-span-12 sm:col-span-5">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Item Description</span>
              <input
                type="text"
                placeholder="e.g. Mustard Oil"
                value={newItem.name}
                onChange={(e) => setNewItem((prev) => ({ ...prev, name: e.target.value }))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
              />
            </div>
            
            <div className="col-span-4 sm:col-span-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Rate</span>
              <input
                type="number"
                placeholder="Price"
                value={newItem.price}
                onChange={(e) => setNewItem((prev) => ({ ...prev, price: e.target.value }))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
              />
            </div>
            
            <div className="col-span-3 sm:col-span-2">
              <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">Qty</span>
              <input
                type="number"
                placeholder="Qty"
                value={newItem.qty}
                onChange={(e) => setNewItem((prev) => ({ ...prev, qty: e.target.value }))}
                className="w-full mt-1 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
              />
            </div>
            
            <div className="col-span-5 sm:col-span-3 flex items-center justify-between gap-2.5">
              <div className="flex-grow">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold">GST %</span>
                <select
                  value={newItem.gstRate}
                  onChange={(e) => setNewItem((prev) => ({ ...prev, gstRate: parseInt(e.target.value) }))}
                  className="w-full mt-1 px-2 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-xs focus:outline-none"
                >
                  <option value={0}>0%</option>
                  <option value={5}>5%</option>
                  <option value={12}>12%</option>
                  <option value={18}>18%</option>
                  <option value={28}>28%</option>
                </select>
              </div>
              
              <Button type="button" size="sm" onClick={handleAddItem} className="h-9 self-end mb-0.5">
                Add
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bill Preview Side */}
      <div className="lg:col-span-5 space-y-6">
        <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5">
          <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-2">
            <CardTitle>Cash Memo Preview</CardTitle>
            <Receipt className="w-5 h-5 text-brand-600" />
          </div>

          {items.length > 0 ? (
            <div className="space-y-4">
              {/* Itemized preview summary list */}
              <div className="border border-slate-150 dark:border-slate-850 rounded-2xl overflow-hidden max-h-[220px] overflow-y-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-150 dark:border-slate-850 text-slate-400 font-extrabold uppercase sticky top-0">
                      <th className="p-2.5">Item</th>
                      <th className="p-2.5 text-center">Qty x Rate</th>
                      <th className="p-2.5 text-right">Total</th>
                      <th className="p-2.5 text-center w-8"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-900">
                    {items.map((item) => {
                      const rowBase = new BigNumber(item.price).times(item.qty);
                      const rowTax = rowBase.times(new BigNumber(item.gstRate).div(100));
                      const finalPrice = rowBase.plus(rowTax).toNumber();
                      return (
                        <tr key={item.id} className="text-slate-700 dark:text-slate-205">
                          <td className="p-2.5 font-semibold">
                            {item.name} <span className="text-[8px] font-black text-brand-600">({item.gstRate}%)</span>
                          </td>
                          <td className="p-2.5 text-center font-mono">
                            {item.qty} x ₹{item.price}
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold">
                            ₹{finalPrice.toFixed(1)}
                          </td>
                          <td className="p-2.5 text-center">
                            <button
                              onClick={() => handleRemoveItem(item.id)}
                              className="text-red-500 hover:text-red-700 p-1"
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

              {/* Accumulator stats */}
              <div className="bg-slate-50 dark:bg-slate-950 p-4 rounded-2xl border border-slate-150 dark:border-slate-850 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-550">
                  <span>Subtotal (Base)</span>
                  <span className="font-mono">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-slate-550">
                  <span>GST Output</span>
                  <span className="font-mono">₹{totalGst.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between items-center border-t border-slate-200/50 dark:border-slate-800/40 pt-2 text-slate-850 dark:text-white font-extrabold text-sm">
                  <span>Grand Total</span>
                  <span className="font-mono text-brand-600 dark:text-brand-400">₹{Math.round(grandTotal).toLocaleString()}</span>
                </div>
                <div className="text-[9px] text-slate-400 text-center italic mt-1 font-semibold">
                  {convertNumberToWords(grandTotal)}
                </div>
              </div>

              {/* Generate PDF Button */}
              <Button
                onClick={handleGenerateInvoicePdf}
                disabled={generating}
                className="w-full py-3 flex items-center justify-center gap-1.5"
              >
                {generating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" /> Rendering Invoice PDF...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" /> Download Cash Memo PDF
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
              <Receipt className="w-8 h-8 mx-auto text-slate-200 dark:text-slate-800 mb-2 animate-pulse" />
              <p className="text-xs font-semibold">Invoice items ledger is empty</p>
              <p className="text-[10px] text-slate-400 mt-0.5">Configure details and add item products to generate invoice sheets.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
