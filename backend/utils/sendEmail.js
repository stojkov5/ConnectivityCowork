// backend/utils/sendEmail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.SENDGRID_API_KEY;
const fromEmail = process.env.SENDGRID_FROM_EMAIL;

if (!apiKey) {
  console.error("❌ SENDGRID_API_KEY is missing in .env");
}
if (!fromEmail) {
  console.error("❌ SENDGRID_FROM_EMAIL is missing in .env");
}

if (apiKey) {
  sgMail.setApiKey(apiKey);
}

export async function sendVerificationEmail(toEmail, token) {
  if (!apiKey || !fromEmail) {
    console.error("SendGrid not configured. Skipping email send.");
    return;
  }

  // For now just hit the backend verify route directly
  const backendBase =
    process.env.API_BASE_URL || "https://connectivity-backend-pi66.onrender.com";

  const verifyUrl = `${backendBase}/api/auth/verify/${token}`;

  const msg = {
    to: toEmail,
    from: fromEmail,
    subject: "Verify your Connectivity Cowork account",
    text: `Click this link to verify your account: ${verifyUrl}`,
    html: `
      <p>Hi,</p>
      <p>Thanks for registering at <strong>Connectivity Cowork</strong>.</p>
      <p>Please verify your email by clicking the link below:</p>
      <p><a href="${verifyUrl}" target="_blank">${verifyUrl}</a></p>
    `,
  };

  console.log("📧 Sending verification mail to:", toEmail);
  console.log("🔗 Verification URL:", verifyUrl);

  try {
    await sgMail.send(msg);
    console.log("✅ Verification email sent");
  } catch (err) {
    console.error("❌ SENDGRID ERROR:", err.response?.body || err);
    throw err;
  }
}
