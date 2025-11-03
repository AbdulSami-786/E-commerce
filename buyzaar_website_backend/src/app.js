import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/products.js";
import cartRoutes from "./routes/cart.js";
import checkoutRoutes from "./routes/checkout.js";
import ordersRoutes from "./routes/orders.js";
import contactRoutes from "./routes/contact.js";
import categoriesRoutes from "./routes/category.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productsRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/checkout", checkoutRoutes);
app.use("/api/orders", ordersRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/categories", categoriesRoutes);

app.get("/", (req, res) => res.send("BuyZaar API running ✅"));

const port = process.env.PORT || 5001;
app.listen(port, () => console.log(`🚀 Backend running on port ${port}`));
