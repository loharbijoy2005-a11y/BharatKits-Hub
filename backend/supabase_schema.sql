-- ============================================================================
-- ALL INDIA CENTRALIZED JOB PORTAL - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- Complete Classification: Teaching & Education, Panchayat & Postal, Railway,
-- Police & Defence, Central SSC & UPSC, State PSC & Subordinate, Banking & Finance,
-- PSU & Engineering, Medical & Health, Private & Corporate
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Master Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('government', 'private', 'teaching')),
    sector TEXT NOT NULL DEFAULT 'Central SSC & UPSC' CHECK (
        sector IN (
            'Teaching & Education',
            'Panchayat & Postal',
            'Railway',
            'Police & Defence',
            'Central SSC & UPSC',
            'State PSC & Subordinate',
            'Banking & Finance',
            'PSU & Engineering',
            'Medical & Health',
            'Private & Corporate'
        )
    ),
    state TEXT DEFAULT 'All India',                     -- West Bengal, Jharkhand, Uttar Pradesh, Bihar, Delhi NCR, Maharashtra, etc.
    department_or_company TEXT NOT NULL,                -- CTET, KVS, NVS, BPSC, WB SSC, SSC, UPSC, Google, Swiggy, etc.
    qualification TEXT DEFAULT 'Not Specified',         -- B.Ed, D.El.Ed, CTET Qualified, 10th, 12th, Graduate, B.Tech, Master's
    last_date TEXT DEFAULT 'Open until filled',          -- Deadline string / date
    salary TEXT DEFAULT 'Competitive / As per Norms',   -- Salary or Pay Scale
    apply_url TEXT UNIQUE NOT NULL,                     -- Primary Unique Key (Guarantees zero duplicate entries)
    official_pdf TEXT,                                  -- Direct PDF URL or Fallback Official Notice Board URL
    has_direct_pdf BOOLEAN DEFAULT FALSE,               -- Verified active direct PDF flag
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,

    -- Compatibility Aliases for Dual-Engine Ingestion
    job_hash VARCHAR(64),
    department_or_board TEXT,
    company_name TEXT,
    gov_sector TEXT,
    state_or_location TEXT,
    work_location TEXT,
    notification_pdf_url TEXT,
    official_pdf_fallback TEXT,
    vacancies_count INTEGER DEFAULT 0,
    last_date_to_apply TEXT,
    salary_range TEXT,
    fee_details TEXT,
    age_limit TEXT,
    experience_level TEXT,
    employment_type TEXT,
    skills_tags TEXT[] DEFAULT '{}',
    company_logo_url TEXT,
    source_portal TEXT,
    description TEXT,
    posted_date TEXT DEFAULT CURRENT_DATE::text
);

-- 3. Compliance & Takedown Requests Table
CREATE TABLE IF NOT EXISTS public.takedown_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    listing_url TEXT NOT NULL,
    reason TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. High-Performance Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_sector ON public.jobs (sector);
CREATE INDEX IF NOT EXISTS idx_jobs_state ON public.jobs (state);
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_dept_company ON public.jobs (department_or_company);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs (is_active);

-- Full-Text Search GIN Index for instantaneous sub-millisecond search
CREATE INDEX IF NOT EXISTS idx_jobs_fts ON public.jobs 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(department_or_company, '') || ' ' || coalesce(state, '') || ' ' || coalesce(sector, '') || ' ' || coalesce(qualification, '')));

-- 5. Automatic Updated_At Trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trigger_jobs_updated_at ON public.jobs;
CREATE TRIGGER trigger_jobs_updated_at
    BEFORE UPDATE ON public.jobs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 6. Row-Level Security (RLS) Policies
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.takedown_requests ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active jobs
DROP POLICY IF EXISTS "Public users can view active jobs" ON public.jobs;
CREATE POLICY "Public users can view active jobs"
    ON public.jobs
    FOR SELECT
    USING (is_active = TRUE);

-- Allow service_role / automated scraper full access
DROP POLICY IF EXISTS "Service role has full access to jobs" ON public.jobs;
CREATE POLICY "Service role has full access to jobs"
    ON public.jobs
    FOR ALL
    TO anon, authenticated, service_role
    USING (true)
    WITH CHECK (true);

-- Allow public users to submit takedown compliance requests
DROP POLICY IF EXISTS "Public can submit takedown requests" ON public.takedown_requests;
CREATE POLICY "Public can submit takedown requests"
    ON public.takedown_requests
    FOR INSERT
    TO anon, authenticated, service_role
    WITH CHECK (true);

-- ============================================================================
-- 7. Date Parsing Columns (added for universal date normalizer support)
-- ============================================================================

-- Parsed ISO-8601 deadline (NULL for rolling / walk-in / private jobs)
ALTER TABLE public.jobs
    ADD COLUMN IF NOT EXISTS last_date_parsed date,
    ADD COLUMN IF NOT EXISTS is_closed boolean DEFAULT false;

-- Indexes for efficient deadline-based sorting and status filtering
CREATE INDEX IF NOT EXISTS idx_jobs_last_date_parsed ON public.jobs (last_date_parsed ASC NULLS LAST);
CREATE INDEX IF NOT EXISTS idx_jobs_is_closed        ON public.jobs (is_closed);

-- ============================================================================
-- 8. Auto-close Function (call from Supabase CRON or pg_cron)
-- ============================================================================

-- Marks any job whose deadline has already passed as is_closed = true.
-- Run daily via: SELECT update_job_status();
-- Supabase cron (pg_cron extension required):
--   SELECT cron.schedule('daily-job-close', '0 0 * * *', $$SELECT update_job_status()$$);
CREATE OR REPLACE FUNCTION update_job_status() RETURNS void AS $$
BEGIN
    UPDATE public.jobs
    SET    is_closed = true
    WHERE  last_date_parsed IS NOT NULL
      AND  last_date_parsed < CURRENT_DATE
      AND  is_closed = false;

    -- Re-open if date was corrected (upsert scenario)
    UPDATE public.jobs
    SET    is_closed = false
    WHERE  last_date_parsed IS NOT NULL
      AND  last_date_parsed >= CURRENT_DATE
      AND  is_closed = true;
END;
$$ LANGUAGE plpgsql;

