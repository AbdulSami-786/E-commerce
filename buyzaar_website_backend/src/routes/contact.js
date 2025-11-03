import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    const [userRows] = await pool.query("SELECT * FROM users WHERE id=?", [userId]);
    if (!userRows.length) return res.status(404).json({ error: "User not found" });

    await pool.query(
      "INSERT INTO contact_queries (user_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)",
      [userId, userRows[0].name, userRows[0].email, userRows[0].phone, message]
    );

    res.json({ message: "Sent" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
