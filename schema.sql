-- ============================================================================
-- ALL INDIA CENTRALIZED JOB PORTAL - PRODUCTION SUPABASE SCHEMA
-- Zero-Cost PostgreSQL Architecture with Deduplication & Compliance
-- ============================================================================

-- 1. Enable Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Master Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('government', 'private')),
    sector TEXT DEFAULT 'General',                       -- Central, State, IT, Banking, Railway, Engineering, etc.
    department_or_company TEXT NOT NULL,                -- SSC, UPSC, Google, Swiggy, TCS, etc.
    location TEXT DEFAULT 'All India',                  -- State, City, or Remote
    qualification TEXT DEFAULT 'Not Specified',         -- 10th, 12th, Graduate, B.Tech, Diploma, PG
    last_date TEXT DEFAULT 'Open until filled',          -- Deadline date or string
    salary TEXT DEFAULT 'Competitive / As per Norms',   -- Salary or Pay Scale
    apply_url TEXT UNIQUE NOT NULL,                     -- Primary Unique Link (Prevents duplicate entries)
    official_pdf TEXT,                                  -- Direct PDF URL or Official Notice Board URL
    has_direct_pdf BOOLEAN DEFAULT FALSE,               -- Verified active direct PDF flag
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
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
CREATE INDEX IF NOT EXISTS idx_jobs_created_at ON public.jobs (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_dept_company ON public.jobs (department_or_company);
CREATE INDEX IF NOT EXISTS idx_jobs_location ON public.jobs (location);

-- Full-Text Search GIN Index for instantaneous sub-millisecond search
CREATE INDEX IF NOT EXISTS idx_jobs_fts ON public.jobs 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(department_or_company, '') || ' ' || coalesce(location, '') || ' ' || coalesce(sector, '') || ' ' || coalesce(qualification, '')));

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

-- Allow service_role full read/write access to jobs
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
