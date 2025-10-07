import nodemailer from "nodemailer";
import { SendOtpMailContent } from "../utils/MailContent.js";

export const sendOtpMail = async (otp, email) => {
  try {
    const mailContent = SendOtpMailContent(otp);
    console.log("env cheking",process.env.EMAIL_PASS)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: `"EQES Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your EQES Password Reset — One-Time PIN (OTP)",
      html: mailContent,
    });

    // ✅ Check for real delivery status
    if (info.accepted && info.accepted.length > 0) {
      console.log("✅ OTP email successfully sent to:", info.accepted[0]);
      return true;
    } else {
      console.error("❌ Email not sent. Rejected:", info.rejected);
      return false;
    }
  } catch (error) {
    console.error("🚨 Error sending OTP email:", error.message);
    return false;
  }
};
