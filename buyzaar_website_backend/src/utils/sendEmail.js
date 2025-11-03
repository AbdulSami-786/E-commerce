import nodemailer from "nodemailer";

export const sendVerificationEmail = async (email, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "BuyZaar Email Verification",
      text: `Your verification code is: ${code}`,
    });

    console.log(`✅ Verification email sent to ${email}`);
  } catch (err) {
    console.error("❌ Email sending failed:", err);
  }
};
