import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

// Polyfill global DOMMatrix for pdf-parse compatibility in Node.js serverless environments
if (typeof globalThis.DOMMatrix === "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (globalThis as any).DOMMatrix = class DOMMatrix {
    constructor() {}
  };
}

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pdfParse = require("pdf-parse");

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const FALLBACK_MODELS = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.pdfUrl || typeof body.pdfUrl !== "string") {
      return NextResponse.json(
        { success: false, error: "Missing or invalid 'pdfUrl' parameter in request body." },
        { status: 400 }
      );
    }

    const { pdfUrl, applyUrl, category = "government" } = body;

    // 1. Validate PDF URL format
    let targetUrl: URL;
    try {
      targetUrl = new URL(pdfUrl.trim());
      if (!["http:", "https:"].includes(targetUrl.protocol)) {
        return NextResponse.json(
          { success: false, error: "Invalid URL protocol. Only HTTP and HTTPS PDF links are supported." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid PDF URL format provided." },
        { status: 400 }
      );
    }

    // 2. Access Gemini API Key
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY environment variable is not configured. Please add your key in Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    // 3. Download PDF File
    let pdfBuffer: Buffer;
    try {
      const pdfResp = await fetch(targetUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        },
      });

      if (!pdfResp.ok) {
        return NextResponse.json(
          { success: false, error: `Failed to download PDF notification file (HTTP Status ${pdfResp.status}).` },
          { status: 400 }
        );
      }

      const arrayBuf = await pdfResp.arrayBuffer();
      pdfBuffer = Buffer.from(arrayBuf);
    } catch (downloadErr: any) {
      return NextResponse.json(
        { success: false, error: `Failed to download PDF file: ${downloadErr?.message || "Network error"}` },
        { status: 400 }
      );
    }

    // 4. Extract Text from PDF using pdf-parse
    let extractedText = "";
    try {
      const parsedData = await pdfParse(pdfBuffer);
      extractedText = (parsedData?.text || "").trim();
    } catch (parseErr: any) {
      return NextResponse.json(
        { success: false, error: `Failed to parse PDF document text: ${parseErr?.message || "Corrupt or unreadable PDF"}` },
        { status: 400 }
      );
    }

    if (!extractedText || extractedText.length < 20) {
      return NextResponse.json(
        { success: false, error: "Extracted PDF text is too short or unreadable (scanned/image-only PDF)." },
        { status: 400 }
      );
    }

    // 5. Initialize Official @google/genai SDK with model fallbacks
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Extract authentic job recruitment details from the official notification text below.
Text sample:
"""
${extractedText.substring(0, 15000)}
"""

Instructions:
- jobTitle: Exact job position or recruitment examination title.
- organization: Official hiring government board, ministry, department, or company name.
- totalVacancies: Number of vacancies/posts mentioned (e.g. "1,450 Posts" or "Unspecified").
- lastDate: Closing date for applications strictly formatted as YYYY-MM-DD. If missing or unstated, return "".
- eligibility: Brief summary of required qualification or age limit.`;

    let responseText = "";
    let lastError: any = null;
    let rateLimited = false;

    for (const modelName of FALLBACK_MODELS) {
      try {
        const aiResponse = await ai.models.generateContent({
          model: modelName,
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                jobTitle: { type: Type.STRING },
                organization: { type: Type.STRING },
                totalVacancies: { type: Type.STRING },
                lastDate: { type: Type.STRING, description: "Strictly YYYY-MM-DD format" },
                eligibility: { type: Type.STRING },
              },
              required: ["jobTitle", "organization", "totalVacancies", "lastDate", "eligibility"],
            },
          },
        });
        responseText = aiResponse.text || "";
        if (responseText) {
          lastError = null;
          break;
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
        { success: false, error: `Gemini API extraction failed: ${lastError?.message || "API error"}` },
        { status: 500 }
      );
    }

    if (!responseText) {
      return NextResponse.json(
        { success: false, error: "Gemini API returned empty response." },
        { status: 500 }
      );
    }

    let parsedResult: {
      jobTitle?: string;
      organization?: string;
      totalVacancies?: string;
      lastDate?: string;
      eligibility?: string;
    } = {};

    try {
      parsedResult = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { success: false, error: "Could not parse JSON output from Gemini response." },
        { status: 500 }
      );
    }

    const { jobTitle, organization, totalVacancies, lastDate, eligibility } = parsedResult;

    if (!jobTitle || !organization) {
      return NextResponse.json(
        { success: false, error: "Gemini could not locate authentic job title or organization in PDF text." },
        { status: 400 }
      );
    }

    let daysLeft: number | null = null;
    if (lastDate && /^\d{4}-\d{2}-\d{2}$/.test(lastDate.trim())) {
      const targetTime = new Date(lastDate.trim()).getTime();
      if (!isNaN(targetTime)) {
        daysLeft = Math.ceil((targetTime - Date.now()) / (1000 * 60 * 60 * 24));
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          jobTitle: jobTitle.trim(),
          organization: organization.trim(),
          totalVacancies: (totalVacancies || "Unspecified").trim(),
          lastDate: (lastDate || "").trim() || null,
          daysLeft,
          eligibility: (eligibility || "Refer official PDF").trim(),
          pdfUrl: targetUrl.toString(),
          applyUrl: applyUrl || targetUrl.toString(),
          category,
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
