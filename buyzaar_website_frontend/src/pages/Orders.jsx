import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBox, FaTimesCircle, FaCheckCircle, FaClock } from "react-icons/fa";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location = "/signup");
    axios
      .get("http://localhost:5001/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setOrders(res.data.orders || []))
      .catch(() => setOrders([]));
  }, []);

  async function cancel(id) {
    const token = localStorage.getItem("token");
    try {
      const res = await axios.post(
        `http://localhost:5001/api/orders/${id}/cancel`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(res.data.message);
      window.location.reload();
    } catch (err) {
      alert(err.response?.data?.error || "Cannot cancel order");
    }
  }

  // Styling object
  const styles = {
    container: {
      padding: "30px 20px",
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f8fafc 0%, #eef2f3 100%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    heading: {
      fontSize: "26px",
      fontWeight: "700",
      color: "#222",
      marginBottom: "20px",
      textAlign: "center",
      borderBottom: "3px solid #007bff",
      paddingBottom: "8px",
      width: "fit-content",
    },
    ordersContainer: {
      width: "100%",
      maxWidth: "800px",
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    card: {
      background: "white",
      borderRadius: "14px",
      boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
      padding: "20px",
      display: "flex",
      flexDirection: "column",
      transition: "all 0.3s ease",
    },
    cardHover: {
      transform: "scale(1.02)",
      boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    },
    topRow: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    orderId: {
      fontWeight: "600",
      fontSize: "16px",
      color: "#333",
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    status: {
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "20px",
      fontSize: "13px",
      fontWeight: "600",
      textTransform: "capitalize",
    },
    info: {
      color: "#555",
      fontSize: "14px",
      marginBottom: "6px",
    },
    button: {
      backgroundColor: "#dc3545",
      color: "white",
      border: "none",
      padding: "8px 14px",
      borderRadius: "6px",
      fontSize: "14px",
      cursor: "pointer",
      alignSelf: "flex-end",
      marginTop: "10px",
      transition: "0.3s",
    },
  };

  const getStatusStyle = (status) => {
    const base = { ...styles.status };
    if (status === "delivered")
      return { ...base, backgroundColor: "#d4edda", color: "#155724" };
    if (status === "pending")
      return { ...base, backgroundColor: "#fff3cd", color: "#856404" };
    if (status === "cancelled")
      return { ...base, backgroundColor: "#f8d7da", color: "#721c24" };
    if (status === "packaging")
      return { ...base, backgroundColor: "#cce5ff", color: "#004085" };
    return base;
  };

  const getStatusIcon = (status) => {
    if (status === "delivered") return <FaCheckCircle color="#28a745" />;
    if (status === "pending") return <FaClock color="#ffc107" />;
    if (status === "cancelled") return <FaTimesCircle color="#dc3545" />;
    return <FaBox color="#007bff" />;
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📦 My Orders</h2>

      {orders.length === 0 && (
        <p style={{ color: "#555", fontSize: "16px", marginTop: "30px" }}>
          No orders found yet 😕
        </p>
      )}

      <div style={styles.ordersContainer}>
        {orders.map((o) => (
          <div
            key={o.id}
            style={styles.card}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.cardHover)}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "";
              e.currentTarget.style.boxShadow = styles.card.boxShadow;
            }}
          >
            <div style={styles.topRow}>
              <div style={styles.orderId}>
                {getStatusIcon(o.order_status)}
                Order #{o.id}
              </div>
              <span style={getStatusStyle(o.order_status)}>
                {o.order_status}
              </span>
            </div>

            <div>
              <p style={styles.info}>
                <strong>Total:</strong> PKR {o.total_amount}
              </p>
              <p style={styles.info}>
                <strong>Date:</strong>{" "}
                {new Date(o.created_at).toLocaleDateString("en-GB")}
              </p>
            </div>

            {o.order_status == "pending" && o.order_status == "cancelled" ? (
              <button
                style={styles.button}
                onMouseOver={(e) =>
                  (e.target.style.backgroundColor = "#b02a37")
                }
                onMouseOut={(e) =>
                  (e.target.style.backgroundColor = "#dc3545")
                }
                
                onClick={() => cancel(o.id)}
              >
                Cancel Order
              </button>
            ):""}
          </div>
        ))}
      </div>
    </div>
  );
}
