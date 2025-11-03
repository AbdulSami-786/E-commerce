import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { search, category, min, max, sort, page = 1, limit = 12 } = req.query;
    const offset = (page - 1) * limit;
    let where = "WHERE is_active=1";
    const params = [];

    if (search) {
      where += " AND (name LIKE ?)";
      params.push(`%${search}%`);
    }
    if (category) {
      where += " AND category_id=?";
      params.push(category);
    }
    if (min) {
      where += " AND price>=?";
      params.push(min);
    }
    if (max) {
      where += " AND price<=?";
      params.push(max);
    }

    let order = "ORDER BY created_at DESC";
    if (sort === "alpha") order = "ORDER BY name ASC";
    if (sort === "price_asc") order = "ORDER BY price ASC";
    if (sort === "price_desc") order = "ORDER BY price DESC";
    if (sort === "new") order = "ORDER BY created_at DESC";

    const [rows] = await pool.query(
      `SELECT SQL_CALC_FOUND_ROWS * FROM products ${where} ${order} LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );
    const [countRows] = await pool.query("SELECT FOUND_ROWS() as total");
    res.json({ items: rows, total: countRows[0].total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  const id = req.params.id;
  const [rows] = await pool.query("SELECT * FROM products WHERE id=?", [id]);
  if (!rows.length) return res.status(404).json({ error: "Not found" });
  res.json(rows[0]);
});

export default router;
