import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;
const FRONTEND_URL = process.env.FRONTEND_URL;

if (!SENDGRID_API_KEY || !FROM_EMAIL || !FRONTEND_URL) {
  console.warn(
    "[sendEmail] Missing SENDGRID_API_KEY, SENDGRID_FROM_EMAIL or FRONTEND_URL in .env"
  );
}

sgMail.setApiKey(SENDGRID_API_KEY);

export async function sendVerificationEmail(toEmail, token) {
  if (!SENDGRID_API_KEY || !FROM_EMAIL || !FRONTEND_URL) {
    console.error("[sendVerificationEmail] Missing configuration");
    return;
  }

  const verifyUrl = `${FRONTEND_URL}/verify/${token}`;

  const msg = {
    to: toEmail,
    from: FROM_EMAIL,
    subject: "Verify your email - Connectivity Cowork",
    text: `Please verify your email by clicking this link: ${verifyUrl}`,
    html: `
      <p>Hi,</p>
      <p>Please verify your email for <strong>Connectivity Cowork</strong> by clicking the button below:</p>
      <p>
        <a href="${verifyUrl}" 
           style="display:inline-block;padding:10px 16px;background:#ff8c00;color:#fff;text-decoration:none;border-radius:4px;">
          Verify Email
        </a>
      </p>
      <p>Or copy and paste this link in your browser:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
    `,
  };

  await sgMail.send(msg);
}
