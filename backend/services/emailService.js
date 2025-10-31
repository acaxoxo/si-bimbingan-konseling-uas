import { createTransport } from "nodemailer";

/**
 * Email configuration
 * Production: Gmail SMTP (requires App Password)
 * Development: stream transport (does not send real emails, logs content)
 */
const isProd = process.env.NODE_ENV === "production";
const hasCreds = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASSWORD);

const transporter = (isProd && hasCreds)
  ? createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })
  : createTransport({
      streamTransport: true,
      newline: "unix",
      buffer: true,
    });

/**
 * Verify email configuration
 */
export const verifyEmailConfig = async () => {
  // In development or when credentials are missing, don't verify — we use dev transport
  if (!isProd || !hasCreds) {
    console.log("✉️  Email dev mode: using stream transport (emails are not actually sent)");
    return true;
  }
  try {
    await transporter.verify();
    console.log("✅ Email service is ready to send messages");
    return true;
  } catch (error) {
    console.error("❌ Email service configuration error:", error.message);
    console.warn("⚠️  Please configure EMAIL_USER and EMAIL_PASSWORD (App Password) in .env file");
    return false;
  }
};

/**
 * Send email
 */
export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const mailOptions = {
      from: `"Sistem Bimbingan Konseling" <${process.env.EMAIL_USER || "noreply@school.com"}>`,
      to,
      subject,
      text: text || "",
      html: html || text,
    };

    const info = await transporter.sendMail(mailOptions);

    if (!isProd || !hasCreds) {
      // In dev mode, preview/log the email content rather than actually sending
      const size = info?.message?.length || 0;
      console.log(`🧪 [DEV EMAIL] to:${to} subject:"${subject}" bytes:${size}`);
    } else {
      console.log(`📧 Email sent successfully to ${to}: ${info.messageId}`);
    }

    return info;
  } catch (error) {
    console.error(`❌ Error sending email to ${to}:`, error.message);
    throw error;
  }
};

/**
 * Send bulk emails
 */
export const sendBulkEmails = async (recipients) => {
  const results = [];
  
  for (const recipient of recipients) {
    try {
      const info = await sendEmail(recipient);
      results.push({ email: recipient.to, success: true, messageId: info.messageId });
    } catch (error) {
      results.push({ email: recipient.to, success: false, error: error.message });
    }
  }
  
  const successCount = results.filter((r) => r.success).length;
  console.log(`📊 Bulk email results: ${successCount}/${recipients.length} sent successfully`);
  
  return results;
};

/**
 * Send test email
 */
export const sendTestEmail = async (to) => {
  try {
    await sendEmail({
      to,
      subject: "Test Email - Sistem Bimbingan Konseling",
      html: `
        <h2>🎉 Email Configuration Test</h2>
        <p>If you receive this email, your email service is configured correctly!</p>
        <p><strong>Timestamp:</strong> ${new Date().toLocaleString("id-ID")}</p>
        <hr>
        <p style="color: #666; font-size: 12px;">
          This is an automated test email from Sistem Bimbingan Konseling.
        </p>
      `,
    });
    return true;
  } catch (error) {
    console.error("Test email failed:", error.message);
    return false;
  }
};

// Export transporter as named export
export { transporter };
