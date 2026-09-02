"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { FileSignature, Printer, FileText, Sparkles, Check } from "lucide-react";

type TemplateType = "rent" | "gap" | "address" | "income";

export default function AffidavitGenerator() {
  const [activeTemplate, setActiveTemplate] = useState<TemplateType>("rent");

  // Rent state
  const [rentData, setRentData] = useState({
    ownerName: "Rajesh Kumar",
    tenantName: "Sunil Sharma",
    address: "Flat No. 402, Block B, Sector 62, Noida, Uttar Pradesh - 201301",
    rentAmount: "15000",
    securityDeposit: "30000",
    term: "11",
    startDate: new Date().toISOString().split("T")[0],
  });

  // Gap state
  const [gapData, setGapData] = useState({
    studentName: "Aman Gupta",
    fatherName: "Ramesh Gupta",
    passingYear: "2024",
    gapYears: "2",
    reason: "preparation for Competitive Exams (JEE/NEET)",
    currentYear: new Date().getFullYear().toString(),
  });

  // Address state
  const [addressData, setAddressData] = useState({
    name: "Vikram Singh",
    fatherName: "Baldev Singh",
    age: "28",
    address: "House No. 124, Village Rampur, Dist. Patna, Bihar - 800001",
  });

  // Income state
  const [incomeData, setIncomeData] = useState({
    name: "Preeti Patel",
    fatherName: "Kishore Patel",
    occupation: "Private Employee",
    annualIncome: "450000",
    source: "Salary from Services",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print:m-0 print:p-0 print:bg-white print:text-black">
      {/* Template Selectors */}
      <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100/80 dark:bg-slate-900/60 backdrop-blur rounded-2xl border border-slate-200/30 dark:border-slate-800/30 w-fit max-w-full print:hidden">
        {[
          { id: "rent", label: "Rent Agreement", icon: FileText },
          { id: "gap", label: "Gap Year Affidavit", icon: FileSignature },
          { id: "address", label: "Address Declaration", icon: FileText },
          { id: "income", label: "Income Declaration", icon: FileSignature },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTemplate(tab.id as TemplateType)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 whitespace-nowrap ${
                activeTemplate === tab.id
                  ? "bg-white dark:bg-slate-800 text-brand-600 dark:text-brand-400 shadow-sm"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-150"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* --- FORM PANEL (LEFT) --- */}
        <div className="lg:col-span-5 space-y-6 print:hidden">
          <div className="utility-card p-6 rounded-3xl border shadow-sm space-y-5 bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800/40">
            <h3 className="text-md font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-brand-500" /> Enter Affidavit Details
            </h3>

            {/* RENT AGREEMENT FORM */}
            {activeTemplate === "rent" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-350">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Owner Name (Landlord)</label>
                  <input
                    type="text"
                    value={rentData.ownerName}
                    onChange={(e) => setRentData({ ...rentData, ownerName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Tenant Name</label>
                  <input
                    type="text"
                    value={rentData.tenantName}
                    onChange={(e) => setRentData({ ...rentData, tenantName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Property Address</label>
                  <textarea
                    value={rentData.address}
                    onChange={(e) => setRentData({ ...rentData, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Monthly Rent (₹)</label>
                    <input
                      type="number"
                      value={rentData.rentAmount}
                      onChange={(e) => setRentData({ ...rentData, rentAmount: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Security Deposit (₹)</label>
                    <input
                      type="number"
                      value={rentData.securityDeposit}
                      onChange={(e) => setRentData({ ...rentData, securityDeposit: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Term Duration (Months)</label>
                    <input
                      type="number"
                      value={rentData.term}
                      onChange={(e) => setRentData({ ...rentData, term: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Agreement Start Date</label>
                    <input
                      type="date"
                      value={rentData.startDate}
                      onChange={(e) => setRentData({ ...rentData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200 font-bold"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* GAP YEAR AGREEMENT FORM */}
            {activeTemplate === "gap" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-350">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Student Name</label>
                  <input
                    type="text"
                    value={gapData.studentName}
                    onChange={(e) => setGapData({ ...gapData, studentName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Father&apos;s Name</label>
                  <input
                    type="text"
                    value={gapData.fatherName}
                    onChange={(e) => setGapData({ ...gapData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">12th Passing Year</label>
                    <input
                      type="number"
                      value={gapData.passingYear}
                      onChange={(e) => setGapData({ ...gapData, passingYear: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Gap Duration (Years)</label>
                    <input
                      type="number"
                      value={gapData.gapYears}
                      onChange={(e) => setGapData({ ...gapData, gapYears: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Reason for Gap</label>
                  <input
                    type="text"
                    value={gapData.reason}
                    onChange={(e) => setGapData({ ...gapData, reason: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* ADDRESS SELF-DECLARATION FORM */}
            {activeTemplate === "address" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-350">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Citizen Name</label>
                  <input
                    type="text"
                    value={addressData.name}
                    onChange={(e) => setAddressData({ ...addressData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Father/Husband Name</label>
                    <input
                      type="text"
                      value={addressData.fatherName}
                      onChange={(e) => setAddressData({ ...addressData, fatherName: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Age</label>
                    <input
                      type="number"
                      value={addressData.age}
                      onChange={(e) => setAddressData({ ...addressData, age: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Full Address</label>
                  <textarea
                    value={addressData.address}
                    onChange={(e) => setAddressData({ ...addressData, address: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* INCOME DECLARATION FORM */}
            {activeTemplate === "income" && (
              <div className="space-y-4 text-xs font-bold text-slate-700 dark:text-slate-350">
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Declarant Name</label>
                  <input
                    type="text"
                    value={incomeData.name}
                    onChange={(e) => setIncomeData({ ...incomeData, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Father/Husband Name</label>
                  <input
                    type="text"
                    value={incomeData.fatherName}
                    onChange={(e) => setIncomeData({ ...incomeData, fatherName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Occupation</label>
                    <input
                      type="text"
                      value={incomeData.occupation}
                      onChange={(e) => setIncomeData({ ...incomeData, occupation: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="uppercase tracking-wide">Annual Income (₹)</label>
                    <input
                      type="number"
                      value={incomeData.annualIncome}
                      onChange={(e) => setIncomeData({ ...incomeData, annualIncome: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="uppercase tracking-wide">Source of Income</label>
                  <input
                    type="text"
                    value={incomeData.source}
                    onChange={(e) => setIncomeData({ ...incomeData, source: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-slate-800 dark:text-slate-200"
                  />
                </div>
              </div>
            )}

            {/* Print button */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800/40">
              <Button
                onClick={handlePrint}
                className="w-full py-3 flex items-center justify-center gap-2"
              >
                <Printer className="w-4 h-4" /> Print Document (A4)
              </Button>
              <span className="text-[10px] text-slate-400 font-semibold block text-center mt-2">
                Pressing Print opens standard browser print. Select &quot;Save as PDF&quot; to export.
              </span>
            </div>

          </div>
        </div>

        {/* --- LIVE PREVIEW (RIGHT) --- */}
        <div className="lg:col-span-7 flex justify-center print:w-full print:p-0">
          <div className="printable-document w-full max-w-[800px] bg-white text-slate-900 border border-slate-200 shadow-lg rounded-2xl overflow-hidden flex flex-col font-serif select-text print:border-0 print:shadow-none print:rounded-none">
            
            {/* Professional Stamp Paper Space Placeholder */}
            <div className="p-8 py-12 bg-slate-50/50 dark:bg-slate-900/10 border-b border-dashed border-slate-200/80 dark:border-slate-800/60 text-center flex flex-col items-center justify-center select-none print:h-[10cm] print:p-0 print:bg-transparent print:border-0 print:border-b-0">
              <div className="border border-dashed border-slate-300 dark:border-slate-800 px-6 py-4 rounded-xl max-w-[450px] print:hidden">
                <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400 dark:text-slate-500">
                  [ STAMP PAPER SPACE RESERVATION ]
                </span>
                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-sans mt-2 leading-relaxed">
                  Feed a physical Stamp Paper (₹10, ₹20, ₹50, ₹100) into your printer. The print stylesheet automatically reserves a 10 cm (approx. 4 inches) margin at the top of the A4 sheet to print safely below the header.
                </p>
              </div>
            </div>

            {/* Document Content Box */}
            <div className="p-12 space-y-6 text-sm leading-relaxed text-slate-800 print:p-8 print:text-black">
              
              {/* RENT AGREEMENT CONTENT */}
              {activeTemplate === "rent" && (
                <div className="space-y-6">
                  <h4 className="text-center font-extrabold underline text-base uppercase tracking-wider">
                    RENT AGREEMENT
                  </h4>
                  <p>
                    This Rent Agreement is made and executed on this <strong>{rentData.startDate}</strong> by and between:
                  </p>
                  <p>
                    <strong>{rentData.ownerName}</strong>, hereinafter referred to as the <strong>LANDLORD/OWNER</strong> (which expression shall mean and include his heirs, successors, legal representatives, and assigns) of the ONE PART.
                  </p>
                  <p className="text-center font-bold my-2">AND</p>
                  <p>
                    <strong>{rentData.tenantName}</strong>, hereinafter referred to as the <strong>TENANT</strong> (which expression shall mean and include his heirs, successors, legal representatives, and assigns) of the OTHER PART.
                  </p>
                  <p>
                    WHEREAS the Landlord is the absolute owner of the property situated at: <br />
                    <strong>{rentData.address}</strong>.
                  </p>
                  <p>
                    AND WHEREAS the Tenant has approached the Landlord to take the said premises on rent for residential purposes, and the Landlord has agreed to lease out the same on the following terms and conditions:
                  </p>
                  <ol className="list-decimal pl-5 space-y-3.5">
                    <li>
                      That this lease agreement shall be valid for a period of <strong>{rentData.term} months</strong> starting from <strong>{rentData.startDate}</strong>.
                    </li>
                    <li>
                      That the Tenant shall pay a monthly rent of <strong>₹{rentData.rentAmount}/-</strong> (Rupees {parseInt(rentData.rentAmount).toLocaleString("en-IN")} only) on or before the 5th day of every calendar month.
                    </li>
                    <li>
                      That the Tenant has paid a refundable interest-free security deposit of <strong>₹{rentData.securityDeposit}/-</strong> (Rupees {parseInt(rentData.securityDeposit).toLocaleString("en-IN")} only) to the Landlord, which shall be refunded at the time of vacating the premises.
                    </li>
                    <li>
                      That the Tenant shall pay electricity, water, and maintenance charges according to actual usage.
                    </li>
                  </ol>

                  {/* Signatures */}
                  <div className="pt-16 grid grid-cols-2 gap-8 text-center font-sans font-bold text-xs select-none">
                    <div className="space-y-8">
                      <div className="border-t border-slate-300 pt-2 text-slate-500">Signature of Landlord</div>
                    </div>
                    <div className="space-y-8">
                      <div className="border-t border-slate-300 pt-2 text-slate-500">Signature of Tenant</div>
                    </div>
                  </div>
                </div>
              )}

              {/* GAP YEAR CONTENT */}
              {activeTemplate === "gap" && (
                <div className="space-y-6">
                  <h4 className="text-center font-extrabold underline text-base uppercase tracking-wider">
                    AFFIDAVIT FOR GAP YEAR
                  </h4>
                  <p>
                    I, <strong>{gapData.studentName}</strong>, Son/Daughter of <strong>{gapData.fatherName}</strong>, aged about _____ years, resident of ____________________________________________________, do hereby solemnly affirm and state on oath as under:
                  </p>
                  <ol className="list-decimal pl-5 space-y-4">
                    <li>
                      That I passed my Senior Secondary (12th Class) Examination from ___________________________ Board in the year <strong>{gapData.passingYear}</strong>.
                    </li>
                    <li>
                      That after passing the examination, I did not join any college, university, or academic institution during the gap period of <strong>{gapData.gapYears} year(s)</strong> (from {parseInt(gapData.passingYear)} to {gapData.currentYear}).
                    </li>
                    <li>
                      That during the said gap period, I was engaged in <strong>{gapData.reason}</strong>.
                    </li>
                    <li>
                      That during the said gap period, I was not involved in any illegal activities or criminal acts, and there is no police case pending against me.
                    </li>
                    <li>
                      That I am submitting this affidavit to secure admission in _____________________________________ for the academic session <strong>{gapData.currentYear}</strong>.
                    </li>
                  </ol>
                  <p className="pt-4 font-bold">DEPONENT</p>

                  <h5 className="font-extrabold underline text-xs pt-4 uppercase">Verification:</h5>
                  <p className="text-xs">
                    Verified at Delhi on this _____ day of ____________ {gapData.currentYear} that the contents of the above affidavit are true and correct to the best of my knowledge and belief, and nothing has been concealed therefrom.
                  </p>
                  
                  {/* Signatures */}
                  <div className="pt-12 flex justify-between font-sans font-bold text-xs select-none">
                    <div className="w-1/3 border-t border-slate-300 pt-2 text-center text-slate-500">Witness 1</div>
                    <div className="w-1/3 border-t border-slate-300 pt-2 text-center text-slate-500">Deponent Signature</div>
                  </div>
                </div>
              )}

              {/* ADDRESS CONTENT */}
              {activeTemplate === "address" && (
                <div className="space-y-6">
                  <h4 className="text-center font-extrabold underline text-base uppercase tracking-wider">
                    SELF-DECLARATION OF ADDRESS
                  </h4>
                  <p>
                    I, <strong>{addressData.name}</strong>, Son/Daughter/Wife of <strong>{addressData.fatherName}</strong>, aged about <strong>{addressData.age} years</strong>, resident of: <br />
                    <strong>{addressData.address}</strong>, do hereby solemnly declare and state as under:
                  </p>
                  <ol className="list-decimal pl-5 space-y-4">
                    <li>
                      That I am residing at the above-mentioned address since ______________ (Date/Year).
                    </li>
                    <li>
                      That the address provided above is my true, correct, and current residential address.
                    </li>
                    <li>
                      That I am submitting this self-declaration as a proof of my residential address for the purpose of _________________________________________.
                    </li>
                    <li>
                      That if any information declared above is found to be false or incorrect at a later stage, I shall be held legally responsible under Section 199 and 200 of the Indian Penal Code.
                    </li>
                  </ol>
                  
                  {/* Signatures */}
                  <div className="pt-24 flex justify-between font-sans font-bold text-xs select-none">
                    <div>Date: ________________</div>
                    <div className="w-1/3 border-t border-slate-300 pt-2 text-center text-slate-500">Declarant Signature</div>
                  </div>
                </div>
              )}

              {/* INCOME CONTENT */}
              {activeTemplate === "income" && (
                <div className="space-y-6">
                  <h4 className="text-center font-extrabold underline text-base uppercase tracking-wider">
                    SELF-DECLARATION OF INCOME
                  </h4>
                  <p>
                    I, <strong>{incomeData.name}</strong>, Son/Daughter/Wife of <strong>{incomeData.fatherName}</strong>, residing at ____________________________________________________________________, do hereby declare on oath:
                  </p>
                  <ol className="list-decimal pl-5 space-y-4">
                    <li>
                      That I am currently working as a <strong>{incomeData.occupation}</strong>.
                    </li>
                    <li>
                      That my total annual income from all sources (including {incomeData.source}) is <strong>₹{incomeData.annualIncome}/-</strong> (Rupees {parseInt(incomeData.annualIncome).toLocaleString("en-IN")} only) for the current financial year.
                    </li>
                    <li>
                      That I have no other source of income apart from what has been declared above.
                    </li>
                    <li>
                      That this declaration is made to obtain _________________________________________.
                    </li>
                  </ol>

                  {/* Signatures */}
                  <div className="pt-24 flex justify-between font-sans font-bold text-xs select-none">
                    <div>Date: ________________</div>
                    <div className="w-1/3 border-t border-slate-300 pt-2 text-center text-slate-500">Declarant Signature</div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer stamp warning */}
            <div className="mt-auto p-4 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 font-sans select-none print:hidden">
              <span className="flex items-center justify-center gap-1">
                <Check className="w-3.5 h-3.5 text-green-500" /> Draft is ready for printing on standard stamp paper or green ledger paper.
              </span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
