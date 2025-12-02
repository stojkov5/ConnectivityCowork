// backend/utils/sendEmail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, FRONTEND_URL } = process.env;

if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !FRONTEND_URL) {
  console.log(
    "[sendEmail] Missing SENDGRID_API_KEY, SENDGRID_FROM_EMAIL or FRONTEND_URL in .env"
  );
} else {
  sgMail.setApiKey(SENDGRID_API_KEY);
}

/**
 * Send verification email with a link like:
 *   {FRONTEND_URL}/verify/:token
 */
export async function sendVerificationEmail(to, token) {
  if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !FRONTEND_URL) {
    console.log("[sendVerificationEmail] Missing configuration");
    return;
  }

  // Make sure we don't end with double slashes
  const base = FRONTEND_URL.replace(/\/$/, "");
  const verifyUrl = `${base}/verify/${token}`;

  const msg = {
    to,
    from: SENDGRID_FROM_EMAIL,
    subject: "Verify your email - Connectivity Cowork",
    text: `Hi, please verify your email by opening this link: ${verifyUrl}`,
    html: `
      <p>Hi,</p>
      <p>Thank you for registering at <strong>Connectivity Cowork</strong>.</p>
      <p>Please confirm your email by clicking the button below:</p>
      <p>
        <a href="${verifyUrl}" 
           style="display:inline-block;padding:10px 16px;background:#ff8c00;color:#fff;text-decoration:none;border-radius:4px;">
          Verify Email
        </a>
      </p>
      <p>Or open this link directly:<br/>
        <a href="${verifyUrl}">${verifyUrl}</a>
      </p>
      <p>If you did not create an account, you can ignore this message.</p>
    `,
  };

  try {
    await sgMail.send(msg);
    console.log(`[sendVerificationEmail] Sent to ${to}`);
  } catch (err) {
    console.error("[sendVerificationEmail] Error sending email:", err);
  }
}
