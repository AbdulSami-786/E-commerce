import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({
    category: "",
    sort: "new",
    min: "",
    max: "",
    search: "",
  });

  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  async function loadCategories() {
    const res = await axios.get("http://localhost:5001/api/categories");
    setCategories(res.data);
  }

  async function loadProducts() {
    const params = new URLSearchParams(filter).toString();
    const res = await axios.get(`http://localhost:5001/api/products?${params}`);
    setProducts(res.data.items || []);
  }

  const styles = {
    container: {
      display: "flex",
      flexDirection: "row",
      gap: "24px",
      flexWrap: "wrap",
      padding: "20px",
      backgroundColor: "var(--bg-color, #f8f9fb)",
      minHeight: "100vh",
    },
    sidebar: {
      width: "260px",
      backgroundColor: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
      padding: "20px",
      flexShrink: 0,
      transition: "all 0.3s ease",
    },
    heading: {
      fontWeight: "bold",
      fontSize: "18px",
      marginBottom: "16px",
      color: "#333",
      borderBottom: "2px solid #eee",
      paddingBottom: "6px",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      marginBottom: "14px",
      outline: "none",
      fontSize: "14px",
      transition: "0.2s ease",
    },
    label: {
      fontWeight: 600,
      fontSize: "14px",
      marginBottom: "6px",
      display: "block",
      color: "#444",
    },
    rangeRow: {
      display: "flex",
      gap: "8px",
      marginBottom: "16px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      width: "100%",
      padding: "10px",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s ease",
    },
    grid: {
      display: "grid",
      flex: 1,
      gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
      gap: "20px",
      alignItems: "stretch",
    },
    noProduct: {
      gridColumn: "1 / -1",
      textAlign: "center",
      color: "#777",
      fontSize: "16px",
      marginTop: "40px",
    },
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Filters */}
      <aside style={styles.sidebar}>
        <h2 style={styles.heading}>🎯 Filter Products</h2>

        <input
          style={styles.input}
          placeholder="🔍 Search products..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          onKeyDown={(e) => e.key === "Enter" && loadProducts()}
        />

        <label style={styles.label}>Category</label>
        <select
          style={styles.input}
          value={filter.category}
          onChange={(e) => setFilter({ ...filter, category: e.target.value })}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <label style={styles.label}>Sort By</label>
        <select
          style={styles.input}
          value={filter.sort}
          onChange={(e) => setFilter({ ...filter, sort: e.target.value })}
        >
          <option value="new">🆕 Newly Added</option>
          <option value="alpha">🔤 Alphabetically</option>
          <option value="price_low">💸 Price: Low → High</option>
          <option value="price_high">💰 Price: High → Low</option>
        </select>

        <label style={styles.label}>Price Range (PKR)</label>
        <div style={styles.rangeRow}>
          <input
            type="number"
            placeholder="Min"
            style={{ ...styles.input, marginBottom: 0 }}
            value={filter.min}
            onChange={(e) => setFilter({ ...filter, min: e.target.value })}
          />
          <input
            type="number"
            placeholder="Max"
            style={{ ...styles.input, marginBottom: 0 }}
            value={filter.max}
            onChange={(e) => setFilter({ ...filter, max: e.target.value })}
          />
        </div>

        <button
          onClick={loadProducts}
          style={styles.button}
          onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
          onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
        >
          Apply Filters
        </button>
      </aside>

      {/* Product Grid */}
      <div style={styles.grid}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
        {products.length === 0 && (
          <div style={styles.noProduct}>No products found 😢</div>
        )}
      </div>
    </div>
  );
}
