import { NextRequest, NextResponse } from "next/server";
import { INITIAL_JOBS_DATA, Job } from "@/lib/jobs-data";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const sector = searchParams.get("sector") || "All Sectors";
    const state = searchParams.get("state") || "All India";
    const board = searchParams.get("board") || "All Boards";
    const qualification = searchParams.get("qualification") || "All Qualifications";
    const query = (searchParams.get("search") || "").toLowerCase().trim();

    // 1. Fetch live jobs strictly from environment variables
    const supabaseUrl =
      process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.SUPABASE_URL;

    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_KEY;

    let allJobs: Job[] = INITIAL_JOBS_DATA;

    if (supabaseUrl && supabaseKey) {
      try {
        const url = new URL(`${supabaseUrl}/rest/v1/jobs`);
        url.searchParams.set("select", "*");
        url.searchParams.set("is_active", "eq.true");
        url.searchParams.set("order", "posted_date.desc,created_at.desc");
        url.searchParams.set("limit", "250");

        if (category !== "all" && category !== "teaching") {
          url.searchParams.set("category", `eq.${category}`);
        }

        const res = await fetch(url.toString(), {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          const dbJobs = await res.json();
          if (Array.isArray(dbJobs) && dbJobs.length > 0) {
            allJobs = dbJobs.map((j: any, idx: number): Job => {
              const isGovt = j.category === "government" || j.category === "teaching";
              const detectedSector = j.sector || j.gov_sector || (isGovt ? "Central SSC & UPSC" : "Private & Corporate");
              const isTeaching = detectedSector === "Teaching & Education";

              if (isGovt || isTeaching) {
                return {
                  id: j.id || `db-job-${idx + 1}`,
                  job_hash: j.job_hash || `hash-${idx + 1}`,
                  category: isTeaching ? "teaching" : "government",
                  title: j.title || "Government Opening",
                  sector: detectedSector,
                  state: j.state || j.state_or_location || "All India",
                  state_or_location: j.state || j.state_or_location || "All India",
                  department_or_board: j.department_or_board || j.department_or_company || "Govt Board",
                  gov_sector: detectedSector,
                  qualification: j.qualification || "Graduate",
                  last_date: j.last_date || j.last_date_to_apply || "Open until filled",
                  last_date_to_apply: j.last_date_to_apply || j.last_date || "2026-09-30",
                  salary: j.salary || j.salary_range || "As per Norms",
                  salary_range: j.salary_range || j.salary || "As per Norms",
                  apply_url: j.apply_url || "https://ssc.gov.in/",
                  official_pdf: j.official_pdf || j.notification_pdf_url || j.apply_url,
                  notification_pdf_url: j.notification_pdf_url || j.official_pdf || null,
                  official_pdf_fallback: j.official_pdf_fallback || j.apply_url,
                  has_direct_pdf: Boolean(j.has_direct_pdf),
                  vacancies_count: j.vacancies_count || 0,
                  age_limit: j.age_limit || "18 - 40 Years",
                  fee_details: j.fee_details || "Gen/OBC: ₹100, SC/ST: ₹0",
                  description: j.description || "",
                  posted_date: j.posted_date || "2026-09-03",
                  is_active: j.is_active ?? true,
                };
              } else {
                return {
                  id: j.id || `db-job-${idx + 1}`,
                  job_hash: j.job_hash || `hash-${idx + 1}`,
                  category: "private",
                  title: j.title || "Private Opening",
                  sector: "Private & Corporate",
                  state: j.state || j.work_location || "All India",
                  work_location: j.work_location || j.state || "Bengaluru / Remote",
                  company_name: j.company_name || j.department_or_company || "Company",
                  company_logo_url: j.company_logo_url || fLogo(j.company_name || "Co"),
                  qualification: j.qualification || "Graduate",
                  last_date: j.last_date || "Open until filled",
                  salary: j.salary || j.salary_range || "Competitive",
                  salary_range: j.salary_range || j.salary || "Competitive",
                  apply_url: j.apply_url || "https://careers.google.com/",
                  description: j.description || "",
                  posted_date: j.posted_date || "2026-09-03",
                  is_active: j.is_active ?? true,
                  skills_tags: j.skills_tags || ["Tech", "Engineering"],
                  experience_level: j.experience_level || "Fresher / 1-3 Years",
                  employment_type: j.employment_type || "Full-time",
                  source_portal: j.source_portal || "Direct ATS",
                };
              }
            });
          }
        }
      } catch (err) {
        console.warn("Supabase fetch fallback to bundled seed data:", err);
      }
    }

    // 2. Multi-Parameter Filtering
    let filtered = allJobs;

    // Filter by Category
    if (category !== "all") {
      filtered = filtered.filter((j) => j.category === category);
    }

    // Filter by Authoritative Sector
    if (sector !== "All Sectors") {
      filtered = filtered.filter((j) => (j.sector || "").toLowerCase() === sector.toLowerCase());
    }

    // Filter by State
    if (state !== "All India") {
      filtered = filtered.filter((j) => {
        const jobState = (j.state || (j as any).state_or_location || (j as any).work_location || "").toLowerCase();
        return jobState.includes(state.toLowerCase()) || jobState === "all india";
      });
    }

    // Filter by Board
    if (board !== "All Boards") {
      const key = board.toLowerCase().split("/")[0].trim();
      filtered = filtered.filter((j) =>
        ((j as any).department_or_board || "").toLowerCase().includes(key)
      );
    }

    // Filter by Qualification
    if (qualification !== "All Qualifications") {
      const qKey = qualification.toLowerCase().split(" ")[0].replace(/[^a-z0-9]/g, "");
      filtered = filtered.filter((j) =>
        ((j as any).qualification || "").toLowerCase().includes(qKey)
      );
    }

    // Search query match
    if (query) {
      filtered = filtered.filter((j) => {
        const titleMatch = (j.title || "").toLowerCase().includes(query);
        const descMatch = (j.description || "").toLowerCase().includes(query);
        const deptMatch = ((j as any).department_or_board || (j as any).company_name || "").toLowerCase().includes(query);
        const stateMatch = ((j as any).state || (j as any).state_or_location || (j as any).work_location || "").toLowerCase().includes(query);
        const qualMatch = ((j as any).qualification || "").toLowerCase().includes(query);
        const secMatch = ((j as any).sector || "").toLowerCase().includes(query);

        return titleMatch || descMatch || deptMatch || stateMatch || qualMatch || secMatch;
      });
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      category,
      sector,
      jobs: filtered,
    });
  } catch (error) {
    console.error("API /api/jobs error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

function fLogo(name: string) {
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=4F46E5&color=fff`;
}
