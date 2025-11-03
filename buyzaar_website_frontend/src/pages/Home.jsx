import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

export default function Home() {
  const [top, setTop] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryProducts, setCategoryProducts] = useState({});
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // check if user is logged in
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // fetch top trending products
    axios
      .get("http://localhost:5001/api/products?sort=new&limit=6")
      .then((res) => setTop(res.data.items || []))
      .catch((err) => console.error("Top products fetch error:", err));

    // fetch categories
    axios
      .get("http://localhost:5001/api/categories")
      .then((res) => {
        setCategories(res.data || []);

        // for each category, load 4 products
        res.data.forEach((cat) => {
          axios
            .get(`http://localhost:5001/api/products?category=${cat.id}&limit=4`)
            .then((pRes) =>
              setCategoryProducts((prev) => ({
                ...prev,
                [cat.id]: pRes.data.items || [],
              }))
            )
            .catch((err) =>
              console.error(`Products fetch error for ${cat.name}:`, err)
            );
        });
      })
      .catch((err) => console.error("Categories fetch error:", err));
  }, []);

  return (
    <div className="p-4">
      {/* 🏠 Hero Banner */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-8 rounded-lg mb-10 text-center shadow-lg">
        <h1 className="text-4xl font-bold mb-3">Welcome to BuyZaar 🛍️</h1>
        <p className="text-lg mb-4">
          Discover top deals, hot categories, and the latest trends!
        </p>
        <Link
          to="/products"
          className="bg-white text-blue-600 font-semibold py-2 px-5 rounded shadow hover:bg-gray-100 transition"
        >
          Shop Now
        </Link>
      </section>

      {/* 🔥 Top Trending Products */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          🔥 Top Trending Products
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {top.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="bg-white shadow hover:shadow-lg p-3 rounded transition"
            >
              <img
                src={p.images ? JSON.parse(p.images)[0] : "/placeholder.png"}
                alt={p.name}
                className="h-40 w-full object-cover mb-2 rounded"
              />
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-500">PKR {p.price}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* 🏷️ Categories Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">
          🏷️ Shop by Category
        </h2>
        {categories.length === 0 ? (
          <p className="text-gray-500 text-center">No categories found.</p>
        ) : (
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => navigate(`/category/${cat.id}`)}
                className="cursor-pointer bg-white hover:bg-blue-50 shadow-md rounded-lg p-4 text-center w-36 transition"
              >
                <img
                  src={cat.image || "/placeholder.png"}
                  alt={cat.name}
                  className="h-20 w-full object-cover mb-2 rounded"
                />
                <div className="font-medium">{cat.name}</div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 🧺 Category-wise Products */}
      {categories.map((cat) => (
        <section key={cat.id} className="mb-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{cat.name}</h3>
            <button
              onClick={() => navigate(`/category/${cat.id}`)}
              className="text-blue-600 hover:underline text-sm"
            >
              View All →
            </button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {(categoryProducts[cat.id] || []).length === 0 ? (
              <p className="text-gray-400 col-span-full text-center">
                No products yet in this category.
              </p>
            ) : (
              (categoryProducts[cat.id] || []).map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.id}`}
                  className="bg-white shadow hover:shadow-lg p-3 rounded transition"
                >
                  <img
                    src={p.images ? JSON.parse(p.images)[0] : "/placeholder.png"}
                    alt={p.name}
                    className="h-36 w-full object-cover mb-2 rounded"
                  />
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-gray-500">PKR {p.price}</div>
                </Link>
              ))
            )}
          </div>
        </section>
      ))}

      {/* 🎁 Special Offers */}
      {!user && (
        <section className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center shadow-sm mb-12">
          <h3 className="font-bold text-lg mb-2 text-yellow-700">
            🎁 Special Offers!
          </h3>
          <p className="text-gray-600">
            Sign up today and get <b>10% off</b> on your first order!
          </p>
          <Link
            to="/signup"
            className="inline-block mt-3 bg-yellow-400 hover:bg-yellow-500 text-white py-2 px-4 rounded transition"
          >
            Join Now
          </Link>
        </section>
      )}

      {/* 💬 Reviews Section */}
      <section className="bg-blue-50 p-6 rounded text-center">
        <h3 className="font-semibold text-lg mb-2">💬 Our Reviews</h3>
        <p className="text-gray-600 italic">
          “Best online store I’ve used this year! – CodeCraft Student”
        </p>
      </section>
    </div>
  );
}
