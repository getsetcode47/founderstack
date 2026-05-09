import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const CHATGPT_PROMO_URL =
  "https://chatgpt.com/?promo_campaign=team-1-month-free&utm_campaign=WEB-team-1-month-free&utm_internal_medium=referral&utm_internal_source=openai_team&referrer=https%3A%2F%2Fchatgpt.com%2Fbusiness%2Fbusiness-plan%3Futm_source%3Dchatgpt.com#team-pricing";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { email, name } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

    if (!RESEND_API_KEY) {
      return new Response(JSON.stringify({ error: "Email service not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const firstName = name ? name.split(" ")[0] : "there";

    const htmlBody = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Your Free ChatGPT Business Month</title>
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" style="max-width:560px;background:#111111;border:1px solid #1f1f1f;border-radius:16px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="background:linear-gradient(135deg,#064e3b,#065f46);padding:32px 40px;text-align:center;">
              <p style="margin:0 0 8px;font-size:13px;color:#6ee7b7;font-weight:600;letter-spacing:0.05em;text-transform:uppercase;">FounderStackHub Giveaway</p>
              <h1 style="margin:0;font-size:26px;font-weight:800;color:#ffffff;line-height:1.2;">Your Free Month is Ready</h1>
              <p style="margin:10px 0 0;font-size:15px;color:#a7f3d0;">ChatGPT Business &mdash; $150 value, yours free</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:36px 40px;">
              <p style="margin:0 0 20px;font-size:16px;color:#d1d5db;line-height:1.6;">
                Hey ${firstName},
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#9ca3af;line-height:1.7;">
                You've secured your spot in the FounderStackHub ChatGPT Business giveaway. Below is your direct link to activate 1 month free for <strong style="color:#ffffff;">up to 5 team members</strong> — worth <strong style="color:#34d399;">$150</strong>.
              </p>

              <!-- CTA Button -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
                <tr>
                  <td align="center">
                    <a href="${CHATGPT_PROMO_URL}" target="_blank"
                      style="display:inline-block;background:#059669;color:#ffffff;text-decoration:none;font-weight:700;font-size:16px;padding:16px 32px;border-radius:12px;">
                      Activate My Free Month &rarr;
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Steps -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;border:1px solid #1f2937;border-radius:12px;overflow:hidden;margin-bottom:28px;">
                <tr><td style="padding:20px 24px 12px;">
                  <p style="margin:0 0 16px;font-size:11px;font-weight:700;color:#6b7280;text-transform:uppercase;letter-spacing:0.08em;">Step-by-step instructions</p>
                  ${[
                    ["1", "Click the button above", "Opens the official ChatGPT Business promo page."],
                    ["2", "Sign up or log in", "Use your business email to create or sign into ChatGPT."],
                    ["3", "Select the Business plan", 'Click "Claim free offer" — your first month is $0.'],
                    ["4", "Complete checkout", "Enter team details. No charge for the first 30 days."],
                  ]
                    .map(
                      ([num, title, desc]) => `
                  <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:14px;">
                    <tr>
                      <td width="32" valign="top" style="padding-right:12px;">
                        <div style="width:28px;height:28px;background:#064e3b;border-radius:50%;text-align:center;line-height:28px;font-size:12px;font-weight:700;color:#34d399;">${num}</div>
                      </td>
                      <td valign="top">
                        <p style="margin:0 0 2px;font-size:14px;font-weight:600;color:#f3f4f6;">${title}</p>
                        <p style="margin:0;font-size:12px;color:#6b7280;">${desc}</p>
                      </td>
                    </tr>
                  </table>`
                    )
                    .join("")}
                </td></tr>
              </table>

              <p style="margin:0 0 8px;font-size:13px;color:#6b7280;line-height:1.6;">
                If the button doesn't work, copy and paste this URL into your browser:
              </p>
              <p style="margin:0 0 24px;font-size:11px;color:#4b5563;word-break:break-all;">
                ${CHATGPT_PROMO_URL}
              </p>

              <p style="margin:0;font-size:13px;color:#6b7280;">
                Questions? Just reply to this email and we'll help you out.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 40px;border-top:1px solid #1f2937;text-align:center;">
              <p style="margin:0;font-size:11px;color:#374151;">
                &copy; 2026 FounderStackHub. This giveaway is not affiliated with OpenAI.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "FounderStackHub <giveaway@founderstackhub.com>",
        to: [email],
        subject: "Your free ChatGPT Business month is ready — activate now",
        html: htmlBody,
      }),
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Resend error:", errBody);
      return new Response(JSON.stringify({ error: "Failed to send email" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
