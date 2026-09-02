"use client";
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import {
  FileCode2,
  Download,
  Printer,
  Upload,
  Copy,
  Check,
  RefreshCw,
  Sliders,
  Eye,
  Code,
  Award,
  Receipt,
  CreditCard,
  Building2,
  UserCheck,
  ZoomIn,
  ZoomOut,
  FileCheck2,
} from "lucide-react";
import confetti from "canvas-confetti";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Preset Templates
interface TemplatePreset {
  id: string;
  name: string;
  category: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  html: string;
  css: string;
  defaultOrientation?: "portrait" | "landscape";
  defaultPageSize?: "a4" | "letter" | "legal" | "a5" | "id-card";
}

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: "gst-invoice",
    name: "GST Tax Invoice",
    category: "Business & Billing",
    icon: Receipt,
    description: "Professional Indian GST invoice with itemized table, tax breakdown, and signature.",
    defaultOrientation: "portrait",
    defaultPageSize: "a4",
    html: `<div class="invoice-box">
  <div class="header">
    <div class="company-details">
      <h1 class="company-name">BHARAT ENTERPRISES</h1>
      <p class="company-sub">Complete Digital & Hardware Solutions</p>
      <p>124, MG Road, Commercial Complex, Sector 18, Noida - 201301</p>
      <p><strong>GSTIN:</strong> 07AAAAA0000A1Z5 | <strong>PAN:</strong> AAAAA0000A</p>
      <p><strong>Email:</strong> billing@bharatenterprises.in | <strong>Phone:</strong> +91 98765 43210</p>
    </div>
    <div class="invoice-meta">
      <div class="badge">TAX INVOICE</div>
      <table class="meta-table">
        <tr>
          <td><strong>Invoice No:</strong></td>
          <td>BE/2026/0482</td>
        </tr>
        <tr>
          <td><strong>Date:</strong></td>
          <td>02-Sep-2026</td>
        </tr>
        <tr>
          <td><strong>Place of Supply:</strong></td>
          <td>Uttar Pradesh (09)</td>
        </tr>
        <tr>
          <td><strong>Due Date:</strong></td>
          <td>Immediate</td>
        </tr>
      </table>
    </div>
  </div>

  <div class="billing-row">
    <div class="bill-col">
      <h3>Billed To (Customer):</h3>
      <p class="client-name">M/s Sharma Retail Agency</p>
      <p>Shop No. 12, Main Market, Lucknow, UP - 226001</p>
      <p><strong>GSTIN:</strong> 09BBBBB1111B1Z2</p>
      <p><strong>Contact:</strong> Rajesh Sharma (+91 91234 56789)</p>
    </div>
    <div class="bill-col">
      <h3>Shipped To / Consignee:</h3>
      <p class="client-name">M/s Sharma Retail Agency</p>
      <p>Warehouse Block 4, Transport Nagar, Lucknow - 226012</p>
      <p><strong>State Code:</strong> 09 (Uttar Pradesh)</p>
      <p><strong>Vehicle No:</strong> UP 32 AZ 8901</p>
    </div>
  </div>

  <table class="items-table">
    <thead>
      <tr>
        <th>#</th>
        <th>Description of Goods / Services</th>
        <th>HSN/SAC</th>
        <th>Qty</th>
        <th>Rate (₹)</th>
        <th>Taxable (₹)</th>
        <th>GST %</th>
        <th>Total (₹)</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>1</td>
        <td>High-Speed Document Scanner Duplex (A4/Legal)</td>
        <td>8471</td>
        <td>2 Nos</td>
        <td>8,500.00</td>
        <td>17,000.00</td>
        <td>18%</td>
        <td>20,060.00</td>
      </tr>
      <tr>
        <td>2</td>
        <td>Heavy Duty Thermal Receipt Printer 80mm USB</td>
        <td>8443</td>
        <td>3 Nos</td>
        <td>2,400.00</td>
        <td>7,200.00</td>
        <td>18%</td>
        <td>8,496.00</td>
      </tr>
      <tr>
        <td>3</td>
        <td>High Gloss PVC Card Laminating Film Roll (100m)</td>
        <td>3920</td>
        <td>5 Pkts</td>
        <td>650.00</td>
        <td>3,250.00</td>
        <td>12%</td>
        <td>3,640.00</td>
      </tr>
      <tr>
        <td>4</td>
        <td>Annual System Maintenance & Onsite Support</td>
        <td>9983</td>
        <td>1 Year</td>
        <td>4,500.00</td>
        <td>4,500.00</td>
        <td>18%</td>
        <td>5,310.00</td>
      </tr>
    </tbody>
  </table>

  <div class="calculation-row">
    <div class="terms-block">
      <h4>Bank Details for NEFT / RTGS / UPI:</h4>
      <p><strong>Bank:</strong> State Bank of India | <strong>Branch:</strong> Sector 18 Noida</p>
      <p><strong>A/C No:</strong> 34098127391 | <strong>IFSC:</strong> SBIN0004210</p>
      <p><strong>UPI ID:</strong> bharatenterprises@sbi</p>
      <br/>
      <h4>Terms & Conditions:</h4>
      <ol>
        <li>Goods once sold will not be taken back or exchanged after 7 days.</li>
        <li>Interest @ 18% p.a. will be charged if bill is unpaid after due date.</li>
        <li>Subject to Noida Jurisdiction only.</li>
      </ol>
    </div>

    <div class="summary-block">
      <table class="summary-table">
        <tr>
          <td>Total Taxable Value:</td>
          <td>₹ 31,950.00</td>
        </tr>
        <tr>
          <td>CGST (9%):</td>
          <td>₹ 2,670.50</td>
        </tr>
        <tr>
          <td>SGST (9%):</td>
          <td>₹ 2,670.50</td>
        </tr>
        <tr>
          <td>IGST (0%):</td>
          <td>₹ 0.00</td>
        </tr>
        <tr>
          <td>Round Off:</td>
          <td>₹ 0.00</td>
        </tr>
        <tr class="grand-total">
          <td>Grand Total:</td>
          <td>₹ 37,506.00</td>
        </tr>
      </table>
      <div class="amount-words">
        <strong>Amount in Words:</strong> Thirty Seven Thousand Five Hundred Six Rupees Only
      </div>
    </div>
  </div>

  <div class="signatures">
    <div class="sign-box">
      <p>Customer Signature & Stamp</p>
    </div>
    <div class="sign-box text-right">
      <p>For <strong>Bharat Enterprises</strong></p>
      <div class="sign-space"></div>
      <p class="sign-label">Authorised Signatory</p>
    </div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e293b;
  background: #ffffff;
  font-size: 11px;
  line-height: 1.4;
}
.invoice-box {
  padding: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #2563eb;
  padding-bottom: 12px;
  margin-bottom: 14px;
}
.company-name {
  font-size: 20px;
  font-weight: 800;
  color: #1e40af;
  letter-spacing: -0.5px;
}
.company-sub {
  font-size: 11px;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 4px;
}
.badge {
  display: inline-block;
  background: #2563eb;
  color: #ffffff;
  padding: 4px 12px;
  font-weight: 800;
  font-size: 12px;
  border-radius: 4px;
  margin-bottom: 6px;
  text-align: center;
  width: 100%;
}
.meta-table td {
  padding: 2px 4px;
  font-size: 10.5px;
}
.billing-row {
  display: flex;
  gap: 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  padding: 10px 14px;
  margin-bottom: 14px;
}
.bill-col {
  flex: 1;
}
.bill-col h3 {
  font-size: 11px;
  font-weight: 700;
  color: #2563eb;
  text-transform: uppercase;
  margin-bottom: 4px;
}
.client-name {
  font-size: 12px;
  font-weight: 700;
  color: #0f172a;
}
.items-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 14px;
}
.items-table th {
  background: #1e40af;
  color: #ffffff;
  padding: 6px 8px;
  font-size: 10px;
  text-transform: uppercase;
  font-weight: 700;
  text-align: left;
}
.items-table td {
  padding: 6px 8px;
  border-bottom: 1px solid #e2e8f0;
  font-size: 10.5px;
}
.items-table tbody tr:nth-child(even) {
  background: #f8fafc;
}
.calculation-row {
  display: flex;
  gap: 16px;
  margin-bottom: 18px;
}
.terms-block {
  flex: 1.2;
  font-size: 9.5px;
  color: #475569;
  background: #f8fafc;
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.terms-block h4 {
  color: #1e293b;
  margin-bottom: 3px;
  font-size: 10px;
}
.terms-block ol {
  padding-left: 14px;
}
.summary-block {
  flex: 1;
}
.summary-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 8px;
}
.summary-table td {
  padding: 3px 6px;
  font-size: 10.5px;
}
.summary-table td:last-child {
  text-align: right;
  font-weight: 600;
}
.grand-total {
  background: #2563eb;
  color: #ffffff;
  font-weight: 800 !important;
  font-size: 13px !important;
}
.grand-total td {
  padding: 6px 8px !important;
}
.amount-words {
  font-size: 9.5px;
  background: #eff6ff;
  border-left: 3px solid #2563eb;
  padding: 6px 8px;
  color: #1e40af;
}
.signatures {
  display: flex;
  justify-content: space-between;
  margin-top: 24px;
  padding-top: 12px;
}
.sign-box {
  width: 200px;
  font-size: 10px;
}
.sign-space {
  height: 45px;
}
.sign-label {
  border-top: 1px dashed #94a3b8;
  padding-top: 4px;
  color: #64748b;
}
.text-right {
  text-align: right;
}`,
  },
  {
    id: "certificate",
    name: "Certificate of Completion",
    category: "Academic & Training",
    icon: Award,
    description: "Elegant landscape certificate with classic border, seal, and signee authority lines.",
    defaultOrientation: "landscape",
    defaultPageSize: "a4",
    html: `<div class="cert-container">
  <div class="cert-border">
    <div class="cert-inner">
      <div class="cert-header">
        <div class="cert-logo">🇮🇳 NATIONAL SKILL EMPOWERMENT COUNCIL</div>
        <h1 class="cert-title">CERTIFICATE OF EXCELLENCE</h1>
        <p class="cert-subtitle">PROUDLY PRESENTED TO</p>
      </div>

      <div class="cert-recipient">
        <h2>Priya Rajesh Sharma</h2>
        <div class="recipient-line"></div>
      </div>

      <div class="cert-body">
        <p>for successfully completing the advanced certification program in</p>
        <h3 class="course-name">Full-Stack Digital Office & Cyber Services</h3>
        <p class="cert-desc">Demonstrating exceptional proficiency in digital government portal operations, encrypted documentation workflows, client data privacy protection, and financial accounting fundamentals with distinction.</p>
      </div>

      <div class="cert-footer">
        <div class="cert-sign">
          <div class="signature-line"></div>
          <strong>Dr. Arvind K. Verma</strong>
          <span>Director of Academic Affairs</span>
        </div>

        <div class="cert-seal">
          <div class="seal-circle">
            <span>OFFICIAL</span>
            <strong>VERIFIED</strong>
            <span>2026</span>
          </div>
          <p class="cert-id">Cert ID: NSEC-2026-8941</p>
        </div>

        <div class="cert-sign">
          <div class="signature-line"></div>
          <strong>Sunita Sen Gupta</strong>
          <span>Chief Executive Officer</span>
        </div>
      </div>
    </div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Georgia', serif;
  background: #fbfbfb;
  color: #1a202c;
}
.cert-container {
  padding: 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cert-border {
  width: 100%;
  border: 8px double #b45309;
  padding: 12px;
  background: #ffffff;
  border-radius: 4px;
}
.cert-inner {
  border: 1.5px solid #d97706;
  padding: 30px 40px;
  text-align: center;
  background: linear-gradient(135deg, #fffbeb 0%, #ffffff 50%, #fef3c7 100%);
}
.cert-logo {
  font-family: 'Segoe UI', sans-serif;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  color: #92400e;
  margin-bottom: 8px;
}
.cert-title {
  font-size: 26px;
  font-weight: 900;
  color: #78350f;
  letter-spacing: 2px;
  text-shadow: 1px 1px 0px rgba(217, 119, 6, 0.2);
  margin-bottom: 4px;
}
.cert-subtitle {
  font-family: 'Segoe UI', sans-serif;
  font-size: 10px;
  font-weight: 700;
  color: #b45309;
  letter-spacing: 3px;
  margin-bottom: 12px;
}
.cert-recipient h2 {
  font-family: 'Georgia', cursive, serif;
  font-size: 32px;
  font-style: italic;
  font-weight: 700;
  color: #1e3a8a;
  margin-bottom: 4px;
}
.recipient-line {
  width: 320px;
  height: 2px;
  background: linear-gradient(to right, transparent, #b45309, transparent);
  margin: 0 auto 14px auto;
}
.cert-body {
  margin-bottom: 24px;
}
.cert-body p {
  font-size: 12px;
  color: #4b5563;
  margin-bottom: 6px;
}
.course-name {
  font-size: 18px;
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 6px;
  text-decoration: underline;
  text-underline-offset: 4px;
}
.cert-desc {
  max-width: 620px;
  margin: 0 auto;
  font-size: 10.5px !important;
  line-height: 1.5;
  color: #64748b !important;
}
.cert-footer {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 20px;
}
.cert-sign {
  width: 180px;
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}
.signature-line {
  height: 35px;
  border-bottom: 1.5px solid #475569;
  margin-bottom: 6px;
}
.cert-sign strong {
  display: block;
  font-size: 11px;
  color: #0f172a;
}
.cert-sign span {
  font-size: 9px;
  color: #64748b;
}
.cert-seal {
  text-align: center;
  font-family: 'Segoe UI', sans-serif;
}
.seal-circle {
  width: 65px;
  height: 65px;
  border: 2px dashed #b45309;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 0 auto 4px auto;
  background: #fef3c7;
  color: #92400e;
}
.seal-circle span {
  font-size: 7px;
  font-weight: 700;
}
.seal-circle strong {
  font-size: 9px;
  letter-spacing: 0.5px;
}
.cert-id {
  font-size: 8px;
  color: #94a3b8;
  letter-spacing: 0.5px;
}`,
  },
  {
    id: "payslip",
    name: "Monthly Salary Slip / Payslip",
    category: "HR & Payroll",
    icon: CreditCard,
    description: "Standard corporate salary slip showing earnings, deductions, PF/ESI, and net payout.",
    defaultOrientation: "portrait",
    defaultPageSize: "a4",
    html: `<div class="payslip-box">
  <div class="payslip-header">
    <h2>APEX INFOTECH INDIA PRIVATE LIMITED</h2>
    <p>Plot 54, Cyber City, Phase 4, Udyog Vihar, Gurugram, Haryana - 122016</p>
    <div class="pay-title">PAYSLIP FOR THE MONTH OF AUGUST 2026</div>
  </div>

  <table class="info-grid">
    <tr>
      <td><strong>Employee Name:</strong></td>
      <td>Amit Kumar Singh</td>
      <td><strong>Employee ID:</strong></td>
      <td>APEX-4920</td>
    </tr>
    <tr>
      <td><strong>Designation:</strong></td>
      <td>Senior Executive - Operations</td>
      <td><strong>Department:</strong></td>
      <td>Operations & Tech</td>
    </tr>
    <tr>
      <td><strong>Date of Joining:</strong></td>
      <td>15-Mar-2022</td>
      <td><strong>Bank Account No:</strong></td>
      <td>XXXXXX9182 (HDFC Bank)</td>
    </tr>
    <tr>
      <td><strong>PAN Number:</strong></td>
      <td>BKAPS8921R</td>
      <td><strong>UAN / PF Number:</strong></td>
      <td>100928374612</td>
    </tr>
    <tr>
      <td><strong>Total Working Days:</strong></td>
      <td>31 Days</td>
      <td><strong>Payable Days:</strong></td>
      <td>31 Days (0 LOP)</td>
    </tr>
  </table>

  <div class="salary-tables">
    <div class="half-col">
      <table class="sal-table">
        <thead>
          <tr>
            <th>EARNINGS</th>
            <th class="text-right">AMOUNT (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Basic Salary</td>
            <td class="text-right">24,000.00</td>
          </tr>
          <tr>
            <td>House Rent Allowance (HRA)</td>
            <td class="text-right">12,000.00</td>
          </tr>
          <tr>
            <td>Conveyance Allowance</td>
            <td class="text-right">3,000.00</td>
          </tr>
          <tr>
            <td>Medical Allowance</td>
            <td class="text-right">2,500.00</td>
          </tr>
          <tr>
            <td>Special Allowance</td>
            <td class="text-right">8,500.00</td>
          </tr>
          <tr class="subtotal-row">
            <td><strong>Gross Earnings (A)</strong></td>
            <td class="text-right"><strong>₹ 50,000.00</strong></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="half-col">
      <table class="sal-table">
        <thead>
          <tr>
            <th>DEDUCTIONS</th>
            <th class="text-right">AMOUNT (₹)</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Provident Fund (Employee PF)</td>
            <td class="text-right">1,800.00</td>
          </tr>
          <tr>
            <td>Professional Tax (PT)</td>
            <td class="text-right">200.00</td>
          </tr>
          <tr>
            <td>Income Tax (TDS)</td>
            <td class="text-right">1,500.00</td>
          </tr>
          <tr>
            <td>Staff Health Insurance</td>
            <td class="text-right">500.00</td>
          </tr>
          <tr>
            <td>Other Recovery</td>
            <td class="text-right">0.00</td>
          </tr>
          <tr class="subtotal-row">
            <td><strong>Total Deductions (B)</strong></td>
            <td class="text-right"><strong>₹ 4,000.00</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <div class="netpay-card">
    <div class="net-left">
      <span>NET SALARY PAYABLE (A - B)</span>
      <h2>₹ 46,000.00</h2>
    </div>
    <div class="net-right">
      <strong>In Words:</strong> Forty Six Thousand Rupees Only
    </div>
  </div>

  <div class="note-box">
    <p><strong>Note:</strong> This is a computer-generated salary slip and requires no physical signature when downloaded via official portal.</p>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #1e293b;
  background: #ffffff;
  font-size: 11px;
}
.payslip-box {
  padding: 24px;
}
.payslip-header {
  text-align: center;
  border-bottom: 2px solid #0f172a;
  padding-bottom: 12px;
  margin-bottom: 14px;
}
.payslip-header h2 {
  font-size: 16px;
  font-weight: 800;
  color: #0f172a;
}
.payslip-header p {
  font-size: 10px;
  color: #64748b;
  margin-top: 2px;
}
.pay-title {
  display: inline-block;
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  font-weight: 700;
  font-size: 11px;
  padding: 3px 14px;
  border-radius: 12px;
  margin-top: 8px;
  letter-spacing: 0.5px;
}
.info-grid {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 16px;
  border: 1px solid #e2e8f0;
}
.info-grid td {
  padding: 5px 8px;
  font-size: 10.5px;
  border: 1px solid #e2e8f0;
}
.info-grid td:nth-child(odd) {
  background: #f8fafc;
  width: 22%;
  color: #475569;
}
.salary-tables {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}
.half-col {
  flex: 1;
}
.sal-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #cbd5e1;
}
.sal-table th {
  background: #334155;
  color: #ffffff;
  padding: 6px 8px;
  font-size: 10px;
  text-align: left;
}
.sal-table td {
  padding: 5px 8px;
  border-bottom: 1px solid #f1f5f9;
  font-size: 10.5px;
}
.subtotal-row {
  background: #f1f5f9;
  border-top: 1.5px solid #94a3b8;
}
.text-right {
  text-align: right;
}
.netpay-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #0f172a;
  color: #ffffff;
  padding: 12px 18px;
  border-radius: 6px;
  margin-bottom: 16px;
}
.net-left span {
  font-size: 9px;
  letter-spacing: 1px;
  color: #94a3b8;
  display: block;
}
.net-left h2 {
  font-size: 18px;
  font-weight: 800;
  color: #38bdf8;
}
.net-right {
  font-size: 10.5px;
  color: #e2e8f0;
}
.note-box {
  background: #f8fafc;
  border: 1px dashed #cbd5e1;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 9.5px;
  color: #64748b;
  text-align: center;
}`,
  },
  {
    id: "letterhead",
    name: "Official Notice / Letterhead",
    category: "Formal & Legal",
    icon: Building2,
    description: "Formal letterhead with reference header, date, subject, structured paragraphs, and sign-off.",
    defaultOrientation: "portrait",
    defaultPageSize: "a4",
    html: `<div class="letter-box">
  <div class="letter-header">
    <div class="org-brand">
      <div class="org-icon">🏛️</div>
      <div>
        <h1>DISTRICT CITIZEN WELFARE FEDERATION</h1>
        <p>Registration No: DCWF/DEL/2021/8492 | Affiliated to State Youth & Citizen Affairs</p>
      </div>
    </div>
    <div class="header-divider"></div>
  </div>

  <div class="ref-row">
    <div><strong>Ref No:</strong> DCWF/GEN/2026/089</div>
    <div><strong>Date:</strong> September 02, 2026</div>
  </div>

  <div class="recipient-box">
    <p>To,</p>
    <p><strong>The Chief Operations Officer / Sub-Divisional Officer</strong></p>
    <p>Municipal Citizen Center & Public Utility Services,</p>
    <p>Sector 12 Complex, Central District, New Delhi - 110001</p>
  </div>

  <div class="subject-line">
    <strong>SUBJECT:</strong> Request for Implementation of Digital Self-Service Cyber Kiosks for Senior Citizens & Students.
  </div>

  <div class="letter-content">
    <p>Respected Sir / Madam,</p>
    
    <p>With reference to the aforementioned subject, we cordially bring to your kind attention the growing need for localized, client-side digital utility centers across residential blocks in the district.</p>

    <p>Currently, citizens face extensive delays when seeking standard document verification, image compression for state examinations, and bill formatting. By adopting local privacy-first offline utility tools, common citizen processing time can be reduced by over 80% without risking citizen Aadhaar or identity data exposure on unauthorized third-party servers.</p>

    <p>Our federation recommends the following immediate actions:</p>
    <ul>
      <li>Provisioning of 4 dedicated digital utility terminals in the primary reception wing.</li>
      <li>Local browser-based PDF compilations for senior pension certificate submissions.</li>
      <li>Free digital assistance counter for students applying for central scholarships.</li>
    </ul>

    <p>We kindly request your esteemed office to schedule a brief consultative session at your earliest convenience to review the implementation framework.</p>

    <p>Thanking you in anticipation.</p>
  </div>

  <div class="letter-sign">
    <p>Yours Sincerely,</p>
    <div class="sign-blank"></div>
    <p><strong>Rajendra Pratap Mehra</strong></p>
    <p class="role">General Secretary & Public Convener</p>
    <p class="role">District Citizen Welfare Federation</p>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Times New Roman', Times, serif;
  color: #111827;
  background: #ffffff;
  font-size: 12px;
  line-height: 1.6;
}
.letter-box {
  padding: 30px 40px;
}
.org-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  text-align: center;
  justify-content: center;
}
.org-icon {
  font-size: 28px;
}
.org-brand h1 {
  font-size: 17px;
  font-weight: 800;
  color: #1e3a8a;
  letter-spacing: 0.5px;
}
.org-brand p {
  font-size: 9.5px;
  color: #4b5563;
}
.header-divider {
  height: 3px;
  background: linear-gradient(to right, #1e3a8a, #d97706, #16a34a);
  margin: 12px 0 16px 0;
}
.ref-row {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  margin-bottom: 16px;
  font-family: Arial, sans-serif;
}
.recipient-box {
  margin-bottom: 14px;
}
.recipient-box p {
  margin-bottom: 2px;
}
.subject-line {
  background: #f3f4f6;
  border-left: 4px solid #1e3a8a;
  padding: 6px 12px;
  margin: 14px 0;
  font-size: 12px;
}
.letter-content p {
  margin-bottom: 12px;
  text-align: justify;
}
.letter-content ul {
  padding-left: 24px;
  margin-bottom: 12px;
}
.letter-content li {
  margin-bottom: 4px;
}
.letter-sign {
  margin-top: 30px;
}
.sign-blank {
  height: 40px;
}
.role {
  font-size: 10.5px;
  color: #4b5563;
}
`,
  },
  {
    id: "id-badge",
    name: "Identity Card / Badge",
    category: "Identity & Security",
    icon: UserCheck,
    description: "Compact dual-side identity card template formatted for standard CR80 badge sizes.",
    defaultOrientation: "portrait",
    defaultPageSize: "id-card",
    html: `<div class="id-card-wrap">
  <div class="id-card front-card">
    <div class="card-header">
      <div class="logo-chip">BHARAT TECH</div>
      <div class="card-tag">OFFICIAL ID</div>
    </div>
    
    <div class="photo-container">
      <div class="avatar-placeholder">
        👤
      </div>
    </div>

    <div class="user-meta">
      <h2 class="user-name">Suresh R. Sharma</h2>
      <p class="user-post">Senior Network Specialist</p>
      <span class="emp-code">EMP ID: BT-8491</span>
    </div>

    <div class="details-list">
      <div><span>Blood Group:</span> <strong>O +ve</strong></div>
      <div><span>Valid Upto:</span> <strong>12/2028</strong></div>
      <div><span>Phone:</span> <strong>+91 98765 01234</strong></div>
    </div>

    <div class="card-bottom">
      AUTHORIZED ACCESS PASS
    </div>
  </div>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: 'Segoe UI', Tahoma, sans-serif;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
}
.id-card-wrap {
  padding: 10px;
}
.id-card {
  width: 260px;
  height: 390px;
  background: #ffffff;
  border-radius: 12px;
  border: 1.5px solid #cbd5e1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-align: center;
}
.card-header {
  background: linear-gradient(135deg, #1e3a8a, #2563eb);
  color: #ffffff;
  padding: 10px 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.logo-chip {
  font-weight: 800;
  font-size: 11px;
  letter-spacing: 1px;
}
.card-tag {
  background: #f59e0b;
  color: #000;
  font-size: 8px;
  font-weight: 800;
  padding: 2px 6px;
  border-radius: 4px;
}
.photo-container {
  margin: 16px auto 8px auto;
}
.avatar-placeholder {
  width: 75px;
  height: 85px;
  background: #e2e8f0;
  border: 2px solid #2563eb;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  margin: 0 auto;
}
.user-name {
  font-size: 14px;
  font-weight: 800;
  color: #0f172a;
}
.user-post {
  font-size: 10px;
  color: #2563eb;
  font-weight: 600;
  margin-top: 1px;
}
.emp-code {
  display: inline-block;
  background: #f1f5f9;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: 4px;
  margin-top: 4px;
  color: #475569;
}
.details-list {
  padding: 10px 18px;
  font-size: 10px;
  text-align: left;
  background: #f8fafc;
  margin: 10px 14px;
  border-radius: 6px;
  border: 1px solid #e2e8f0;
}
.details-list div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}
.details-list span {
  color: #64748b;
}
.card-bottom {
  margin-top: auto;
  background: #0f172a;
  color: #ffffff;
  font-size: 8.5px;
  font-weight: 700;
  padding: 6px 0;
  letter-spacing: 1px;
}`,
  },
  {
    id: "starter-blank",
    name: "Blank HTML5 Canvas",
    category: "Custom Coding",
    icon: Code,
    description: "Clean starter HTML5 structure with responsive typography and flexible container.",
    defaultOrientation: "portrait",
    defaultPageSize: "a4",
    html: `<div class="page-container">
  <header>
    <h1>Document Title</h1>
    <p class="subtitle">Subtitle or department name</p>
  </header>

  <main>
    <section>
      <h2>Section Heading</h2>
      <p>Enter your customized HTML content, tables, lists, or styling here. Everything is rendered locally with zero server retention.</p>
    </section>

    <div class="card">
      <h3>Highlight Card</h3>
      <p>Add notes, notices, receipts, or legal documentation details with complete formatting control.</p>
    </div>
  </main>

  <footer>
    <p>Generated via BharatKits Local HTML-to-PDF Studio</p>
  </footer>
</div>`,
    css: `* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1e293b;
  background: #ffffff;
  padding: 24px;
  line-height: 1.5;
}
header {
  border-bottom: 2px solid #2563eb;
  padding-bottom: 12px;
  margin-bottom: 18px;
}
h1 {
  font-size: 22px;
  color: #0f172a;
}
.subtitle {
  font-size: 12px;
  color: #64748b;
}
section {
  margin-bottom: 18px;
}
h2 {
  font-size: 15px;
  margin-bottom: 6px;
  color: #1e40af;
}
.card {
  background: #eff6ff;
  border-left: 4px solid #2563eb;
  padding: 12px 16px;
  border-radius: 4px;
  margin-top: 14px;
}
.card h3 {
  font-size: 13px;
  color: #1e3a8a;
  margin-bottom: 4px;
}
footer {
  margin-top: 30px;
  padding-top: 12px;
  border-top: 1px solid #e2e8f0;
  font-size: 10px;
  color: #94a3b8;
  text-align: center;
}`,
  },
];

type PageSize = "a4" | "letter" | "legal" | "a5" | "id-card";
type Orientation = "portrait" | "landscape";
type MarginSize = "none" | "narrow" | "standard" | "wide";

const PAGE_DIMENSIONS: Record<PageSize, { widthMm: number; heightMm: number; name: string }> = {
  a4: { widthMm: 210, heightMm: 297, name: "A4 Standard (210 × 297 mm)" },
  letter: { widthMm: 215.9, heightMm: 279.4, name: "US Letter (8.5 × 11 in)" },
  legal: { widthMm: 215.9, heightMm: 355.6, name: "US Legal (8.5 × 14 in)" },
  a5: { widthMm: 148, heightMm: 210, name: "A5 Compact (148 × 210 mm)" },
  "id-card": { widthMm: 85.6, heightMm: 125, name: "ID Card / Badge (CR80)" },
};

export default function HtmlPdfStudio() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("gst-invoice");
  const [htmlCode, setHtmlCode] = useState<string>(TEMPLATE_PRESETS[0].html);
  const [cssCode, setCssCode] = useState<string>(TEMPLATE_PRESETS[0].css);
  const [activeEditorTab, setActiveEditorTab] = useState<"html" | "css">("html");

  // Page Settings
  const [pageSize, setPageSize] = useState<PageSize>("a4");
  const [orientation, setOrientation] = useState<Orientation>("portrait");
  const [margin, setMargin] = useState<MarginSize>("standard");
  const [zoomScale, setZoomScale] = useState<number>(100);
  const [watermark, setWatermark] = useState<string>("");
  const [includeBackgrounds, setIncludeBackgrounds] = useState<boolean>(true);
  const [documentTitle, setDocumentTitle] = useState<string>("BharatKits_Document");

  // UI state
  const [copied, setCopied] = useState<boolean>(false);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [previewZoom, setPreviewZoom] = useState<number>(100);
  const [splitViewMobile, setSplitViewMobile] = useState<"editor" | "preview">("preview");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  // Load Preset
  const handleLoadTemplate = (tpl: TemplatePreset) => {
    setSelectedTemplate(tpl.id);
    setHtmlCode(tpl.html);
    setCssCode(tpl.css);
    if (tpl.defaultOrientation) setOrientation(tpl.defaultOrientation);
    if (tpl.defaultPageSize) setPageSize(tpl.defaultPageSize);
    setDocumentTitle(tpl.name.replace(/[^a-zA-Z0-9_-]/g, "_"));
  };

  // Construct combined document HTML for preview and print
  const getCompiledDocumentHtml = () => {
    const marginMap: Record<MarginSize, string> = {
      none: "0mm",
      narrow: "5mm",
      standard: "10mm",
      wide: "20mm",
    };

    const currentMargin = marginMap[margin];

    const watermarkHtml = watermark.trim()
      ? `<div style="
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 60px;
          font-weight: 900;
          color: rgba(148, 163, 184, 0.18);
          pointer-events: none;
          z-index: 9999;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 6px;
          user-select: none;
        ">${watermark}</div>`
      : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${documentTitle}</title>
  <style>
    @page {
      size: ${pageSize === "id-card" ? "85.6mm 125mm" : pageSize} ${orientation};
      margin: ${currentMargin};
    }
    *, *::before, *::after {
      -webkit-print-color-adjust: ${includeBackgrounds ? "exact" : "economy"} !important;
      print-color-adjust: ${includeBackgrounds ? "exact" : "economy"} !important;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      background-color: #ffffff;
      color: #0f172a;
    }
    .print-content-wrapper {
      position: relative;
      width: 100%;
      box-sizing: border-box;
      padding: ${currentMargin};
      transform-origin: top center;
      zoom: ${zoomScale}%;
    }
    ${cssCode}
  </style>
</head>
<body>
  ${watermarkHtml}
  <div class="print-content-wrapper" id="pdf-root">
    ${htmlCode}
  </div>
</body>
</html>`;
  };

  // Update iframe content when state changes
  useEffect(() => {
    if (iframeRef.current) {
      const iframe = iframeRef.current;
      const doc = iframe.contentDocument || iframe.contentWindow?.document;
      if (doc) {
        doc.open();
        doc.write(getCompiledDocumentHtml());
        doc.close();
      }
    }
  }, [htmlCode, cssCode, pageSize, orientation, margin, zoomScale, watermark, includeBackgrounds, documentTitle]);

  // Handle File Upload (.html or .htm or .txt)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        // Extract embedded style if present
        const styleMatch = content.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
        if (styleMatch && styleMatch[1]) {
          setCssCode(styleMatch[1].trim());
        }

        // Extract body content or use full text
        const bodyMatch = content.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch && bodyMatch[1]) {
          setHtmlCode(bodyMatch[1].trim());
        } else {
          // Remove DOCTYPE, HTML, HEAD tags if full doc
          const cleanHtml = content
            .replace(/<!DOCTYPE[\s\S]*?>/gi, "")
            .replace(/<html[\s\S]*?>/gi, "")
            .replace(/<\/html>/gi, "")
            .replace(/<head[\s\S]*?<\/head>/gi, "");
          setHtmlCode(cleanHtml.trim());
        }
        setDocumentTitle(file.name.replace(/\.[^/.]+$/, ""));
      }
    };
    reader.readAsText(file);
  };

  // Copy code
  const handleCopyCode = () => {
    const fullHtml = getCompiledDocumentHtml();
    navigator.clipboard.writeText(fullHtml);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Download raw HTML file
  const handleDownloadHtml = () => {
    const fullHtml = getCompiledDocumentHtml();
    const blob = new Blob([fullHtml], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${documentTitle || "document"}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // High-Resolution Vector Print to PDF
  const handleVectorPrint = () => {
    const compiledHtml = getCompiledDocumentHtml();
    const printFrame = document.createElement("iframe");
    printFrame.style.position = "fixed";
    printFrame.style.right = "0";
    printFrame.style.bottom = "0";
    printFrame.style.width = "0";
    printFrame.style.height = "0";
    printFrame.style.border = "0";
    document.body.appendChild(printFrame);

    const frameDoc = printFrame.contentDocument || printFrame.contentWindow?.document;
    if (frameDoc) {
      frameDoc.open();
      frameDoc.write(compiledHtml);
      frameDoc.close();

      setTimeout(() => {
        printFrame.contentWindow?.focus();
        printFrame.contentWindow?.print();
        setTimeout(() => {
          document.body.removeChild(printFrame);
        }, 1000);
      }, 400);
    }
  };

  // Direct 1-Click PDF Download via html2canvas & jsPDF
  const handleDirectDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      if (!iframeRef.current) return;
      const iframeDoc = iframeRef.current.contentDocument || iframeRef.current.contentWindow?.document;
      const targetElement = iframeDoc?.getElementById("pdf-root") || iframeDoc?.body;

      if (!targetElement) throw new Error("Could not find document element to render");

      // Calculate canvas dimensions
      const canvas = await (html2canvas as unknown as (el: HTMLElement, opts?: unknown) => Promise<HTMLCanvasElement>)(targetElement as HTMLElement, {
        scale: 2.5, // High DPI clarity
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");

      const dim = PAGE_DIMENSIONS[pageSize];
      const isLandscape = orientation === "landscape";
      const pdfWidthMm = isLandscape ? dim.heightMm : dim.widthMm;
      const pdfHeightMm = isLandscape ? dim.widthMm : dim.heightMm;

      const pdf = new jsPDF({
        orientation: isLandscape ? "l" : "p",
        unit: "mm",
        format: pageSize === "id-card" ? [85.6, 125] : pageSize,
      });

      const imgProps = pdf.getImageProperties(imgData);
      const imgHeight = (imgProps.height * pdfWidthMm) / imgProps.width;

      let heightLeft = imgHeight;
      let position = 0;

      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, pdfWidthMm, imgHeight);
      heightLeft -= pdfHeightMm;

      // Add more pages if content exceeds one sheet
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, pdfWidthMm, imgHeight);
        heightLeft -= pdfHeightMm;
      }

      pdf.save(`${documentTitle || "BharatKits_Document"}.pdf`);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
    } catch (err) {
      console.error("PDF generation failed:", err);
      // Fallback to vector print if canvas fails
      handleVectorPrint();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Calculate simulated preview dimensions
  const getSimulatedSheetStyle = () => {
    const dim = PAGE_DIMENSIONS[pageSize];
    const isLandscape = orientation === "landscape";
    const widthMm = isLandscape ? dim.heightMm : dim.widthMm;
    const heightMm = isLandscape ? dim.widthMm : dim.heightMm;

    return {
      width: "100%",
      maxWidth: isLandscape ? "720px" : "540px",
      minHeight: `${(heightMm / widthMm) * 480}px`,
      aspectRatio: `${widthMm} / ${heightMm}`,
      transform: `scale(${previewZoom / 100})`,
      transformOrigin: "top center",
    };
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Template Selector */}
      <div className="utility-card p-4 sm:p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="p-1.5 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400">
                <FileCode2 className="w-4 h-4" />
              </span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                HTML to PDF Conversion Studio
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Paste raw HTML/CSS code or choose a pre-formatted Cyber Cafe template to instantly generate high-res printable PDF sheets.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".html,.htm,.txt"
              className="hidden"
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-slate-500" />
              Upload HTML File
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleVectorPrint}
              className="gap-1.5 font-bold"
            >
              <Printer className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Print / Vector PDF
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleDirectDownloadPdf}
              disabled={isGeneratingPdf}
              className="gap-1.5 font-bold shadow-md shadow-brand-500/20"
            >
              {isGeneratingPdf ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  Download PDF
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Template Badges */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 whitespace-nowrap">
            Templates:
          </span>
          {TEMPLATE_PRESETS.map((tpl) => {
            const Icon = tpl.icon;
            const isSelected = selectedTemplate === tpl.id;
            return (
              <button
                key={tpl.id}
                onClick={() => handleLoadTemplate(tpl)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 ${
                  isSelected
                    ? "bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-800/60 shadow-xs"
                    : "bg-slate-100/80 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 hover:bg-slate-200/70 dark:hover:bg-slate-800"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tpl.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Mobile Switcher (Editor vs Preview) */}
      <div className="flex lg:hidden justify-center">
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl border border-slate-200/50 dark:border-slate-700/50 w-full max-w-xs">
          <button
            onClick={() => setSplitViewMobile("editor")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              splitViewMobile === "editor"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-slate-500"
            }`}
          >
            HTML / CSS Editor
          </button>
          <button
            onClick={() => setSplitViewMobile("preview")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
              splitViewMobile === "preview"
                ? "bg-white dark:bg-slate-900 text-brand-600 dark:text-brand-400 shadow-xs"
                : "text-slate-500"
            }`}
          >
            Sheet Live Preview
          </button>
        </div>
      </div>

      {/* Main Studio Grid (Split Editor & Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* --- LEFT PANEL: CODE EDITOR & PAGE SETTINGS (6 COLS) --- */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            splitViewMobile === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* Editor Header & Tabs */}
          <div className="utility-card rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/40 overflow-hidden shadow-xs">
            <div className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-950/40 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveEditorTab("html")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeEditorTab === "html"
                      ? "bg-brand-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
                >
                  &lt;HTML Code&gt;
                </button>
                <button
                  onClick={() => setActiveEditorTab("css")}
                  className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                    activeEditorTab === "css"
                      ? "bg-brand-600 text-white shadow-xs"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  }`}
                >
                  &#123; Custom CSS &#125;
                </button>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  title="Copy Full Compiled Document"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={handleDownloadHtml}
                  className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-200/60 dark:hover:bg-slate-800"
                  title="Download .html file"
                >
                  <Download className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Code Textarea */}
            <div className="p-3">
              {activeEditorTab === "html" ? (
                <div className="relative">
                  <textarea
                    value={htmlCode}
                    onChange={(e) => setHtmlCode(e.target.value)}
                    placeholder="Type or paste your HTML markup here..."
                    rows={16}
                    spellCheck={false}
                    className="w-full font-mono text-xs leading-relaxed p-3.5 rounded-2xl bg-slate-950 text-slate-100 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-y"
                  />
                  <div className="text-[10px] text-slate-400 font-mono text-right mt-1 px-1">
                    {htmlCode.split("\n").length} lines • {htmlCode.length} chars
                  </div>
                </div>
              ) : (
                <div className="relative">
                  <textarea
                    value={cssCode}
                    onChange={(e) => setCssCode(e.target.value)}
                    placeholder="Type or paste your custom stylesheet rules here..."
                    rows={16}
                    spellCheck={false}
                    className="w-full font-mono text-xs leading-relaxed p-3.5 rounded-2xl bg-slate-950 text-emerald-300 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-500/50 resize-y"
                  />
                  <div className="text-[10px] text-slate-400 font-mono text-right mt-1 px-1">
                    {cssCode.split("\n").length} lines • {cssCode.length} chars
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Page Setup Configuration Accordion / Card */}
          <div className="utility-card p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/40 space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5 border-b border-slate-100 dark:border-slate-800 pb-2">
              <Sliders className="w-3.5 h-3.5 text-brand-500" />
              Page & Print Output Setup
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Paper Format */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Paper Format
                </label>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(e.target.value as PageSize)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <option value="a4">A4 Standard (210 × 297 mm)</option>
                  <option value="letter">US Letter (8.5 × 11 in)</option>
                  <option value="legal">US Legal (8.5 × 14 in)</option>
                  <option value="a5">A5 Compact (148 × 210 mm)</option>
                  <option value="id-card">ID Card / Badge (85.6 × 125 mm)</option>
                </select>
              </div>

              {/* Orientation */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Orientation
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrientation("portrait")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      orientation === "portrait"
                        ? "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-700"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    Portrait 📄
                  </button>
                  <button
                    onClick={() => setOrientation("landscape")}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      orientation === "landscape"
                        ? "bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border-brand-300 dark:border-brand-700"
                        : "bg-slate-50 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800"
                    }`}
                  >
                    Landscape 📜
                  </button>
                </div>
              </div>

              {/* Margins */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Page Margins
                </label>
                <select
                  value={margin}
                  onChange={(e) => setMargin(e.target.value as MarginSize)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50"
                >
                  <option value="none">Zero Margins (0mm Edge-to-Edge)</option>
                  <option value="narrow">Narrow (5mm)</option>
                  <option value="standard">Standard (10mm Default)</option>
                  <option value="wide">Wide (20mm)</option>
                </select>
              </div>

              {/* Content Zoom Scale */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="font-semibold text-slate-600 dark:text-slate-400">
                    Content Fit Zoom
                  </label>
                  <span className="text-[11px] font-mono text-brand-600 dark:text-brand-400 font-bold">
                    {zoomScale}%
                  </span>
                </div>
                <input
                  type="range"
                  min="60"
                  max="140"
                  step="5"
                  value={zoomScale}
                  onChange={(e) => setZoomScale(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-brand-600"
                />
              </div>

              {/* Watermark */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Security Watermark
                </label>
                <input
                  type="text"
                  value={watermark}
                  onChange={(e) => setWatermark(e.target.value)}
                  placeholder="e.g. CONFIDENTIAL / DRAFT / ORIGINAL"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs uppercase"
                />
              </div>

              {/* Document Filename */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-600 dark:text-slate-400">
                  Output Filename
                </label>
                <input
                  type="text"
                  value={documentTitle}
                  onChange={(e) => setDocumentTitle(e.target.value)}
                  placeholder="BharatKits_Document"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-brand-500/50 text-xs"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 text-xs">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 dark:text-slate-400 font-medium">
                <input
                  type="checkbox"
                  checked={includeBackgrounds}
                  onChange={(e) => setIncludeBackgrounds(e.target.checked)}
                  className="w-4 h-4 rounded text-brand-600 accent-brand-600"
                />
                Include Background Colors & Graphics (Exact Print)
              </label>

              <button
                onClick={() => {
                  setWatermark("");
                  setZoomScale(100);
                  setMargin("standard");
                }}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-[11px]"
              >
                Reset Adjustments
              </button>
            </div>
          </div>
        </div>

        {/* --- RIGHT PANEL: LIVE SHEET PREVIEW (6 COLS) --- */}
        <div
          className={`lg:col-span-6 space-y-4 ${
            splitViewMobile === "editor" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="utility-card rounded-3xl bg-slate-100/70 dark:bg-slate-900/80 border border-slate-200/80 dark:border-slate-800/40 p-4 space-y-3">
            {/* Preview Controls Bar */}
            <div className="flex items-center justify-between gap-2 pb-2 border-b border-slate-200/60 dark:border-slate-800/60">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-500" />
                <span className="text-xs font-extrabold text-slate-800 dark:text-slate-200">
                  Live Paper Sheet Preview
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 font-mono text-slate-500 border border-slate-200/60 dark:border-slate-700/60 uppercase">
                  {pageSize} • {orientation}
                </span>
              </div>

              {/* Preview Zoom Controls */}
              <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <button
                  onClick={() => setPreviewZoom((z) => Math.max(z - 10, 50))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                  title="Zoom Out Preview"
                >
                  <ZoomOut className="w-3.5 h-3.5" />
                </button>
                <span className="text-[11px] font-mono font-bold px-1 text-slate-600 dark:text-slate-300">
                  {previewZoom}%
                </span>
                <button
                  onClick={() => setPreviewZoom((z) => Math.min(z + 10, 150))}
                  className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded"
                  title="Zoom In Preview"
                >
                  <ZoomIn className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Realistic Paper Container */}
            <div
              ref={previewContainerRef}
              className="relative overflow-auto max-h-[640px] flex justify-center p-3 sm:p-6 bg-slate-200/60 dark:bg-slate-950/80 rounded-2xl border border-slate-300/40 dark:border-slate-800/40 scrollbar-thin shadow-inner"
            >
              <div
                style={getSimulatedSheetStyle()}
                className="bg-white text-slate-900 shadow-2xl rounded-sm border border-slate-300/80 transition-all duration-200 relative overflow-hidden flex flex-col"
              >
                {/* Embedded Live Iframe */}
                <iframe
                  ref={iframeRef}
                  title="Document Preview"
                  className="w-full h-full flex-grow border-0 block bg-white min-h-[480px]"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>

            {/* Quick Action Footer below Preview */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                <FileCheck2 className="w-4 h-4 text-emerald-500" />
                <span>Zero server logs • Pure client-side compiled PDF</span>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleVectorPrint}
                  className="flex-1 sm:flex-none gap-1 font-semibold"
                >
                  <Printer className="w-3.5 h-3.5 text-blue-500" />
                  Vector Print
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleDirectDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="flex-1 sm:flex-none gap-1 font-bold"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download .PDF
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
