import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { Link, useNavigate } from "react-router-dom";
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

  const location = useLocation();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const searchQuery = params.get("search") || "";
    setFilter((prev) => ({ ...prev, search: searchQuery }));
  }, [location.search]);

  useEffect(() => {
    loadProducts();
  }, [filter]);

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
      flexDirection: "column",
      gap: "20px",
      padding: "20px",
      backgroundColor: "#f8f9fb",
      minHeight: "100vh",
    },
    filters: {
      display: "flex",
      flexWrap: "wrap",
      gap: "16px",
      backgroundColor: "#fff",
      padding: "16px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    },
    filterItem: {
      flex: "1 1 200px",
      display: "flex",
      flexDirection: "column",
    },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      outline: "none",
      fontSize: "14px",
    },
    button: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "10px",
      borderRadius: "8px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "0.3s ease",
    },
    productsGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
      gap: "20px",
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: "12px",
      padding: "16px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
      display: "flex",
      flexDirection: "column",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
    },
    cardImg: {
      width: "100%",
      height: "180px",
      objectFit: "cover",
      borderRadius: "10px",
      marginBottom: "12px",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "bold",
      marginBottom: "6px",
      minHeight: "40px",
    },
    cardPrice: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#28a745",
      marginBottom: "6px",
    },
    cardCategory: {
      fontSize: "13px",
      color: "#777",
      marginBottom: "10px",
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
      {/* Filter Section on Top */}
      <div style={styles.filters}>
        <div style={styles.filterItem}>
          <input
            style={styles.input}
            placeholder="🔍 Search products..."
            value={filter.search}
            onChange={(e) => setFilter({ ...filter, search: e.target.value })}
            onKeyDown={(e) => e.key === "Enter" && loadProducts()}
          />
        </div>

        <div style={styles.filterItem}>
          <label>Category</label>
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
        </div>

        <div style={styles.filterItem}>
          <label>Sort By</label>
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
        </div>

        <div style={styles.filterItem}>
          <label>Price Range (PKR)</label>
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="number"
              placeholder="Min"
              style={styles.input}
              value={filter.min}
              onChange={(e) => setFilter({ ...filter, min: e.target.value })}
            />
            <input
              type="number"
              placeholder="Max"
              style={styles.input}
              value={filter.max}
              onChange={(e) => setFilter({ ...filter, max: e.target.value })}
            />
          </div>
        </div>

        <div style={styles.filterItem}>
          <button
            onClick={loadProducts}
            style={styles.button}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
          >
            Apply Filters
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div style={styles.productsGrid}>
        {products.length > 0 ? (
          products.map((p) => (
             <Link
                  key={p.id}
                  to={`/products/${p.id}`}>

            <div
              key={p.id}
              style={styles.card}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-5px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
              >
              <img src={p.image_url} alt={p.name} style={styles.cardImg} />
              <div style={styles.cardTitle}>{p.name}</div>
              <div style={styles.cardPrice}>Rs. {p.price}</div>
              <div style={styles.cardCategory}>{p.category}</div>
            </div>
              </Link>
          ))
        ) : (
          <div style={styles.noProduct}>No products found 😢</div>
        )}
      </div>
    </div>
  );
}
