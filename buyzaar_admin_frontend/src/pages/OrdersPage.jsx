import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaEye, FaTrash, FaBoxOpen } from "react-icons/fa";

const API = "http://127.0.0.1:5000/api";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API}/orders`);
      setOrders(res.data);
      localStorage.setItem("order", res.data.length)
    } catch (err) {
      alert("Error loading orders: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await axios.delete(`${API}/orders/${id}`);
      fetchOrders();
    } catch (err) {
      alert("❌ Error deleting order: " + err.message);
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "packaging":
        return "bg-blue-100 text-blue-700";
      case "on_way":
        return "bg-indigo-100 text-indigo-700";
      case "delivered":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 text-lg py-10">
        Loading Orders...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6">📦 Orders Management</h2>

      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">#</th>
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Payment</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4">Date</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center text-gray-500 py-6 italic"
                >
                  No orders found.
                </td>
              </tr>
            ) : (
              orders.map((o) => (
                <tr
                  key={o.id}
                  className="border-t hover:bg-gray-50 transition text-center"
                >
                  <td className="py-3 px-4 font-medium text-gray-700 text-left">
                    #{o.id}
                  </td>
                  <td className="py-3 px-4 text-left">
                    <p className="font-semibold text-gray-800">
                      {o.user_name || "Unknown User"}
                    </p>
                    <p className="text-xs text-gray-500">{o.user_email}</p>
                  </td>
                  <td className="py-3 px-4 font-semibold text-gray-800">
                    ${o.total_amount}
                  </td>
                  <td className="py-3 px-4 text-gray-600">{o.payment_method}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 text-xs rounded-full font-medium ${statusColor(
                        o.order_status
                      )}`}
                    >
                      {o.order_status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">
                    {new Date(o.order_date).toLocaleString()}
                  </td>
                  <td className="py-3 px-4 flex justify-center gap-3">
                    <button
                      onClick={() => navigate(`/orders/${o.id}`)}
                      className="text-blue-600 hover:text-blue-800"
                      title="View Details"
                    >
                      <FaEye />
                    </button>
                    <button
                      onClick={() => handleDelete(o.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete Order"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
