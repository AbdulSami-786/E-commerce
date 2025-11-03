import express from "express";
import pool from "../db.js";
import { authMiddleware } from "../utils/auth.js";

const router = express.Router();

router.use(authMiddleware);

async function getOrCreateCart(userId) {
  const [rows] = await pool.query("SELECT * FROM carts WHERE user_id=?", [userId]);
  if (rows.length) return rows[0];
  const [r] = await pool.query("INSERT INTO carts (user_id) VALUES (?)", [userId]);
  const [newCartRows] = await pool.query("SELECT * FROM carts WHERE id=?", [r.insertId]);
  return newCartRows[0];
}

router.get("/", async (req, res) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    const [items] = await pool.query(
      "SELECT ci.*, p.name, p.images FROM cart_items ci LEFT JOIN products p ON p.id=ci.product_id WHERE ci.cart_id=?",
      [cart.id]
    );
    res.json({ cart, items });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.post("/items", async (req, res) => {
  try {
    const { product_id, quantity = 1 } = req.body;
    const cart = await getOrCreateCart(req.user.id);
    const [exists] = await pool.query("SELECT * FROM cart_items WHERE cart_id=? AND product_id=?", [
      cart.id,
      product_id,
    ]);

    if (exists.length) {
      await pool.query("UPDATE cart_items SET quantity=quantity+? WHERE id=?", [quantity, exists[0].id]);
    } else {
      const [prod] = await pool.query("SELECT price FROM products WHERE id=?", [product_id]);
      if (!prod.length) return res.status(404).json({ error: "Product not found" });
      await pool.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [cart.id, product_id, quantity, prod[0].price]
      );
    }

    res.json({ message: "Added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/items/:id", async (req, res) => {
  try {
    const cid = req.params.id;
    const { quantity } = req.body;
    await pool.query("UPDATE cart_items SET quantity=? WHERE id=?", [quantity, cid]);
    res.json({ message: "Updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.delete("/items/:id", async (req, res) => {
  try {
    const cid = req.params.id;
    await pool.query("DELETE FROM cart_items WHERE id=?", [cid]);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
