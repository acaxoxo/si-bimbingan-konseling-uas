import Notification from "../models/NotificationModel.js";
import { emitToUser, emitToRole } from "./socketService.js";
import { sendEmail } from "./emailService.js";

export const createNotification = async ({
  userId,
  userRole,
  title,
  message,
  type,
  referenceId = null,
  referenceType = null,
  sendEmailNotification = false,
  userEmail = null,
}) => {
  try {
    
    const notification = await Notification.create({
      user_id: userId,
      user_role: userRole,
      title,
      message,
      type,
      reference_id: referenceId,
      reference_type: referenceType,
      is_read: false,
      is_sent_email: false,
    });

    emitToUser(userId, "new_notification", {
      id: notification.id_notification,
      title: notification.title,
      message: notification.message,
      type: notification.type,
      referenceId: notification.reference_id,
      referenceType: notification.reference_type,
      createdAt: notification.created_at,
      isRead: false,
    });

    if (sendEmailNotification && userEmail) {
      try {
        await sendEmail({
          to: userEmail,
          subject: `[Notifikasi] ${title}`,
          html: generateEmailTemplate(title, message, type),
        });

        await notification.update({ is_sent_email: true });
        console.log(` Email notification sent to ${userEmail}`);
      } catch (emailError) {
        console.error("Error sending email notification:", emailError.message);
      }
    }

    console.log(` Notification created for user ${userId}: ${title}`);
    
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
};

export const notifyParentAboutPelanggaran = async (pelanggaranData, orangTuaData, siswaData) => {
  try {
    const message = `Anak Anda, ${siswaData.nama_siswa} (${siswaData.nis}), melakukan pelanggaran: ${pelanggaranData.deskripsi_pelanggaran}. Tanggal: ${new Date(pelanggaranData.tanggal_pelanggaran).toLocaleDateString("id-ID")}.`;

    await createNotification({
      userId: orangTuaData.id_orang_tua,
      userRole: "orang_tua",
      title: "Pelanggaran Baru - Anak Anda",
      message,
      type: "pelanggaran_baru",
      referenceId: pelanggaranData.id_pelanggaran,
      referenceType: "pelanggaran_siswa",
      sendEmailNotification: true,
      userEmail: orangTuaData.email_orang_tua,
    });

    console.log(` Parent notified about pelanggaran: ${orangTuaData.email_orang_tua}`);
  } catch (error) {
    console.error("Error notifying parent:", error);
  }
};

export const notifyGuruAboutTanggapan = async (tanggapanData, guruData) => {
  try {
    const message = `Orang tua telah memberikan tanggapan untuk laporan pelanggaran. Tanggapan: "${tanggapanData.isi_tanggapan}".`;

    await createNotification({
      userId: guruData.id_guru,
      userRole: "guru",
      title: "Tanggapan Orang Tua Baru",
      message,
      type: "tanggapan_baru",
      referenceId: tanggapanData.id_tanggapan,
      referenceType: "tanggapan_orang_tua",
      sendEmailNotification: true,
      userEmail: guruData.email_guru,
    });

    console.log(` Guru notified about tanggapan: ${guruData.email_guru}`);
  } catch (error) {
    console.error("Error notifying guru:", error);
  }
};

export const notifyAboutTindakanSekolah = async (tindakanData, recipients) => {
  try {
    const message = `Tindakan sekolah baru: ${tindakanData.jenis_tindakan}. Keterangan: ${tindakanData.keterangan_tindakan || "-"}`;

    for (const recipient of recipients) {
      await createNotification({
        userId: recipient.id,
        userRole: recipient.role,
        title: "Tindakan Sekolah Baru",
        message,
        type: "tindakan_sekolah",
        referenceId: tindakanData.id_tindakan,
        referenceType: "tindakan_sekolah",
        sendEmailNotification: false, 
        userEmail: recipient.email,
      });
    }

    console.log(` Notified ${recipients.length} recipients about tindakan sekolah`);
  } catch (error) {
    console.error("Error notifying about tindakan:", error);
  }
};

const generateEmailTemplate = (title, message, type) => {
  const typeColors = {
    pelanggaran_baru: "#ef4444",
    tanggapan_baru: "#3b82f6",
    tindakan_sekolah: "#f59e0b",
    system: "#6366f1",
    reminder: "#10b981",
  };

  const color = typeColors[type] || "#6366f1";

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: #f3f4f6;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 20px;">
        <tr>
          <td align="center">
            <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <!-- Header -->
              <tr>
                <td style="background-color: ${color}; padding: 30px; text-align: center;">
                  <h1 style="margin: 0; color: #ffffff; font-size: 24px;">
                     Sistem Bimbingan Konseling
                  </h1>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 30px;">
                  <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px;">
                    ${title}
                  </h2>
                  <p style="margin: 0 0 20px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">
                    ${message}
                  </p>
                  <div style="margin-top: 30px; padding: 15px; background-color: #f9fafb; border-left: 4px solid ${color}; border-radius: 4px;">
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">
                      <strong>Catatan:</strong> Silakan login ke sistem untuk melihat detail lengkap dan memberikan tanggapan jika diperlukan.
                    </p>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="background-color: #f9fafb; padding: 20px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
                  <p style="margin: 0 0 10px 0; color: #6b7280; font-size: 14px;">
                    Email ini dikirim secara otomatis oleh sistem.
                  </p>
                  <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                    © ${new Date().getFullYear()} Sistem Bimbingan Konseling. All rights reserved.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;
};

