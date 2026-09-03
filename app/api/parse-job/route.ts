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
        throw new Error("Invalid protocol");
      }
    } catch {
      return NextResponse.json(
        { success: false, error: "Provided pdfUrl must be a valid HTTP/HTTPS URL." },
        { status: 400 }
      );
    }

    // 2. Access Gemini API Key strictly via process.env.GEMINI_API_KEY
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "GEMINI_API_KEY environment variable is not configured on the server." },
        { status: 500 }
      );
    }

    // 3. Download the PDF file securely using Node's native fetch
    let pdfResponse: Response;
    try {
      pdfResponse = await fetch(targetUrl.toString(), {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
          "Accept": "application/pdf,application/octet-stream,*/*",
        },
      });
      if (!pdfResponse.ok) {
        return NextResponse.json(
          { success: false, error: `Failed to download PDF from target URL (HTTP ${pdfResponse.status}).` },
          { status: 400 }
        );
      }
    } catch (fetchErr: any) {
      return NextResponse.json(
        { success: false, error: `Network error fetching PDF: ${fetchErr?.message || "Connection failed"}` },
        { status: 400 }
      );
    }

    const pdfArrayBuffer = await pdfResponse.arrayBuffer();
    const pdfBuffer = Buffer.from(pdfArrayBuffer);

    if (!pdfBuffer || pdfBuffer.length === 0) {
      return NextResponse.json(
        { success: false, error: "Downloaded PDF file content is empty (0 bytes)." },
        { status: 400 }
      );
    }

    // 4. Extract text from PDF using pdf-parse (first 3 pages / max 4,000 characters)
    let extractedText = "";
    try {
      const pdfData = await pdfParse(pdfBuffer, { max: 3 });
      extractedText = (pdfData.text || "").replace(/\s+/g, " ").trim().slice(0, 4000);
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

    // 5. Initialize Official @google/genai SDK
    const ai = new GoogleGenAI({ apiKey });

    const prompt = `Extract authentic job recruitment details from the official notification text below.
Text sample:
"""
${extractedText}
"""

Instructions:
- jobTitle: Exact job position or recruitment examination title.
- organization: Official hiring government board, ministry, department, or company name.
- totalVacancies: Number of vacancies/posts mentioned (e.g. "1,450 Posts" or "Unspecified").
- lastDate: Closing date for applications strictly formatted as YYYY-MM-DD. If missing or unstated, return "".
- eligibility: Brief summary of required qualification or age limit.`;

    let responseText = "";
    try {
      const aiResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
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
    } catch (aiErr: any) {
      return NextResponse.json(
        { success: false, error: `Gemini API extraction failed: ${aiErr?.message || "API call failed"}` },
        { status: 500 }
      );
    }

    if (!responseText) {
      return NextResponse.json(
        { success: false, error: "Gemini API returned an empty response." },
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
        { success: false, error: "Failed to parse structured JSON response from Gemini API." },
        { status: 500 }
      );
    }

    const { jobTitle, organization, totalVacancies, lastDate, eligibility } = parsedResult;

    if (!jobTitle || !organization) {
      return NextResponse.json(
        { success: false, error: "Unable to extract key recruitment details from this document." },
        { status: 400 }
      );
    }

    // 6. Dynamically calculate daysLeft
    let daysLeft: number | null = null;
    if (lastDate && /^\d{4}-\d{2}-\d{2}$/.test(lastDate.trim())) {
      const targetTime = new Date(lastDate.trim()).getTime();
      if (!isNaN(targetTime)) {
        daysLeft = Math.ceil((targetTime - Date.now()) / (1000 * 60 * 60 * 24));
      }
    }

    // 7. Return authentic extracted data (Strictly ZERO mock fallback)
    return NextResponse.json(
      {
        success: true,
        data: {
          jobTitle: jobTitle.trim(),
          organization: organization.trim(),
          totalVacancies: (totalVacancies || "Not specified").trim(),
          lastDate: (lastDate || "").trim() || null,
          daysLeft,
          eligibility: (eligibility || "Refer official notification").trim(),
          applyUrl: applyUrl || pdfUrl,
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
