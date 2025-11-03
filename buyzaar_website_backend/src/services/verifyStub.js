import { sendVerificationEmail } from "../utils/sendEmail.js";
import { v4 as uuidv4 } from "uuid";

export async function sendEmailVerification(email, token) {
  await sendVerificationEmail(email, token);
}

export async function sendSmsOtp(phone, otp) {
  console.log(`[SMS-STUB] Send OTP to ${phone}: otp=${otp}`);
}
