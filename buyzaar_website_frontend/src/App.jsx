import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import CategoryPage from "./pages/CategoryPage";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";
import UserDetail from "./pages/UserDetail";
import About from "./pages/About";
import Policy from "./pages/Policy";
import Return from "./pages/Return";
import VerifyEmail from "./pages/VerifyEmail";

// 🔒 Private Route Wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signup" replace />;
}

// 🌍 Navbar Component
function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [search, setSearch] = useState("");

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  function handleSearch(e) {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search)}`);
      setSearch("");
    }
  }

  const styles = {
    navbar: {
      backgroundColor: "#0d6efd",
      color: "white",
      padding: "14px 24px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0 2px 10px rgba(0,0,0,0.15)",
      position: "sticky",
      top: 0,
      zIndex: 1000,
    },
    logo: {
      fontSize: "22px",
      fontWeight: "bold",
      cursor: "pointer",
    },
    links: {
      display: "flex",
      gap: "20px",
      alignItems: "center",
    },
    link: {
      color: "white",
      textDecoration: "none",
      fontWeight: 500,
      transition: "0.3s",
    },
    searchForm: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "white",
      borderRadius: "8px",
      overflow: "hidden",
      margin: "0 20px",
    },
    searchInput: {
      border: "none",
      outline: "none",
      padding: "8px 12px",
      fontSize: "14px",
      width: "250px",
      color:"black",
    },
    searchBtn: {
      backgroundColor: "#0d6efd",
      color: "white",
      border: "none",
      padding: "8px 14px",
      cursor: "pointer",
      fontWeight: 600,
    },
    right: {
      display: "flex",
      alignItems: "center",
      gap: "16px",
    },
    logoutBtn: {
      backgroundColor: "white",
      color: "#0d6efd",
      border: "none",
      padding: "6px 10px",
      borderRadius: "6px",
      cursor: "pointer",
      fontWeight: 600,
    },
  };

  return (
    <nav style={styles.navbar}>
      <div style={styles.links}>
        <span style={styles.logo} onClick={() => navigate("/")}>
          🛒 BuyZaar
        </span>
        <Link to="/products" style={styles.link}>
          Products
        </Link>
        <Link to="/contact" style={styles.link}>
          Contact
        </Link>
        <Link to="/about" style={styles.link}>
          About
        </Link>
      </div>

      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={styles.searchInput}
        />
        <button type="submit" style={styles.searchBtn}>
          Search
        </button>
      </form>

      <div style={styles.right}>
        <Link to="/cart" style={styles.link}>
          🛍 Cart
        </Link>
        {token ? (
          <>
            <Link to="/orders" style={styles.link}>
              Orders
            </Link>
            <Link to="/user" style={styles.link}>
              Profile
            </Link>
            <button onClick={logout} style={styles.logoutBtn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>
              Login
            </Link>
            <Link to="/signup" style={styles.link}>
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

// 🌙 Footer Component
function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#f8f9fa",
        padding: "20px 0",
        textAlign: "center",
        marginTop: "40px",
        color: "#555",
        borderTop: "1px solid #ddd",
      }}
    >
      <div style={{ marginBottom: "10px" }}>
        <Link to="/policy" style={{ margin: "0 10px", color: "#0d6efd" }}>
          Policy
        </Link>
        <Link to="/return" style={{ margin: "0 10px", color: "#0d6efd" }}>
          Return
        </Link>
        <Link to="/about" style={{ margin: "0 10px", color: "#0d6efd" }}>
          About Us
        </Link>
      </div>
      <div>© {new Date().getFullYear()} BuyZaar. All rights reserved.</div>
    </footer>
  );
}

// 🚀 Main App
export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <main style={{ flex: 1, padding: "24px", maxWidth: "1200px", margin: "0 auto" }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
            <Route path="/category/:id" element={<CategoryPage />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <Cart />
                </PrivateRoute>
              }
            />
            <Route
              path="/checkout"
              element={
                <PrivateRoute>
                  <Checkout />
                </PrivateRoute>
              }
            />
            <Route
              path="/orders"
              element={
                <PrivateRoute>
                  <Orders />
                </PrivateRoute>
              }
            />
            <Route
              path="/contact"
              element={
                <PrivateRoute>
                  <Contact />
                </PrivateRoute>
              }
            />
            <Route
              path="/user"
              element={
                <PrivateRoute>
                  <UserDetail />
                </PrivateRoute>
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/policy" element={<Policy />} />
            <Route path="/return" element={<Return />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/verify" element={<VerifyEmail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
