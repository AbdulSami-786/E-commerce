import express from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import pool from "../db.js";

dotenv.config();
const router = express.Router();

// Temporary in-memory store { email: { code, name, phone, password } }
const verificationCodes = {};

// 1️⃣ SEND EMAIL CODE
router.post("/send-code", async (req, res) => {
  const { name, phone, email, password } = req.body;

  if (!name || !phone || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Generate a 5-character verification code (like "12e4s")
    const code = crypto
      .randomBytes(3)
      .toString("base64")
      .replace(/[^a-z0-9]/gi, "")
      .slice(0, 5)
      .toLowerCase();

    verificationCodes[email] = { code, name, phone, password };

    await sendVerificationEmail(email, code);
    console.log(`📧 Verification code for ${email}: ${code}`);

    return res.json({ message: "Verification code sent to your email" });
  } catch (err) {
    console.error("❌ Email send error:", err);
    return res.status(500).json({ message: "Failed to send verification email" });
  }
});

// 2️⃣ VERIFY CODE & REGISTER USER + GENERATE TOKEN
router.post("/verify-code", async (req, res) => {
  const { email, code } = req.body;
  const record = verificationCodes[email];

  if (!record) {
    return res.status(400).json({ message: "No verification found. Please sign up again." });
  }

  if (record.code !== code.toLowerCase()) {
    return res.status(400).json({ message: "Invalid verification code" });
  }

  try {
    const hashed = await bcrypt.hash(record.password, 10);

    // ✅ Insert user into DB
    const sql = `
      INSERT INTO users (name, phone, email, password_hash, is_email_verified)
      VALUES (?, ?, ?, ?, 1)
    `;
    const [result] = await pool.query(sql, [record.name, record.phone, email, hashed]);

    // ✅ Generate JWT Token after signup
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET || "buyzaar_secret_key",
      { expiresIn: "7d" }
    );

    // Cleanup memory cache
    delete verificationCodes[email];

    return res.json({
      message: "✅ Email verified and user registered successfully",
      token,
      user: {
        id: result.insertId,
        name: record.name,
        email,
        phone: record.phone,
      },
    });
  } catch (err) {
    console.error("❌ Database Error:", err);

    return res.status(500).json({
      message:
        err.code === "ER_DUP_ENTRY"
          ? "Email or phone number already registered"
          : err.sqlMessage || "Database error while creating user",
    });
  }
});

// 3️⃣ LOGIN + TOKEN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({ message: "Email and password required" });

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);

    if (rows.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    if (!user.is_email_verified)
      return res.status(400).json({ message: "Please verify your email first" });

    // ✅ Generate JWT Token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "buyzaar_secret_key",
      { expiresIn: "7d" }
    );

    return res.json({
      message: "✅ Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error("❌ Login DB Error:", err);
    return res.status(500).json({ message: "Database error during login" });
  }
});

export default router;
