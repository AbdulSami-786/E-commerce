import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

export default function CategoryPage() {
  const { id } = useParams(); // get category ID from URL
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch category info
    axios
      .get(`http://localhost:5001/api/categories/${id}`)
      .then((res) => setCategory(res.data))
      .catch((err) => console.log("Category fetch error:", err));

    // Fetch products for this category
    axios
      .get(`http://localhost:5001/api/products?category=${id}`)
      .then((res) => setProducts(res.data.items || []))
      .catch((err) => console.log("Product fetch error:", err));
  }, [id]);

  if (!category)
    return (
      <div className="text-center p-10 text-gray-600">
        Loading category...
      </div>
    );

  return (
    <div className="p-6">
      {/* Header */}
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">{category.name}</h1>
        <p className="text-gray-500">Explore all {category.name} products below</p>
      </section>

      {/* Category Banner */}
      {category.image && (
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-60 object-cover rounded-lg mb-10 shadow"
        />
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {products.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No products available in this category.
          </div>
        ) : (
          products.map((p) => (
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
          ))
        )}
      </div>
    </div>
  );
}
