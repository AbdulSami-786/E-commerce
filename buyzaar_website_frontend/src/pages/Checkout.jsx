import React, { useState } from "react";
import axios from "axios";

export default function Checkout() {
  const [form, setForm] = useState({
    name: "",
    address: "",
    city: "",
    postal_code: "",
  });
  const [msg, setMsg] = useState("");

  async function placeOrder() {
    const token = localStorage.getItem("token");
    if (!token) return (window.location = "/signup");
    try {
      const res = await axios.post(
        "http://localhost:5001/api/checkout",
        { ...form, payment_method: "cod" },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg(res.data.message || "Order placed successfully!");
      setForm({ name: "", address: "", city: "", postal_code: "" });
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.error || "Failed to place order");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Checkout (Cash on Delivery)</h2>

      <div className="grid gap-3">
        <input
          placeholder="Full Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="City"
          value={form.city}
          onChange={(e) => setForm({ ...form, city: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          placeholder="Postal Code"
          value={form.postal_code}
          onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
          className="border p-2 rounded"
        />

        <button
          onClick={placeOrder}
          className="bg-green-600 text-white py-2 rounded"
        >
          Place Order (COD)
        </button>

        {msg && (
          <div
            className={`text-sm mt-2 ${
              msg.toLowerCase().includes("fail")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {msg}
          </div>
        )}
      </div>
    </div>
  );
}
