import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.query || typeof body.query !== "string" || !body.query.trim()) {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'query' parameter in request body." },
        { status: 400 }
      );
    }

    const queryStr = body.query.trim();
    const category = body.category || "government";

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY environment variable is not configured. Please add your Gemini API Key in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Perform a real-time Google search to find authentic, up-to-date official recruitment details for the Indian job or exam query: "${queryStr}".

Search official portals (e.g. ssc.gov.in, upsc.gov.in, rrbapply.gov.in, ibps.in, ncs.gov.in, or official company career portals).

Return a strictly valid JSON object (wrapped in \`\`\`json ... \`\`\` or raw JSON) containing:
{
  "jobTitle": "Exact recruitment title or examination name",
  "organization": "Official hiring board, ministry, department or company",
  "totalVacancies": "Total vacancies/posts count or description",
  "lastDate": "Official last date to apply strictly formatted as YYYY-MM-DD (e.g. 2026-10-15). If unstated/rolling, return ''",
  "eligibility": "Brief qualification / age limit summary",
  "applyUrl": "Official direct application or portal URL"
}`;

    let responseText = "";
    let groundingChunks: any[] = [];
    let lastError: any = null;
    let rateLimited = false;

    // Try primary model and fallbacks
    for (const modelName of FALLBACK_MODELS) {
      try {
        const aiResponse = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            tools: [{ googleSearch: {} }],
          },
        });

        responseText = aiResponse.text || "";
        const candidate = aiResponse.candidates?.[0];
        if (candidate?.groundingMetadata?.groundingChunks) {
          groundingChunks = candidate.groundingMetadata.groundingChunks;
        }

        if (responseText) {
          lastError = null;
          break; // Success!
        }
      } catch (aiErr: any) {
        lastError = aiErr;
        const errStr = String(aiErr?.message || aiErr);
        if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota")) {
          rateLimited = true;
        }
      }
    }

    if (lastError && !responseText) {
      if (rateLimited) {
        return NextResponse.json(
          {
            success: false,
            error: "Gemini API Free Quota Limit Reached (15 requests/min). Please wait 30 seconds and try again, or check your API Key at Google AI Studio (aistudio.google.com).",
          },
          { status: 429 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          error: `Gemini API call failed: ${lastError?.message || "All fallback models busy"}`,
        },
        { status: 500 }
      );
    }

    if (!responseText) {
      return NextResponse.json(
        { success: false, error: "Gemini API returned an empty response." },
        { status: 500 }
      );
    }

    // Sanitize JSON block from text response
    let jsonStr = responseText.trim();
    const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (jsonMatch) {
      jsonStr = jsonMatch[1].trim();
    }

    let parsedResult: {
      jobTitle?: string;
      organization?: string;
      totalVacancies?: string;
      lastDate?: string;
      eligibility?: string;
      applyUrl?: string;
    } = {};

    try {
      parsedResult = JSON.parse(jsonStr);
    } catch {
      return NextResponse.json(
        { success: false, error: "Could not parse JSON response from Gemini Search result." },
        { status: 500 }
      );
    }

    const { jobTitle, organization, totalVacancies, lastDate, eligibility, applyUrl } = parsedResult;

    if (!jobTitle || !organization) {
      return NextResponse.json(
        { success: false, error: `No authentic recruitment details found online for query: "${queryStr}".` },
        { status: 404 }
      );
    }

    // Dynamically calculate daysLeft
    let daysLeft: number | null = null;
    if (lastDate && /^\d{4}-\d{2}-\d{2}$/.test(lastDate.trim())) {
      const targetTime = new Date(lastDate.trim()).getTime();
      if (!isNaN(targetTime)) {
        daysLeft = Math.ceil((targetTime - Date.now()) / (1000 * 60 * 60 * 24));
      }
    }

    // Extract official search citation sources
    const sources = groundingChunks
      .map((c: any) => ({
        title: c.web?.title || "Official Source",
        url: c.web?.uri || "",
      }))
      .filter((s) => s.url);

    return NextResponse.json(
      {
        success: true,
        data: {
          jobTitle: jobTitle.trim(),
          organization: organization.trim(),
          totalVacancies: (totalVacancies || "Refer official notification").trim(),
          lastDate: (lastDate || "").trim() || null,
          daysLeft,
          eligibility: (eligibility || "Refer official notification").trim(),
          applyUrl: (applyUrl || sources[0]?.url || "https://www.ncs.gov.in/").trim(),
          category,
          sources: sources.slice(0, 4),
        },
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
