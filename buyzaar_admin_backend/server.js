const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "sami123",
  password: "sami1234500000asw",
  database: "buyzaar",
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
    process.exit(1);
  }
  console.log("✅ Connected to MySQL (buyzaar)");
});

// ================== ROUTES ==================

// 🧩 Get all products
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ➕ Add product
app.post("/api/products", (req, res) => {
  const {
    name,
    slug,
    description,
    price,
    stock,
    sku,
    category_id,
    images,
    is_active,
  } = req.body;

  const sql = `
    INSERT INTO products 
    (name, slug, description, price, stock, sku, category_id, images, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
  `;

  db.query(
    sql,
    [name, slug, description, price, stock, sku, category_id, JSON.stringify(images), is_active],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Product added", id: result.insertId });
    }
  );
});

// ✏️ Update product
app.put("/api/products/:id", (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    description,
    price,
    stock,
    sku,
    category_id,
    images,
    is_active,
  } = req.body;

  const sql = `
    UPDATE products 
    SET name=?, slug=?, description=?, price=?, stock=?, sku=?, category_id=?, images=?, is_active=?, updated_at=NOW() 
    WHERE id=?
  `;

  db.query(
    sql,
    [name, slug, description, price, stock, sku, category_id, JSON.stringify(images), is_active, id],
    (err) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Product updated" });
    }
  );
});

// ❌ Delete product
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Product deleted" });
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("✅ Buyzaar Backend Running (Products API Updated)");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});
