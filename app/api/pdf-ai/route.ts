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
    if (!body || !body.action) {
      return NextResponse.json(
        { success: false, error: "Missing required 'action' parameter in request body." },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "your_gemini_api_key_here") {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY environment variable is not configured. Please set your key in .env.local or Vercel Environment Variables.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const { action, pdfBase64, htmlCode = "", cssCode = "", customPrompt = "", textContent = "" } = body;

    // Helper to run Gemini with fallback models
    async function generateWithFallback(prompt: string, schema: any) {
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
              responseSchema: schema,
            },
          });
          responseText = aiResponse.text || "";
          if (responseText) {
            lastError = null;
            break;
          }
        } catch (err: any) {
          lastError = err;
          const errStr = String(err?.message || err);
          if (errStr.includes("429") || errStr.includes("RESOURCE_EXHAUSTED") || errStr.includes("quota")) {
            rateLimited = true;
          }
        }
      }

      if (lastError && !responseText) {
        if (rateLimited) {
          throw new Error("Gemini API Free Quota Limit Reached (15 requests/min). Please wait 30 seconds and try again.");
        }
        throw new Error(`Gemini API Error: ${lastError?.message || "Generation failed"}`);
      }

      if (!responseText) {
        throw new Error("Gemini API returned an empty response.");
      }

      return JSON.parse(responseText);
    }

    // ACTION 1: PDF to Editable HTML & CSS
    if (action === "pdf-to-html") {
      let extractedText = textContent;

      if (pdfBase64) {
        try {
          const cleanBase64 = pdfBase64.replace(/^data:application\/pdf;base64,/, "");
          const pdfBuffer = Buffer.from(cleanBase64, "base64");
          const parsedData = await pdfParse(pdfBuffer);
          extractedText = (parsedData?.text || "").trim();
        } catch (pdfErr: any) {
          return NextResponse.json(
            { success: false, error: `Failed to parse PDF document text: ${pdfErr?.message || "Unreadable PDF"}` },
            { status: 400 }
          );
        }
      }

      if (!extractedText || extractedText.length < 15) {
        return NextResponse.json(
          { success: false, error: "Extracted PDF text is too short or empty. Ensure PDF has readable text." },
          { status: 400 }
        );
      }

      const prompt = `You are an expert document designer and HTML/CSS developer. Convert the following extracted document text into a clean, modern, professionally formatted HTML and CSS document suitable for printing as an A4 PDF.

Extracted Document Text:
"""
${extractedText.substring(0, 15000)}
"""

Instructions:
- html: Clean HTML body markup without <html> or <head> tags. Use standard elements (<h1>, <h2>, <p>, <table>, <div>, <ul>, <li>, <span>). Make text clear, well-spaced, and properly structured.
- css: Clean Vanilla CSS styling that formats the HTML beautifully (font-family, margins, tables, badges, headers).
- documentTitle: A short descriptive document title based on text (e.g. "Legal Notice", "Tax Invoice", "Application Form").`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          css: { type: Type.STRING },
          documentTitle: { type: Type.STRING },
        },
        required: ["html", "css", "documentTitle"],
      };

      const result = await generateWithFallback(prompt, schema);
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    }

    // ACTION 2: Edit Text / Rewrite / Polish / Translate / Tone Adjustment
    if (action === "edit-text") {
      const editInstruction = customPrompt || getEditInstructionText(body.subAction);

      const prompt = `You are an expert AI document editor. Modify and update the following HTML and CSS content according to the requested editing instruction.

Current HTML Code:
\`\`\`html
${htmlCode.substring(0, 15000)}
\`\`\`

Current CSS Code:
\`\`\`css
${cssCode.substring(0, 5000)}
\`\`\`

User Editing Instruction:
"${editInstruction}"

Requirements:
- html: Return updated, complete HTML body code preserving essential document structure and tags while applying requested text edits, corrections, translations, or content updates.
- css: Return updated or existing CSS styling rules.
- changeSummary: A brief 1-line summary of what changes were made (e.g., "Polished grammar and corrected 3 typos", "Translated text into Hindi").`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          css: { type: Type.STRING },
          changeSummary: { type: Type.STRING },
        },
        required: ["html", "css", "changeSummary"],
      };

      const result = await generateWithFallback(prompt, schema);
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    }

    // ACTION 3: Generate Document Template from Natural Language
    if (action === "generate-template") {
      const prompt = `You are a professional document creator for Indian Cyber Cafes, legal offices, and business centers. Generate a complete, ready-to-print HTML and CSS document template based on the following user description.

User Request:
"${customPrompt || "Official Application Letter"}"

Instructions:
- html: Clean HTML body markup with realistic placeholder details inside square brackets like [Applicant Name], [Date], [Address], tables where appropriate, signature lines, and professional layout.
- css: Vanilla CSS styling designed for A4 paper print output (colors, padding, font-family, borders).
- documentTitle: Appropriate document title.`;

      const schema = {
        type: Type.OBJECT,
        properties: {
          html: { type: Type.STRING },
          css: { type: Type.STRING },
          documentTitle: { type: Type.STRING },
        },
        required: ["html", "css", "documentTitle"],
      };

      const result = await generateWithFallback(prompt, schema);
      return NextResponse.json({ success: true, data: result }, { status: 200 });
    }

    return NextResponse.json(
      { success: false, error: `Invalid action specified: '${action}'.` },
      { status: 400 }
    );
  } catch (err: any) {
    console.error("PDF AI API error:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "An error occurred while processing AI PDF request." },
      { status: 500 }
    );
  }
}

function getEditInstructionText(subAction: string): string {
  switch (subAction) {
    case "polish":
      return "Fix all spelling mistakes, grammar errors, improve vocabulary, and format spacing neatly without altering the core document facts.";
    case "translate_hi":
      return "Translate all textual content in the document into clear, formal Hindi (Devanagari script), keeping company/technical names in English where standard.";
    case "translate_en":
      return "Translate all text in the document into clear, professional English.";
    case "formalize":
      return "Rewrite the text into a formal legal and official government/business tone, using professional phrasing suitable for official filings.";
    case "summarize":
      return "Condense the document text, highlighting key points, dates, and amounts concisely while maintaining the standard layout.";
    default:
      return "Improve and clean up the document text and layout.";
  }
}
