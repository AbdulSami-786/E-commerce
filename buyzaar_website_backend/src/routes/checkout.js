import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { address, city, province = "", postal_code, name } = req.body;
    const userId = req.user.id;

    // Get cart
    const [cartRows] = await pool.query("SELECT * FROM carts WHERE user_id=?", [userId]);
    if (!cartRows.length) return res.status(400).json({ error: "No cart" });
    const cart = cartRows[0];

    const [items] = await pool.query("SELECT * FROM cart_items WHERE cart_id=?", [cart.id]);
    if (!items.length) return res.status(400).json({ error: "Cart empty" });

    // Compute total
    let total = 0;
    for (const it of items) total += parseFloat(it.price) * it.quantity;

    // Create order
    const [orderRes] = await pool.query(
      "INSERT INTO orders (user_id, total_amount, payment_method, order_status) VALUES (?, ?, ?, ?)",
      [userId, total, "COD", "pending"]
    );
    const orderId = orderRes.insertId;

    // Transfer items -> order_items + update stock
    for (const it of items) {
      await pool.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [orderId, it.product_id, it.quantity, it.price]
      );
      await pool.query("UPDATE products SET stock = stock - ? WHERE id=?", [it.quantity, it.product_id]);
    }

    // Clear cart
    await pool.query("DELETE FROM cart_items WHERE cart_id=?", [cart.id]);

    // Save address
   await pool.query(
  "INSERT INTO addresses (user_id, address_line, city, province, postal_code) VALUES (?, ?, ?, ?, ?)",
  [userId, address, city, province, postal_code]
);


    res.json({ message: "Order placed successfully ✅", orderId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
