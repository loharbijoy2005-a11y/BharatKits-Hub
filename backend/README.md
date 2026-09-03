# 🤖 Backend Scraper & Database Pipeline

This backend powers the 100% automated **All India Job Portal** with zero running costs ($0/mo).

## 📁 Architecture & Flow
```text
backend/
├── requirements.txt      # Python dependencies
├── scraper.py            # Main scraper + deduplication + Supabase upsert
├── supabase_schema.sql   # PostgreSQL table definition, indexes & RLS policies
└── README.md             # Documentation
```

## ⚙️ Prerequisites
- Python 3.10+
- Free [Supabase](https://supabase.com) Project (PostgreSQL database)

## 🚀 Setup & Local Execution

1. **Install Dependencies:**
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Configure Environment Variables (`backend/.env`):**
   ```env
   SUPABASE_URL=https://your-project-id.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here
   ```

3. **Run Scraper Pipeline:**
   ```bash
   # Run live ingestion to Supabase
   python scraper.py

   # Or run a dry-run test without writing to remote DB
   python scraper.py --dry-run

   # Or export scraped data to a local JSON file
   python scraper.py --export-json output.json
   ```

## 🛡️ Deduplication Algorithm
Every job item is fingerprint-hashed using SHA-256 derived from `category`, `organization`, `title`, and `canonical URL`. This ensures:
- Identical job ads across RSS feeds are never inserted twice.
- Upsert logic updates existing entries with fresh dates without creating duplicates.
