// const express = require("express");
// const mysql = require("mysql2");
// const cors = require("cors");

// const app = express();
// const PORT = 5000;

// // Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ MySQL connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "sami123",
//   password: "sami1234500000asw",
//   database: "buyzaar",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("❌ MySQL connection error:", err.message);
//     process.exit(1);
//   }
//   console.log("✅ Connected to MySQL (buyzaar)");
// });

// // ================== ROUTES ==================

// // 🧩 Get all products
// app.get("/api/products", (req, res) => {
//   const sql = "SELECT * FROM products";
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// });

// // ➕ Add product
// app.post("/api/products", (req, res) => {
//   const {
//     name,
//     slug,
//     description,
//     price,
//     stock,
//     sku,
//     category_id,
//     images,
//     is_active,
//   } = req.body;

//   const sql = `
//     INSERT INTO products 
//     (name, slug, description, price, stock, sku, category_id, images, is_active, created_at, updated_at)
//     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
//   `;

//   db.query(
//     sql,
//     [name, slug, description, price, stock, sku, category_id, JSON.stringify(images), is_active],
//     (err, result) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: "✅ Product added", id: result.insertId });
//     }
//   );
// });

// // ✏️ Update product
// app.put("/api/products/:id", (req, res) => {
//   const { id } = req.params;
//   const {
//     name,
//     slug,
//     description,
//     price,
//     stock,
//     sku,
//     category_id,
//     images,
//     is_active,
//   } = req.body;

//   const sql = `
//     UPDATE products 
//     SET name=?, slug=?, description=?, price=?, stock=?, sku=?, category_id=?, images=?, is_active=?, updated_at=NOW() 
//     WHERE id=?
//   `;

//   db.query(
//     sql,
//     [name, slug, description, price, stock, sku, category_id, JSON.stringify(images), is_active, id],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: "✅ Product updated" });
//     }
//   );
// });

// // ❌ Delete product
// app.delete("/api/products/:id", (req, res) => {
//   const { id } = req.params;
//   db.query("DELETE FROM products WHERE id = ?", [id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: "🗑️ Product deleted" });
//   });
// });

// // Default route
// app.get("/", (req, res) => {
//   res.send("✅ Buyzaar Backend Running (Products API Updated)");
// });

// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
// });

// server.js
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL connection (same credentials as original)
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

// ----------------- PRODUCTS (enhanced) -----------------
// Return products but include category name (if present)
app.get("/api/products", (req, res) => {
  const sql = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.id DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Keep add/update/delete product endpoints from your original implementation (optional)
// For brevity not repeated — keep your existing endpoints if you like.

// ----------------- CATEGORIES -----------------
app.get("/api/categories", (req, res) => {
  db.query("SELECT * FROM categories ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/categories", (req, res) => {
  const { name, slug, description } = req.body;
  db.query(
    "INSERT INTO categories (name, slug, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())",
    [name, slug, description],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "✅ Category added", id: result.insertId });
    }
  );
});

app.delete("/api/categories/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM categories WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Category deleted" });
  });
});

// ----------------- CONTACT QUERIES -----------------
// Read all queries
app.get("/api/contact-queries", (req, res) => {
  db.query(
    `SELECT cq.*, u.email AS user_email, u.name AS user_name
     FROM contact_queries cq
     LEFT JOIN users u ON cq.user_id = u.id
     ORDER BY cq.created_at DESC`,
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Read single
app.get("/api/contact-queries/:id", (req, res) => {
  db.query("SELECT * FROM contact_queries WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  });
});

// Update status (new, in_progress, resolved)
app.put("/api/contact-queries/:id", (req, res) => {
  const { status } = req.body;
  if (!["new", "in_progress", "resolved"].includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }
  db.query("UPDATE contact_queries SET status = ? WHERE id = ?", [status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Status updated" });
  });
});

// Note: schema has no 'reply' column. If you want to save replies, add a column or a new table.
// You might also send an email from here: integrate nodemailer if desired.

// ----------------- ORDERS -----------------
// Get all orders (with user name/email)
app.get("/api/orders", (req, res) => {
  const sql = `
    SELECT o.*, u.name AS user_name, u.email AS user_email
    FROM orders o
    LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.order_date DESC
  `;
  db.query(sql, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Get one order and its items (including product basic info)
app.get("/api/orders/:id", (req, res) => {
  const orderId = req.params.id;
  db.query(
    `SELECT o.*, u.name AS user_name, u.email AS user_email
     FROM orders o
     LEFT JOIN users u ON o.user_id = u.id
     WHERE o.id = ?`,
    [orderId],
    (err, orders) => {
      if (err) return res.status(500).json({ error: err.message });
      if (orders.length === 0) return res.status(404).json({ error: "Order not found" });

      db.query(
        `SELECT oi.*, p.name AS product_name, p.sku, p.price as product_price
         FROM order_items oi
         LEFT JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [orderId],
        (err2, items) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ order: orders[0], items });
        }
      );
    }
  );
});

// Create order (basic): expects { user_id, payment_method, total_amount, order_items: [{product_id, quantity, price}] }
// This is a simplified creation (no transaction handling here). In production wrap in transaction.
app.post("/api/orders", (req, res) => {
  const { user_id, payment_method = "COD", total_amount, order_items = [] } = req.body;
  db.query(
    "INSERT INTO orders (user_id, total_amount, payment_method, order_status, order_date) VALUES (?, ?, ?, 'pending', NOW())",
    [user_id, total_amount, payment_method],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      const orderId = result.insertId;
      if (!Array.isArray(order_items) || order_items.length === 0) {
        return res.json({ message: "✅ Order created", id: orderId });
      }

      // insert order items
      const values = order_items.map((it) => [orderId, it.product_id || null, it.quantity || 1, it.price || 0]);
      db.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?",
        [values],
        (err2) => {
          if (err2) return res.status(500).json({ error: err2.message });
          res.json({ message: "✅ Order and items created", id: orderId });
        }
      );
    }
  );
});

// Update order status (packaging, on_way, delivered, cancelled)
app.put("/api/orders/:id", (req, res) => {
  const { order_status } = req.body;
  if (!["pending", "packaging", "on_way", "delivered", "cancelled"].includes(order_status)) {
    return res.status(400).json({ error: "Invalid order_status" });
  }
  db.query("UPDATE orders SET order_status = ? WHERE id = ?", [order_status, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ Order status updated" });
  });
});

// Delete order
app.delete("/api/orders/:id", (req, res) => {
  db.query("DELETE FROM orders WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ Order deleted" });
  });
});

// ----------------- USERS -----------------
app.get("/api/users", (req, res) => {
  db.query("SELECT id, name, email, phone, is_email_verified, is_phone_verified, created_at FROM users ORDER BY id ASC", (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get("/api/users/:id", (req, res) => {
  db.query("SELECT id, name, email, phone, is_email_verified, is_phone_verified, created_at FROM users WHERE id = ?", [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    if (rows.length === 0) return res.status(404).json({ error: "Not found" });
    res.json(rows[0]);
  });
});

// Update user email and/or password. Body may contain { email, password, name, phone }
app.put("/api/users/:id", async (req, res) => {
  const { email, password, name, phone } = req.body;
  // build dynamic set
  const updates = [];
  const params = [];

  if (email) {
    updates.push("email = ?");
    params.push(email);
  }
  if (typeof name !== "undefined") {
    updates.push("name = ?");
    params.push(name);
  }
  if (typeof phone !== "undefined") {
    updates.push("phone = ?");
    params.push(phone);
  }
  if (password) {
    const hash = await bcrypt.hash(password, 10);
    updates.push("password_hash = ?");
    params.push(hash);
  }

  if (updates.length === 0) return res.status(400).json({ error: "No fields to update" });
  params.push(req.params.id);
  const sql = `UPDATE users SET ${updates.join(", ")} WHERE id = ?`;
  db.query(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "✅ User updated" });
  });
});

// Delete user
app.delete("/api/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "🗑️ User deleted" });
  });
});

// Default route
app.get("/", (req, res) => {
  res.send("✅ Buyzaar Backend Running (Products, Orders, Categories, Users, Contact Queries)");
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://127.0.0.1:${PORT}`);
});

