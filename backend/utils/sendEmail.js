// backend/utils/sendEmail.js
import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

const { RESEND_API_KEY, FROM_EMAIL, FRONTEND_URL } = process.env;

let resend = null;
let emailReady = false;

if (!RESEND_API_KEY || !FROM_EMAIL || !FRONTEND_URL) {
  console.log(
    "[sendEmail] Missing RESEND_API_KEY, FROM_EMAIL or FRONTEND_URL in env"
  );
} else {
  if (!RESEND_API_KEY.startsWith("re_")) {
    console.log(
      '[sendEmail] Warning: RESEND_API_KEY does not start with "re_" – double-check it.'
    );
  }
  resend = new Resend(RESEND_API_KEY);
  emailReady = true;
}

const frontBase = (FRONTEND_URL || "").replace(/\/$/, "");

// Internal notification recipients (your admin inbox + the business inbox).
// Comma-separated in OWNER_EMAILS; falls back to the original business address.
const OWNER_EMAILS = (process.env.OWNER_EMAILS || "coworkkonnectivityskopje@gmail.com")
  .split(",")
  .map((e) => e.trim())
  .filter(Boolean);

// Resend returns { data, error } instead of throwing. This helper restores
// throw-on-failure so the existing try/catch blocks in the routes keep working.
const deliver = async ({ to, subject, text, html }) => {
  const { data, error } = await resend.emails.send({
    from: FROM_EMAIL,
    to,
    subject,
    text,
    html,
  });

  if (error) {
    throw new Error(
      `[Resend] Failed to send "${subject}": ${
        error.message || JSON.stringify(error)
      }`
    );
  }

  return data;
};

// ========== USER EMAIL VERIFICATION ==========
export const sendVerificationEmail = async (toEmail, token) => {
  if (!emailReady) {
    console.log("[sendVerificationEmail] Missing configuration, skipping.");
    return;
  }

  const verifyUrl = `${frontBase}/verify/${token}`;

  await deliver({
    to: toEmail,
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
  });
};

// ========== RESERVATION CONFIRMATION EMAIL (TO USER) ==========
export const sendReservationConfirmationEmail = async (toEmail, token, details) => {
  if (!emailReady) {
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

  await deliver({
    to: toEmail,
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
  });
};

// ========== OWNER NOTIFICATION (AFTER USER CONFIRMS) ==========
export const sendOwnerReservationNotificationEmail = async (data) => {
  if (!emailReady) {
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

  await deliver({ to: OWNER_EMAILS, subject, text, html });
};

// ========== ADMIN: NEW USER REGISTERED ==========
export const sendNewUserNotificationEmail = async (user) => {
  if (!emailReady) {
    console.log("[sendNewUserNotificationEmail] Missing configuration, skipping.");
    return;
  }

  const { username, email } = user || {};

  await deliver({
    to: OWNER_EMAILS,
    subject: `New registration: ${username || email || "unknown user"}`,
    text: [
      "A new user just registered on Konnectivity Cowork.",
      "",
      `Username: ${username || "-"}`,
      `Email: ${email || "-"}`,
    ].join("\n"),
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.5;">
        <h2 style="margin: 0 0 10px;">New user registered ✅</h2>
        <p style="margin: 0;">
          <strong>Username:</strong> ${username || "-"}<br/>
          <strong>Email:</strong> ${email || "-"}
        </p>
      </div>
    `,
  });
};

// ========== ADMIN: BOOKING AWAITING APPROVAL (USER JUST CONFIRMED) ==========
export const sendBookingAwaitingApprovalEmail = async (data) => {
  if (!emailReady) {
    console.log(
      "[sendBookingAwaitingApprovalEmail] Missing configuration, skipping."
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
    resources,
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

  const subject = `Action needed: booking awaiting approval (${prettyLocation} • ${officeId})`;

  const text = [
    "A booking was confirmed by the user and is awaiting your approval.",
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
    `Confirmed at: ${createdAt || "-"}`,
  ].join("\n");

  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2 style="margin: 0 0 10px;">Booking awaiting your approval ⏳</h2>

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
        Confirmed at: ${createdAt || "-"} — approve it from your admin dashboard.
      </p>
    </div>
  `;

  await deliver({ to: OWNER_EMAILS, subject, text, html });
};
