import { NextRequest, NextResponse } from "next/server";
import { INITIAL_JOBS_DATA, Job } from "@/lib/jobs-data";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || "all";
    const query = (searchParams.get("search") || "").toLowerCase().trim();
    const board = searchParams.get("board") || "All Boards";
    const state = searchParams.get("state") || "All India";
    const experience = searchParams.get("experience") || "All Experience Levels";
    const qualification = searchParams.get("qualification") || "All Qualifications";

    // 1. Try fetching from Supabase if configured in environment
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    let allJobs: Job[] = INITIAL_JOBS_DATA;

    if (supabaseUrl && supabaseKey) {
      try {
        const url = new URL(`${supabaseUrl}/rest/v1/jobs`);
        url.searchParams.set("select", "*");
        url.searchParams.set("is_active", "eq.true");
        url.searchParams.set("order", "posted_date.desc");
        if (category !== "all") {
          url.searchParams.set("category", `eq.${category}`);
        }

        const res = await fetch(url.toString(), {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          next: { revalidate: 3600 }, // ISR Cache for 1 hour
        });

        if (res.ok) {
          const dbJobs = await res.json();
          if (Array.isArray(dbJobs) && dbJobs.length > 0) {
            allJobs = dbJobs;
          }
        }
      } catch (err) {
        console.warn("Supabase fetch fallback to local seed data:", err);
      }
    }

    // 2. Perform in-memory filtering & full-text match
    let filtered = allJobs;

    // Filter by Category
    if (category !== "all") {
      filtered = filtered.filter((j) => j.category === category);
    }

    // Search query
    if (query) {
      filtered = filtered.filter((j) => {
        const titleMatch = j.title.toLowerCase().includes(query);
        const descMatch = (j.description || "").toLowerCase().includes(query);
        
        if (j.category === "government") {
          const boardMatch = (j.department_or_board || "").toLowerCase().includes(query);
          const qualMatch = (j.qualification || "").toLowerCase().includes(query);
          const locMatch = (j.state_or_location || "").toLowerCase().includes(query);
          return titleMatch || descMatch || boardMatch || qualMatch || locMatch;
        } else {
          const compMatch = (j.company_name || "").toLowerCase().includes(query);
          const locMatch = (j.work_location || "").toLowerCase().includes(query);
          const skillsMatch = (j.skills_tags || []).some((s) => s.toLowerCase().includes(query));
          return titleMatch || descMatch || compMatch || locMatch || skillsMatch;
        }
      });
    }

    // Board filter (Govt)
    if (board !== "All Boards") {
      filtered = filtered.filter(
        (j) => j.category === "government" && j.department_or_board.toLowerCase().includes(board.toLowerCase().split("/")[0].trim())
      );
    }

    // State filter
    if (state !== "All India") {
      filtered = filtered.filter((j) => {
        if (j.category === "government") {
          return (
            j.state_or_location.toLowerCase().includes(state.toLowerCase()) ||
            j.state_or_location.toLowerCase() === "all india"
          );
        } else {
          return j.work_location.toLowerCase().includes(state.toLowerCase());
        }
      });
    }

    // Experience filter (Private)
    if (experience !== "All Experience Levels") {
      const expKey = experience.toLowerCase().split(" ")[0]; // "fresher", "mid-level", etc.
      filtered = filtered.filter(
        (j) => j.category === "private" && j.experience_level.toLowerCase().includes(expKey)
      );
    }

    // Qualification filter (Govt)
    if (qualification !== "All Qualifications") {
      const qualKey = qualification.toLowerCase().split(" ")[0];
      filtered = filtered.filter(
        (j) => j.category === "government" && j.qualification.toLowerCase().includes(qualKey)
      );
    }

    return NextResponse.json({
      success: true,
      total: filtered.length,
      category,
      jobs: filtered,
    });
  } catch (error) {
    console.error("API /api/jobs error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error", error: String(error) },
      { status: 500 }
    );
  }
}
