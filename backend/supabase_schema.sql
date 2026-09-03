-- ============================================================================
-- ALL INDIA JOB PORTAL - SUPABASE POSTGRESQL SCHEMA
-- Zero-Cost Production Database with Deduplication & Row-Level Security (RLS)
-- ============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Jobs Table
CREATE TABLE IF NOT EXISTS public.jobs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Deduplication Fingerprint (Unique SHA-256 hash derived from canonical URL + Title)
    job_hash VARCHAR(64) UNIQUE NOT NULL,
    
    -- Dual Categorization: 'government' or 'private'
    category VARCHAR(20) NOT NULL CHECK (category IN ('government', 'private')),
    
    -- Common Fields
    title VARCHAR(300) NOT NULL,
    slug VARCHAR(350),
    description TEXT,
    apply_url TEXT NOT NULL,
    posted_date DATE DEFAULT CURRENT_DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- ========================================================================
    -- Government (Sarkari) Specific Fields
    -- ========================================================================
    department_or_board VARCHAR(150),       -- e.g. SSC, UPSC, RRB, IBPS, State PSC, Police, Defence
    gov_sector VARCHAR(50),                 -- Central, State, Railway, Defence, Banking, PSU, Teaching
    notification_pdf_url TEXT,              -- Official notification PDF link
    vacancies_count INTEGER DEFAULT 0,      -- Number of open posts
    last_date_to_apply DATE,                -- Application deadline
    qualification VARCHAR(200),             -- 10th, 12th, Graduate, B.Tech, Diploma, PG
    age_limit VARCHAR(100),                 -- e.g. 18-30 Years (Relaxation as per norms)
    exam_date VARCHAR(100),                 -- Expected or confirmed exam date
    fee_details VARCHAR(200),               -- e.g. Gen/OBC: ₹100, SC/ST/Female: ₹0
    state_or_location VARCHAR(100) DEFAULT 'All India',
    
    -- ========================================================================
    -- Private Sector Specific Fields
    -- ========================================================================
    company_name VARCHAR(150),              -- e.g. Google, Infosys, Swiggy, TCS, Razorpay
    company_logo_url TEXT,                  -- CDN or public logo URL
    work_location VARCHAR(150),             -- Bengaluru, Remote, Delhi NCR, Mumbai, Hyderabad, Pune
    experience_level VARCHAR(50),           -- Fresher (0-1 yrs), Mid-Level (2-5 yrs), Senior (5+ yrs), Internship
    employment_type VARCHAR(50) DEFAULT 'Full-time', -- Full-time, Part-time, Internship, Contract
    salary_range VARCHAR(100),              -- e.g. ₹6,00,000 - ₹12,00,000 P.A. or ₹25,000/Month
    skills_tags TEXT[] DEFAULT '{}',        -- ['React', 'TypeScript', 'Node.js', 'Python', 'SQL']
    source_portal VARCHAR(100) DEFAULT 'Direct' -- e.g. Greenhouse, Lever, NCS, Company Portal
);

-- 3. Performance & Deduplication Indexes
CREATE INDEX IF NOT EXISTS idx_jobs_category ON public.jobs (category);
CREATE INDEX IF NOT EXISTS idx_jobs_posted_date ON public.jobs (posted_date DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_last_date ON public.jobs (last_date_to_apply DESC);
CREATE INDEX IF NOT EXISTS idx_jobs_is_active ON public.jobs (is_active);
CREATE INDEX IF NOT EXISTS idx_jobs_dept_board ON public.jobs (department_or_board);
CREATE INDEX IF NOT EXISTS idx_jobs_company ON public.jobs (company_name);
CREATE INDEX IF NOT EXISTS idx_jobs_state_loc ON public.jobs (state_or_location);
CREATE INDEX IF NOT EXISTS idx_jobs_experience ON public.jobs (experience_level);

-- Full-Text Search GIN Index for blazing-fast instant search across titles & tags
CREATE INDEX IF NOT EXISTS idx_jobs_fts ON public.jobs 
USING gin(to_tsvector('english', coalesce(title, '') || ' ' || coalesce(department_or_board, '') || ' ' || coalesce(company_name, '') || ' ' || coalesce(qualification, '') || ' ' || coalesce(state_or_location, '')));

-- 4. Automatic Updated At Timestamp Trigger
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

-- 5. Row-Level Security (RLS) Policies
-- Enables public read-only access (anyone can view jobs without logging in)
-- Write operations (INSERT, UPDATE, DELETE) are restricted to backend service-role key
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;

-- Allow anonymous & authenticated users to read active jobs
CREATE POLICY "Public users can view active jobs"
    ON public.jobs
    FOR SELECT
    USING (is_active = TRUE);

-- Allow service_role (used by GitHub Actions Scraper) full read/write access
CREATE POLICY "Service role has full access"
    ON public.jobs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 6. Helper Stored Procedure for Full Text Search (Optional RPC)
CREATE OR REPLACE FUNCTION search_jobs(
    query_text TEXT,
    filter_category TEXT DEFAULT NULL,
    limit_count INT DEFAULT 50,
    offset_count INT DEFAULT 0
)
RETURNS SETOF public.jobs
LANGUAGE sql
STABLE
AS $$
    SELECT *
    FROM public.jobs
    WHERE is_active = TRUE
      AND (filter_category IS NULL OR category = filter_category)
      AND (
          query_text IS NULL 
          OR query_text = '' 
          OR to_tsvector('english', title || ' ' || coalesce(department_or_board, '') || ' ' || coalesce(company_name, '') || ' ' || coalesce(qualification, '')) @@ plainto_tsquery('english', query_text)
          OR title ILIKE '%' || query_text || '%'
          OR department_or_board ILIKE '%' || query_text || '%'
          OR company_name ILIKE '%' || query_text || '%'
          OR state_or_location ILIKE '%' || query_text || '%'
      )
    ORDER BY posted_date DESC, created_at DESC
    LIMIT limit_count
    OFFSET offset_count;
$$;
