import React, { useState } from "react";
import axios from "axios";

export default function Contact() {
  const [message, setMessage] = useState("");
  const [msg, setMsg] = useState("");

  async function send() {
    const token = localStorage.getItem("token");
    if (!token) return (window.location = "/signup");
    try {
      const res = await axios.post(
        "http://localhost:5001/api/contact",
        { message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Message sent successfully!");
      setMessage("");
    } catch (err) {
      setMsg(err.response?.data?.error || "Error sending message");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Contact Us</h2>
      <textarea
        className="border p-2 rounded w-full"
        rows="5"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Write your message..."
      />
      <button
        onClick={send}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Send
      </button>
      {msg && <p className="mt-2 text-sm text-green-600">{msg}</p>}
    </div>
  );
}
