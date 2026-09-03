<div align="center">

<!-- Hero Banner -->
<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=200&section=header&text=BharatKits%20Hub&fontSize=56&fontColor=fff&fontAlignY=38&desc=%F0%9F%87%AE%F0%9F%87%B3%20All-in-One%20Digital%20Utility%20Hub%20for%20India&descAlignY=60&descSize=18" width="100%"/>

<!-- Live Badges -->
<p>
  <a href="https://bharatkits-hub.vercel.app">
    <img src="https://img.shields.io/badge/%F0%9F%9A%80%20Live%20Demo-bharatkits--hub.vercel.app-4f46e5?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo"/>
  </a>
  <a href="https://github.com/loharbijoy2005-a11y/BharatKits-Hub">
    <img src="https://img.shields.io/badge/GitHub-BharatKits--Hub-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  </a>
  <a href="https://github.com/loharbijoy2005-a11y/BharatKits-Hub/blob/main/LICENSE">
    <img src="https://img.shields.io/badge/License-MIT-22c55e?style=for-the-badge" alt="MIT License"/>
  </a>
  <img src="https://img.shields.io/badge/Next.js-16.3-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js"/>
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ecf8e?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/Deployed%20on-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Made%20for-Digital%20India%20%F0%9F%87%AE%F0%9F%87%B3-FF9933?style=flat-square&labelColor=138808"/>
  <img src="https://img.shields.io/badge/Zero%20Data%20Stored-100%25%20Private-ef4444?style=flat-square"/>
  <img src="https://img.shields.io/badge/100%25%20Client--Side-Browser%20Only-3b82f6?style=flat-square"/>
  <img src="https://img.shields.io/badge/GitHub%20Actions-Automated%20Scraping-2088ff?style=flat-square&logo=github-actions&logoColor=white"/>
</p>

<br/>

> **BharatKits Hub** is a free, open-source, all-in-one digital utility platform built exclusively for Indian citizens, students, government job aspirants, small businesses, and local cyber cafes. Every tool processes data **100% locally in your browser** — zero server uploads, zero data retention, zero cost.

<br/>

</div>

---

## ?? Table of Contents

- [?? What Makes BharatKits Special?](#-what-makes-bharatkits-special)
- [??? All-India Live Job Portal](#?-all-india-live-job-portal)
- [??? Complete Utility Suite](#?-complete-utility-suite)
- [?? Automated Ingestion Engine](#-automated-ingestion-engine)
- [?? Architecture](#-architecture)
- [?? Deploy on Vercel](#-deploy-on-vercel)
- [?? Run Locally](#?-run-locally)
- [?? Privacy & Security](#-privacy--security)
- [?? License & Credits](#-license--credits)

---

## ?? What Makes BharatKits Special?

<div align="center">

| Feature | Details |
|---|---|
| ?? **Zero-Server Architecture** | No citizen data ever leaves your browser |
| ? **100% Free** | No subscriptions, no paywalls, zero running cost |
| ?? **Automated Live Jobs** | GitHub Actions scrapes fresh jobs every 6 hours |
| ??? **Supabase PostgreSQL** | Production-grade database with duplicate-free upserts |
| ?? **10 Sectors Covered** | Teaching, Railway, Defence, Banking, PSU, Private & more |
| ?? **Mobile Responsive** | Fully optimized for mobile & desktop |
| ???? **India-First Design** | Hindi/English, Aadhaar, UPI, GST — all built-in |

</div>

---

## ??? All-India Live Job Portal

<div align="center">

### ?? The Definitive Indian Job Aggregator — Fully Automated

</div>

The **All-India Job Portal** (at `/jobs`) is a 100% automated, production-ready aggregator pulling live listings from three master ingestion pipes:

### ?? Pipe 1 — National Career Service (NCS) Aggregator
```
Source:  ncs.gov.in (Ministry of Labour & Employment)
Covers:  Central Ministries · State Departments · District Offices · Gram Rozgar Sahayak
```

### ?? Pipe 2 — Employment News (Rozgar Samachar) Gazette Extractor
```
Source:  employmentnews.gov.in
Covers:  CSIR/DRDO/ISRO Labs · Central Universities · High Courts · SSC/UPSC/RRB
         State PSCs · Defence Civilian Trades · Autonomous Bodies
```

### ?? Pipe 3 — Multi-Feed Private & Corporate ATS Engine
```
Sources: Greenhouse · Lever · SmartRecruiters · Jobicy · Arbeitnow
Covers:  IT/Software · Core Engineering · Operations · BPO · Remote India Roles
```

### ??? 10 Official Job Sectors

<div align="center">

| # | Sector | Covers |
|---|---|---|
| 1 | ?? **Teaching & Education** | CTET, KVS, NVS, DSSSB, State TET, PRT/TGT/PGT |
| 2 | ?? **Panchayat & Postal** | India Post GDS, Gram Sachiv, Patwari, NHM CHO |
| 3 | ?? **Railway** | RRB NTPC, Group D, RRC, ALP, Ministerial |
| 4 | ??? **Police & Defence** | Constable, SI, CRPF, BSF, CISF, Army Tradesman |
| 5 | ??? **Central SSC & UPSC** | CGL, CHSL, MTS, IAS, IPS, IES, CDS |
| 6 | ?? **State PSC & Subordinate** | WBPSC, UPPSC, BPSC, MPSC, TNPSC, KPSC |
| 7 | ?? **Banking & Finance** | IBPS PO/Clerk, SBI, RBI Grade B, LIC AAO |
| 8 | ?? **PSU & Engineering** | BHEL, ONGC, DRDO, ISRO, SAIL, AAI JE |
| 9 | ?? **Medical & Health** | AIIMS, NHM, ESIC, State Health Dept, ANM, Staff Nurse |
| 10 | ?? **Private & Corporate** | IT, Core Engineering, BPO, Operations, Startups |

</div>

### ? Zero 404 Links Guaranteed

- **Pre-flight HTTP HEAD checks** validate every scraped URL before database insertion
- **Automatic PDF Fallback**: Dead notification PDFs route to the verified parent authority portal
- **URL Sanitizer**: `urllib.parse.urljoin` resolves all relative links; strips `javascript:`, `#`, `void(0)`, and `mailto:` anchors
- **Supabase Dedup**: `ON CONFLICT (job_hash) DO NOTHING` eliminates all duplicates

---

## ??? Complete Utility Suite

<details>
<summary><b>?? PDF Editor & Digital Signer Studio</b></summary>

- Upload & Edit any PDF — drag-and-drop, reorder, rotate, delete pages
- **Digital Signatures (E-Sign)**: Draw freehand, type cursive calligraphic text, or upload a signature scan with auto transparent background
- **Text & Date Annotations**: Click anywhere on the PDF to type styled text
- **Pen & Highlighter Tools**: Freehand markup & translucent highlight layers
- **Whiteout & Blackout Redaction**: Securely mask confidential numbers and details
- **Official Stamp Badges**: 1-click `SELF-ATTESTED`, `APPROVED`, `VERIFIED`, `CONFIDENTIAL`, `ORIGINAL`, `PAID`, `RECEIVED`
- **Client-Side PDF Export**: All edits baked into a new downloadable PDF — zero server logs

</details>

<details>
<summary><b>?? HTML to PDF Studio & Converter</b></summary>

- Direct HTML/CSS code editor with live A4 paper preview
- **Preset Templates**: GST Tax Invoice, Training Certificate, Monthly Salary Slip, Official Letterhead, ID Card/Badge
- **Page Settings**: Portrait/Landscape, custom margins, zoom fit scaling, security watermarks
- **Dual Export**: Instant PDF download + high-res print dialog

</details>

<details>
<summary><b>?? ID Front-Back PDF Combiner</b></summary>

Combine Aadhaar, PAN, or Voter ID front & back scans into a single print-ready A4 PDF.

</details>

<details>
<summary><b>??? Govt Form Image Resizer & Compressor</b></summary>

Resize photo & signature scans to exact government portal specs — under 20KB/50KB for SSC, UPSC, and state exam portals.

</details>

<details>
<summary><b>?? Biodata & Resume Builder</b></summary>

Generate clean CV resumes or marriage biodata forms downloadable as vector PDFs — client-side.

</details>

<details>
<summary><b>?? UPI Payment QR Studio</b></summary>

Generate custom scan-to-pay QR codes with UPI ID, payee name, and fixed amounts.

</details>

<details>
<summary><b>?? GST Cash Memo Generator</b></summary>

Generate itemized shop cash memos with SGST/CGST and automatic Indian Rupee words conversion.

</details>

<details>
<summary><b>?? Affidavit & Legal Draft Builder</b></summary>

Generate printable Rent Agreements, Gap Year Certificates, Address Declarations, and Income Declarations with stamp paper spacing.

</details>

<details>
<summary><b>??? Aadhaar Secure Masker</b></summary>

Upload Aadhaar scan and securely mask the first 8 digits locally — before sharing online.

</details>

<details>
<summary><b>?? Aadhaar QR Scanner & Parser</b></summary>

Scan Aadhaar QR via camera or image file to decode Name, DOB, Gender, and Address with 1-click copy.

</details>

<details>
<summary><b>?? Hindi Font Converter & Typing</b></summary>

Phonetic Hinglish-to-Hindi transliteration editor and Unicode to Kruti Dev 010 font converter.

</details>

<details>
<summary><b>?? Financial & Govt Savings Calculators</b></summary>

- **GST & Bill Splitter**: Precise CGST/SGST/IGST calculator and multi-person bill splitting
- **Loan EMI Calculator**: Monthly amortization schedules
- **Govt Savings Calculator**: SSY, PPF, NPS, Post Office RD return estimator
- **Age & Chrono Engine**: Chronological age, milestone countdowns, zodiac signs

</details>

<details>
<summary><b>??? Govt Portal Directory</b></summary>

Direct filtered links for UIDAI (Aadhaar), Voter ID, DigiLocker, Parivahan (DL/RC), e-Challan, Udyam MSME, Ration Card, and State Land Records (Bhulekh, Banglarbhumi, etc.)

</details>

---

## ?? Automated Ingestion Engine

```
GitHub Actions --- runs every 6 hours (cron: 0 */6 * * *)
        ¦
        ?
  backend/scraper.py
        ¦
        +-- ?? NCSIngestor                    ?  ncs.gov.in (Central / State / District)
        +-- ?? EmploymentNewsGazetteIngestor   ?  employmentnews.gov.in (Gazette)
        +-- ?? MultiFeedPrivateIngestor        ?  Greenhouse / Lever / SmartRecruiters
        ¦
        ?
  URLSanitizer + LinkVerifier (HEAD pre-flight checks)
        ¦
        ?
  Supabase PostgreSQL — ON CONFLICT (job_hash) DO NOTHING
        ¦
        ?
  Next.js /api/jobs  ?  force-dynamic + no-store cache
        ¦
        ?
  Live Frontend at bharatkits-hub.vercel.app/jobs
```

> ?? **Secrets management**: All credentials (`SUPABASE_URL`, `SUPABASE_KEY`) live exclusively in GitHub Secrets and `.env.local` — never committed to git.

---

## ?? Architecture

```
BharatKits Hub (Monorepo)
+-- app/                          # Next.js 16 App Router
¦   +-- api/jobs/route.ts         # Dynamic Supabase-backed API
¦   +-- api/takedown/route.ts     # DMCA / Takedown request handler
¦   +-- jobs/page.tsx             # All-India Job Portal page
+-- backend/                      # Python ingestion engine
¦   +-- scraper.py                # 3-Mega-Source ingestion pipeline
¦   +-- sync_jobs.py              # Supabase ? lib/jobs-data.ts syncer
¦   +-- supabase_schema.sql       # PostgreSQL schema DDL
+-- components/modules/jobs/      # Job Portal UI components
¦   +-- JobPortal.tsx
¦   +-- JobCard.tsx
¦   +-- JobFilter.tsx
¦   +-- JobDetailModal.tsx
¦   +-- JobPortalFooter.tsx
+-- lib/
¦   +-- jobs-data.ts              # Static fallback + 10-sector taxonomy
+-- schema.sql                    # Production Supabase schema
+-- .github/workflows/            # GitHub Actions auto-scraping cron
```

---

## ?? Deploy on Vercel

### Method 1: One-Click GitHub Import (Recommended)

1. Go to [vercel.com](https://vercel.com) ? **Add New Project**
2. Import `BharatKits-Hub` from your GitHub
3. Add **Environment Variables**:

| Variable | Description |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon public key |

4. Click **Deploy** — your live URL will be:

```
https://bharatkits-hub.vercel.app
```

> ? Every push to `main` triggers automatic production re-deployment!

### Method 2: Vercel CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

---

## ?? Run Locally

```bash
# 1. Clone the repository
git clone https://github.com/loharbijoy2005-a11y/BharatKits-Hub.git
cd BharatKits-Hub

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# Fill in NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY

# 4. Start the development server
npm run dev

# 5. Open in browser ? http://localhost:3000
```

### ?? Run the Ingestion Pipeline Manually

```bash
# Install Python dependencies
pip install requests beautifulsoup4 supabase python-dotenv

# Execute the 3-mega-source scraper
python backend/scraper.py --export-json backend/all_scraped_jobs.json

# Sync results to local fallback dataset
python backend/sync_jobs.py
```

---

## ?? Privacy & Security

<div align="center">

| Principle | Implementation |
|---|---|
| ?? **Zero-Server Retention** | No citizen data, Aadhaar scans, or HTML files ever uploaded to any server |
| ?? **100% In-Browser** | All PDF, image, QR, and document tools run via Web APIs in the client |
| ?? **No Tracking** | No Google Analytics, no fingerprinting, no third-party cookies |
| ?? **Secrets Management** | Credentials stored only in GitHub Secrets / `.env.local` |
| ??? **RLS Enabled** | Row-Level Security policies enabled on all Supabase tables |

</div>

---

## ?? License & Credits

<div align="center">

Open-source under the **[MIT License](LICENSE)**

<br/>

Made with ?? for **Digital India** ????

<br/>

**© 2026 Bijoy Lohar. All Rights Reserved.**

*Designed & Maintained by [Bijoy Lohar](https://github.com/loharbijoy2005-a11y)*

<br/>

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,12,20&height=100&section=footer" width="100%"/>

</div>
