import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();
router.use(authMiddleware);

// ✅ GET list of user orders
router.get("/", async (req, res) => {
  try {
    const userId = req.user.id;
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE user_id=? ORDER BY order_date DESC",
      [userId]
    );
    res.json({ orders });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ GET single order details
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [orderRows] = await pool.query(
      "SELECT * FROM orders WHERE id=? AND user_id=?",
      [id, req.user.id]
    );
    if (!orderRows.length)
      return res.status(404).json({ error: "Order not found" });

    const [items] = await pool.query(
      "SELECT oi.*, p.name FROM order_items oi LEFT JOIN products p ON p.id=oi.product_id WHERE oi.order_id=?",
      [id]
    );
    res.json({ order: orderRows[0], items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ✅ Cancel order (only if not packaging)
router.post("/:id/cancel", async (req, res) => {
  try {
    const id = req.params.id;
    const [orderRows] = await pool.query(
      "SELECT * FROM orders WHERE id=? AND user_id=?",
      [id, req.user.id]
    );

    if (!orderRows.length)
      return res.status(404).json({ error: "Order not found" });

    const order = orderRows[0];
    if (order.order_status === "packaging")
      return res.status(403).json({ error: "Cannot cancel - packaging" });

    await pool.query('UPDATE orders SET order_status="cancelled" WHERE id=?', [
      id,
    ]);
    res.json({ message: "Order cancelled" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
