# 🇮🇳 All India Job Portal - Complete Setup & Architecture Guide

A 100% automated, production-ready, zero-running-cost ($0/mo) **All India Job Portal** that aggregates both Government (Sarkari) and Private sector jobs across India.

---

## 📂 1. Complete Monorepo Folder Tree

```text
BharatKits-Hub/
├── .github/
│   └── workflows/
│       └── scraper.yml             # GitHub Actions 6-hour cron automation (₹0)
├── backend/
│   ├── requirements.txt            # Python dependencies (requests, bs4, supabase, feedparser)
│   ├── scraper.py                  # Scraper engine + SHA-256 deduplication + Supabase upsert
│   ├── supabase_schema.sql         # PostgreSQL schema, RLS policies, indexes & RPC
│   └── README.md                   # Backend documentation
├── app/
│   ├── api/
│   │   └── jobs/
│   │       └── route.ts            # Next.js App Router API with Supabase & caching
│   ├── jobs/
│   │   ├── page.tsx                # Dedicated /jobs route with SEO metadata
│   │   └── JobPortalClient.tsx     # Client navigation wrapper
│   ├── layout.tsx                  # Global Next.js layout
│   └── page.tsx                    # BharatKits Hub dashboard integrating Job Portal
├── components/
│   └── modules/
│       └── jobs/
│           ├── JobPortal.tsx       # Master portal view & statistics dashboard
│           ├── JobCard.tsx         # Responsive card (Govt vs Private with PDF & Apply buttons)
│           ├── JobFilter.tsx       # Dual-tab category switcher, search & filters
│           └── JobDetailModal.tsx  # Full eligibility breakdown, WhatsApp share & dates
├── lib/
│   ├── jobs-data.ts                # TypeScript interfaces & verified seed dataset
│   └── utils.ts                    # Utility helper functions
├── public/                         # Static assets & favicons
├── package.json                    # Next.js dependencies & scripts
└── JOB_PORTAL_SETUP.md             # This complete setup guide
```

---

## 🗄️ 2. Supabase Free Database Setup ($0/mo)

1. Create a free account at [Supabase.com](https://supabase.com).
2. Click **"New Project"**, name it `bharatkits-jobs`, choose the nearest region (e.g. `ap-south-1` Mumbai), and set a database password.
3. Once the database is provisioned, navigate to the **SQL Editor** tab on the left sidebar.
4. Open [backend/supabase_schema.sql](file:///d:/BharatKits%20Hub/backend/supabase_schema.sql), paste the entire script into the Supabase SQL editor, and click **RUN**.
5. Go to **Project Settings -> API** and copy:
   - **Project URL:** `https://xxxxxxxxxxxx.supabase.co`
   - **anon / public key:** `eyJh...`
   - **service_role key (secret):** `eyJh...` *(keep this confidential)*

---

## ⚡ 3. GitHub Actions Setup (Automated Scraping Every 6 Hours)

The scraping engine is scheduled via `.github/workflows/scraper.yml` using GitHub's free 2,000 monthly runner minutes.

1. Go to your GitHub repository -> **Settings -> Secrets and variables -> Actions**.
2. Click **"New repository secret"** and add the following secrets:
   - `SUPABASE_URL`: Your Supabase Project URL (`https://your-id.supabase.co`)
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase `service_role` secret key.
3. To trigger the scraper manually at any time:
   - Go to your repository's **Actions** tab.
   - Select **"All India Job Scraper Pipeline"** on the left.
   - Click **"Run workflow"** -> **"Run workflow"**.

---

## 💻 4. Local Development & Testing

### A. Run Frontend (Next.js)
```bash
# Install dependencies
npm install

# Start development server
npm run dev
```
Open your browser at `http://localhost:3000` (Main Dashboard) or `http://localhost:3000/jobs` (Dedicated Job Portal).

### B. Run Backend Scraper Locally
```bash
# Navigate to backend
cd backend

# Install Python requirements
pip install -r requirements.txt

# Run dry-run test (does not write to remote DB)
python scraper.py --dry-run

# Run live scraping and export to local JSON file
python scraper.py --export-json scraped_jobs.json

# Run live ingestion to Supabase (create a .env file with your SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY)
python scraper.py
```

---

## 🚀 5. Free 1-Click Deployment to Vercel

1. Push your code to GitHub (see step 6 below).
2. Go to [Vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your GitHub repository.
4. Add the following Environment Variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`: `https://your-id.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: `your-supabase-anon-key`
5. Click **"Deploy"**. Your portal is now live with global edge caching!

---

## 🛠️ 6. Step-by-Step Terminal Commands to Initialize & Push to GitHub

Run these commands in your project root terminal:

```bash
# 1. Initialize git (if not already initialized)
git init

# 2. Add all files to staging
git add .

# 3. Commit your changes
git commit -m "feat: Add production All India Job Portal monorepo with 6hr automated scraper, Supabase schema, and Next.js frontend"

# 4. Set default branch to main
git branch -M main

# 5. Link your GitHub remote repository (replace with your repo URL)
# Example: git remote add origin https://github.com/your-username/bharatkits-job-portal.git
git remote add origin <YOUR_GITHUB_REPOSITORY_URL>

# 6. Push code to GitHub
git push -u origin main
```

---

## 🛡️ Deduplication & Reliability Features
- **SHA-256 Fingerprint Hash:** Every job is digested into a unique 64-character hash combining the category, organization, cleaned title, and canonical URL.
- **Graceful Offline Fallback:** If Supabase has downtime or credentials are not yet set, the Next.js API automatically falls back to the embedded 30+ verified jobs dataset.
- **Zero Cost Architecture:** Operates entirely on free tiers of GitHub Actions, Supabase, and Vercel.
