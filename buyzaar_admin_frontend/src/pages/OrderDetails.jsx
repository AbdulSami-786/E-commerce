import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft, FaBoxOpen, FaCheckCircle } from "react-icons/fa";

const API = "http://127.0.0.1:5000/api";

export default function OrderDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${API}/orders/${id}`);
      setOrder(res.data.order);
      setItems(res.data.items);
      setStatus(res.data.order.order_status);
    } catch (err) {
      alert("Error loading order details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const updateStatus = async () => {
    try {
      await axios.put(`${API}/orders/${id}`, { order_status: status });
      alert("✅ Order status updated");
      fetchOrder();
    } catch (err) {
      alert("❌ Error updating status: " + err.message);
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
      <div className="text-center py-10 text-gray-500 text-lg">
        Loading Order Details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-10 text-gray-500 text-lg">
        ❌ Order not found
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
        >
          <FaArrowLeft /> Back
        </button>
        <h2 className="text-2xl font-semibold text-gray-800">
          <FaBoxOpen className="inline mr-2 text-blue-600" /> Order #{order.id}
        </h2>
      </div>

      {/* Order Summary */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              🧾 Order Information
            </h3>
            <p>
              <strong>Status: </strong>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor(
                  order.order_status
                )}`}
              >
                {order.order_status}
              </span>
            </p>
            <p>
              <strong>Payment:</strong> {order.payment_method || "—"}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(order.order_date).toLocaleString()}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              <span className="text-blue-600 font-semibold">
                ${order.total_amount}
              </span>
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-2">
              👤 Customer Details
            </h3>
            <p>
              <strong>Name:</strong> {order.user_name || "—"}
            </p>
            <p>
              <strong>Email:</strong> {order.user_email || "—"}
            </p>
            <p>
              <strong>User ID:</strong> {order.user_id}
            </p>
          </div>
        </div>
      </div>

      {/* Update Status */}
      <div className="bg-white shadow rounded-xl p-6 mb-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          ⚙️ Update Order Status
        </h3>
        <div className="flex items-center gap-4">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border rounded-lg p-2 w-52"
          >
            <option value="pending">Pending</option>
            <option value="packaging">Packaging</option>
            <option value="on_way">On Way</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={updateStatus}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaCheckCircle /> Update
          </button>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white shadow rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          📦 Ordered Items
        </h3>
        {items.length === 0 ? (
          <p className="text-gray-500 italic">No items in this order.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 text-gray-600">
                <tr>
                  <th className="p-3 text-left">Product</th>
                  <th className="p-3">Quantity</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {items.map((it) => (
                  <tr
                    key={it.id}
                    className="border-t hover:bg-gray-50 transition text-center"
                  >
                    <td className="p-3 text-left font-medium text-gray-800">
                      {it.product_name || `Product #${it.product_id}`}
                    </td>
                    <td className="p-3">{it.quantity}</td>
                    <td className="p-3">${it.price}</td>
                    <td className="p-3 text-blue-600 font-semibold">
                      ${it.subtotal}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
