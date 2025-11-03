import express from "express";
import pool from "../db.js";

const router = express.Router();

// ✅ Get all categories
router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM categories ORDER BY id ASC");
    res.json(rows);
  } catch (err) {
    console.error("Category list error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Get single category by ID
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await pool.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);

    if (!rows.length) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Single category error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
