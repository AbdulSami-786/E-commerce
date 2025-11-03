import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Home() {
  const [top, setTop] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/products?sort=new&limit=6")
      .then((res) => setTop(res.data.items || []));
  }, []);

  return (
    <div>
      <section className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Welcome to BuyZaar</h1>
        <p className="text-gray-600">Shop smart. Shop local. Shop easy.</p>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Top Trending Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {top.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="bg-white shadow p-3 rounded"
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

      <section className="mt-12 bg-blue-50 p-6 rounded text-center">
        <h3 className="font-semibold text-lg mb-2">Our Reviews</h3>
        <p className="text-gray-600 italic">
          “Best online store I’ve used this year! – CodeCraft Student”
        </p>
      </section>
    </div>
  );
}
