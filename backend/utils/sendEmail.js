// backend/utils/sendEmail.js
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

dotenv.config();

const { SENDGRID_API_KEY, SENDGRID_FROM_EMAIL, FRONTEND_URL } = process.env;

let sendGridReady = false;

if (!SENDGRID_API_KEY || !SENDGRID_FROM_EMAIL || !FRONTEND_URL) {
  console.log(
    "[sendEmail] Missing SENDGRID_API_KEY, SENDGRID_FROM_EMAIL or FRONTEND_URL in env"
  );
} else {
  if (!SENDGRID_API_KEY.startsWith("SG.")) {
    console.log(
      '[sendEmail] Warning: SENDGRID_API_KEY does not start with "SG." – double-check it.'
    );
  }
  sgMail.setApiKey(SENDGRID_API_KEY);
  sendGridReady = true;
}

const frontBase = FRONTEND_URL.replace(/\/$/, "");

// ========== USER EMAIL VERIFICATION ==========
export const sendVerificationEmail = async (toEmail, token) => {
  if (!sendGridReady) {
    console.log("[sendVerificationEmail] Missing configuration, skipping.");
    return;
  }

  const verifyUrl = `${frontBase}/verify/${token}`;

  const msg = {
    to: toEmail,
    from: SENDGRID_FROM_EMAIL,
    subject: "Verify your Connectivity account",
    text: `Click the link to verify your account: ${verifyUrl}`,
    html: `
      <p>Hi,</p>
      <p>Thanks for registering at Connectivity Cowork.</p>
      <p>Please confirm your email by clicking the button below:</p>
      <p>
        <a href="${verifyUrl}" style="display:inline-block;padding:10px 18px;background:#ff8c00;color:#ffffff;text-decoration:none;border-radius:4px;">
          Verify Email
        </a>
      </p>
      <p>Or open this link in your browser:</p>
      <p><a href="${verifyUrl}">${verifyUrl}</a></p>
      <p>This link is valid for 24 hours.</p>
    `,
  };

  await sgMail.send(msg);
};

// ========== RESERVATION CONFIRMATION EMAIL (TO USER) ==========
export const sendReservationConfirmationEmail = async (toEmail, token, details) => {
  if (!sendGridReady) {
    console.log(
      "[sendReservationConfirmationEmail] Missing configuration, skipping."
    );
    return;
  }

  const confirmUrl = `${frontBase}/confirm-reservation/${token}`;

  const {
    location,
    officeName,
    plan,
    startDate,
    endDate,
    resources, // array of { id, name }
    companyName,
  } = details;

  const resourceList =
    Array.isArray(resources) && resources.length
      ? resources.map((r) => `- ${r.name || r.id}`).join("<br/>")
      : "- (none)";

  const prettyLocation = location === "kiselavoda" ? "Kisela Voda" : "Centar";

  const msg = {
    to: toEmail,
    from: SENDGRID_FROM_EMAIL,
    subject: "Confirm your cowork reservation",
    text: `You requested a reservation at ${prettyLocation} (${officeName}) from ${startDate} to ${endDate} (${plan}). Confirm here: ${confirmUrl}`,
    html: `
      <p>Hi,</p>
      <p>You requested a reservation at <strong>${prettyLocation}</strong>.</p>
      <p>
        <strong>Office:</strong> ${officeName}<br/>
        <strong>Plan:</strong> ${plan}<br/>
        <strong>Dates:</strong> ${startDate} – ${endDate}<br/>
        <strong>Company:</strong> ${companyName || "-"}
      </p>
      <p><strong>Resources:</strong><br/>${resourceList}</p>
      <p>Please confirm your reservation by clicking the button below:</p>
      <p>
        <a href="${confirmUrl}" style="display:inline-block;padding:10px 18px;background:#ff8c00;color:#ffffff;text-decoration:none;border-radius:4px;">
          Confirm Reservation
        </a>
      </p>
      <p>Or open this link in your browser:</p>
      <p><a href="${confirmUrl}">${confirmUrl}</a></p>
      <p>This link is valid for 24 hours. If you do nothing, the reservation will not be created.</p>
    `,
  };

  await sgMail.send(msg);
};

// ========== OWNER NOTIFICATION (AFTER USER CONFIRMS) ==========
export const sendOwnerReservationNotificationEmail = async (ownerEmail, data) => {
  if (!sendGridReady) {
    console.log(
      "[sendOwnerReservationNotificationEmail] Missing configuration, skipping."
    );
    return;
  }

  const {
    reserverEmail,
    reserverUsername,
    companyName,
    location,
    officeId,
    resourceType,
    plan,
    startDate,
    endDate,
    resources, // [{ id, name }]
    createdAt,
  } = data;

  const prettyLocation = location === "kiselavoda" ? "Kisela Voda" : "Centar";

  const resourceListText =
    Array.isArray(resources) && resources.length
      ? resources.map((r) => `- ${r.name || r.id}`).join("\n")
      : "- (none)";

  const resourceListHtml =
    Array.isArray(resources) && resources.length
      ? resources.map((r) => `<li>${r.name || r.id}</li>`).join("")
      : "<li>(none)</li>";

  const subject = `Notification: Reservation made ✅ (${prettyLocation} • ${officeId})`;

  const text = [
    "Notification: Reservation made",
    "--------------------------------",
    `Location: ${prettyLocation}`,
    `OfficeId: ${officeId || "-"}`,
    `Resource type: ${resourceType || "-"}`,
    `Plan: ${plan || "-"}`,
    `Dates: ${startDate} -> ${endDate}`,
    "",
    `User: ${reserverUsername || "-"}`,
    `User email: ${reserverEmail || "-"}`,
    `Company: ${companyName || "-"}`,
    "",
    "Resources:",
    resourceListText,
    "",
    `Created at: ${createdAt || "-"}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 10px;">Notification: Reservation made ✅</h2>

      <p style="margin: 0 0 10px;">
        <strong>Location:</strong> ${prettyLocation}<br/>
        <strong>OfficeId:</strong> ${officeId || "-"}<br/>
        <strong>Resource type:</strong> ${resourceType || "-"}<br/>
        <strong>Plan:</strong> ${plan || "-"}<br/>
        <strong>Dates:</strong> ${startDate} → ${endDate}
      </p>

      <p style="margin: 0 0 10px;">
        <strong>User:</strong> ${reserverUsername || "-"}<br/>
        <strong>User email:</strong> ${reserverEmail || "-"}<br/>
        <strong>Company:</strong> ${companyName || "-"}
      </p>

      <p style="margin: 0 0 6px;"><strong>Resources:</strong></p>
      <ul style="margin-top: 0;">
        ${resourceListHtml}
      </ul>

      <p style="margin: 10px 0 0; color:#666; font-size: 12px;">
        Created at: ${createdAt || "-"}
      </p>
    </div>
  `;

  await sgMail.send({
    to: ownerEmail,
    from: SENDGRID_FROM_EMAIL, // MUST be verified in SendGrid
    subject,
    text,
    html,
  });
};
