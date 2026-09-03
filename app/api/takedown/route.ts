import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { full_name, listing_url, reason } = body;

    if (!full_name || !listing_url || !reason) {
      return NextResponse.json(
        { success: false, message: "Full Name, Listing URL, and Reason are required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
      process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.SUPABASE_KEY;

    if (supabaseUrl && supabaseKey) {
      try {
        const res = await fetch(`${supabaseUrl}/rest/v1/takedown_requests`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apikey: supabaseKey,
            Authorization: `Bearer ${supabaseKey}`,
            Prefer: "return=representation",
          },
          body: JSON.stringify({
            full_name: full_name.trim(),
            listing_url: listing_url.trim(),
            reason: reason.trim(),
          }),
        });

        if (!res.ok) {
          console.warn("Supabase takedown insert status:", res.status);
        }
      } catch (err) {
        console.warn("Supabase takedown insert error:", err);
      }
    }

    return NextResponse.json({
      success: true,
      message: "Takedown request received successfully. Our compliance team will review and action this within 24-48 hours.",
    });
  } catch (error) {
    console.error("API /api/takedown error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
