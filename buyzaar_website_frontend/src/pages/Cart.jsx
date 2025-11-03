import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function Cart() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location = "/signup");
    loadCart(token);
  }, []);

  async function loadCart(token) {
    try {
      const res = await axios.get("http://localhost:5001/api/cart", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setItems(res.data.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error(err);
    }
  }

  async function removeItem(id) {
    const token = localStorage.getItem("token");
    await axios.delete(`http://localhost:5001/api/cart/items/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    loadCart(token);
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Cart</h2>
      {items.length === 0 ? (
        <p>
          Your cart is empty. <Link to="/products" className="text-blue-600">Shop now</Link>.
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-6">
            {items.map((it) => (
              <div
                key={it.id}
                className="flex justify-between items-center bg-white p-3 rounded shadow"
              >
                <div>
                  <div className="font-semibold">{it.product_name}</div>
                  <div className="text-sm text-gray-600">
                    Qty: {it.quantity} × PKR {it.price}
                  </div>
                </div>
                <button
                  onClick={() => removeItem(it.id)}
                  className="text-red-600 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="text-right">
            <div className="text-lg font-semibold mb-2">Total: PKR {total}</div>
            <Link
              to="/checkout"
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Proceed to Checkout
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
