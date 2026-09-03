import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// Owner recipient address is kept strictly server-side (never exposed to frontend)
const ADMIN_NOTIFICATION_EMAIL = process.env.TAKEDOWN_ADMIN_EMAIL || "bijoylohar457@gmail.com";

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

    const timestamp = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

    // 1. Store Request in Supabase Database (if configured)
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

    // 2. Dispatch Email Notification to Admin (bijoylohar457@gmail.com)
    const smtpUser = process.env.SMTP_USER || process.env.GMAIL_USER || ADMIN_NOTIFICATION_EMAIL;
    const smtpPass = process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD;

    if (smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: smtpUser,
            pass: smtpPass,
          },
        });

        const mailOptions = {
          from: `"BharatKits Hub Compliance" <${smtpUser}>`,
          to: ADMIN_NOTIFICATION_EMAIL,
          subject: `🚨 [Compliance Alert] Takedown Request Submitted by ${full_name}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
              <div style="border-bottom: 2px solid #f59e0b; padding-bottom: 12px; margin-bottom: 20px;">
                <h2 style="color: #1e293b; margin: 0;">🛡️ BharatKits Hub - Takedown Request</h2>
                <p style="color: #64748b; font-size: 12px; margin: 4px 0 0 0;">Received on: ${timestamp} IST</p>
              </div>

              <div style="margin-bottom: 16px;">
                <strong style="color: #334155; font-size: 13px; text-transform: uppercase;">Requester Identity:</strong>
                <p style="margin: 4px 0; font-size: 15px; color: #0f172a; font-weight: bold;">${full_name}</p>
              </div>

              <div style="margin-bottom: 16px;">
                <strong style="color: #334155; font-size: 13px; text-transform: uppercase;">Target Job Listing / URL:</strong>
                <p style="margin: 4px 0; font-size: 14px; word-break: break-all; color: #2563eb;">
                  <a href="${listing_url}" target="_blank" style="color: #2563eb;">${listing_url}</a>
                </p>
              </div>

              <div style="margin-bottom: 20px;">
                <strong style="color: #334155; font-size: 13px; text-transform: uppercase;">Reason for Takedown / Correction:</strong>
                <div style="margin-top: 6px; padding: 12px; background-color: #f8fafc; border-left: 4px solid #f59e0b; border-radius: 6px; font-size: 14px; color: #334155; line-height: 1.5; white-space: pre-wrap;">${reason}</div>
              </div>

              <div style="border-top: 1px solid #e2e8f0; padding-top: 12px; font-size: 11px; color: #94a3b8; text-align: center;">
                BharatKits Hub • Automated Compliance Alert System • Confidential
              </div>
            </div>
          `,
        };

        await transporter.sendMail(mailOptions);
        console.log(`[Takedown] Notification email sent successfully to ${ADMIN_NOTIFICATION_EMAIL}`);
      } catch (mailError) {
        console.error("[Takedown] Failed to send email via SMTP:", mailError);
      }
    } else {
      console.log(`[Takedown] No SMTP_PASS found in env. Request recorded to DB for: ${full_name} (${listing_url})`);
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
