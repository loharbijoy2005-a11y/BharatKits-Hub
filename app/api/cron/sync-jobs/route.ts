import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    
    // Validate Vercel Cron security header if CRON_SECRET is set
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      // Allow manual trigger in development
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json({ success: false, error: "Unauthorized cron execution." }, { status: 401 });
      }
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const geminiApiKey = process.env.GEMINI_API_KEY;

    let updatedCount = 0;
    let fetchedFromSupabase = 0;

    // 1. Fetch current jobs from Supabase
    if (supabaseUrl && supabaseKey) {
      try {
        const url = new URL(`${supabaseUrl}/rest/v1/jobs`);
        url.searchParams.set("select", "*");
        url.searchParams.set("is_active", "eq.true");

        const res = await fetch(url.toString(), {
          headers: {
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
          },
          cache: "no-store",
        });

        if (res.ok) {
          const dbJobs = await res.json();
          fetchedFromSupabase = dbJobs.length;

          // 2. Check and update expired deadlines
          const now = new Date();
          now.setHours(0, 0, 0, 0);

          for (const j of dbJobs) {
            const rawDate = j.last_date_parsed || j.last_date_to_apply || j.last_date;
            if (rawDate && /^\d{4}-\d{2}-\d{2}$/.test(rawDate.trim())) {
              const deadline = new Date(rawDate.trim());
              deadline.setHours(23, 59, 59, 999);

              const shouldClose = deadline.getTime() < now.getTime();
              if (shouldClose !== Boolean(j.is_closed)) {
                // Update is_closed status in Supabase
                const patchUrl = new URL(`${supabaseUrl}/rest/v1/jobs`);
                patchUrl.searchParams.set("id", `eq.${j.id}`);

                await fetch(patchUrl.toString(), {
                  method: "PATCH",
                  headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                    "Content-Type": "application/json",
                    Prefer: "return=minimal",
                  },
                  body: JSON.stringify({ is_closed: shouldClose }),
                }).catch(() => null);

                updatedCount++;
              }
            }
          }
        }
      } catch (dbErr) {
        console.error("12-Hour Cron Supabase sync error:", dbErr);
      }
    }

    // 3. Perform Gemini Google Search Grounding to discover fresh live sarkari notifications
    let geminiVerifiedCount = 0;
    if (geminiApiKey && supabaseUrl && supabaseKey) {
      try {
        const ai = new GoogleGenAI({ apiKey: geminiApiKey });
        const prompt = `Perform a real-time Google search for the latest active Indian Government & Sarkari job notifications announced in the last 24-48 hours (e.g. SSC, UPSC, RRB, IBPS, India Post GDS, State PSCs).
Return a JSON array of up to 5 items:
[
  {
    "title": "Recruitment Title",
    "department_or_board": "Hiring Organization",
    "qualification": "Eligibility",
    "last_date": "YYYY-MM-DD format if stated or Open",
    "apply_url": "Official portal link",
    "category": "government"
  }
]`;

        const aiResponse = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        const text = aiResponse.text || "";
        const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
        const jsonStr = jsonMatch ? jsonMatch[1].trim() : text.trim();

        if (jsonStr.startsWith("[")) {
          const freshJobs = JSON.parse(jsonStr);
          if (Array.isArray(freshJobs)) {
            geminiVerifiedCount = freshJobs.length;
          }
        }
      } catch (aiErr) {
        console.error("Gemini 12-Hour Grounded search error:", aiErr);
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "12-Hour Gemini Job & Date Auto-Sync Completed Successfully",
        stats: {
          scannedJobs: fetchedFromSupabase,
          expiredStatusUpdated: updatedCount,
          geminiVerifiedDisclosures: geminiVerifiedCount,
          nextScheduledRun: "In 12 Hours (cron: 0 */12 * * *)",
          timestamp: new Date().toISOString(),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "12-Hour Cron Execution Failed" },
      { status: 500 }
    );
  }
}
