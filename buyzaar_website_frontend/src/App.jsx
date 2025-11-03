import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
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

// 🧠 Helper for protected routes
function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/signup" replace />;
}

// 🌍 Navbar Component
function Navbar({ onSearch }) {
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
      if (onSearch) onSearch(search);
    }
  }

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <Link to="/" className="text-xl font-bold">
          BuyZaar
        </Link>
        <Link to="/products" className="hover:underline">
          Products
        </Link>
        <Link to="/contact" className="hover:underline">
          Contact
        </Link>
        <Link to="/about" className="hover:underline">
          About
        </Link>
      </div>

      <form onSubmit={handleSearch} className="hidden md:flex items-center gap-2">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="p-1 px-2 rounded text-black"
        />
        <button type="submit" className="bg-white text-blue-600 px-2 py-1 rounded text-sm font-semibold">
          Search
        </button>
      </form>

      <div className="flex items-center gap-4">
        <Link to="/cart" className="hover:underline">
          🛒 Cart
        </Link>
        {token ? (
          <>
            <Link to="/orders" className="hover:underline">
              Orders
            </Link>
            <Link to="/user" className="hover:underline">
              Profile
            </Link>
            <button onClick={logout} className="bg-white text-blue-600 px-2 py-1 rounded text-sm font-semibold">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/signup" className="hover:underline">
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
    <footer className="bg-gray-100 text-center py-6 mt-10 text-sm text-gray-600">
      <div className="flex justify-center gap-6 mb-2">
        <Link to="/policy" className="hover:underline">
          Policy
        </Link>
        <Link to="/return" className="hover:underline">
          Return
        </Link>
        <Link to="/about" className="hover:underline">
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
        <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetail />} />
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
