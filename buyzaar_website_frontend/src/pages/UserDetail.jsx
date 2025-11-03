import React, { useState, useEffect } from "react";
import axios from "axios";

export default function UserDetail() {
  const [user, setUser] = useState({ name: "", email: "", phone: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return (window.location = "/signup");
    const decoded = JSON.parse(atob(token.split(".")[1]));
    setUser({ name: decoded.name, email: decoded.email });
  }, []);

  async function save() {
    alert("Update profile feature coming soon.");
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">User Details</h2>
      <input value={user.name} readOnly className="border p-2 rounded w-full mb-3" />
      <input value={user.email} readOnly className="border p-2 rounded w-full mb-3" />
      <input value={user.phone} readOnly placeholder="Phone" className="border p-2 rounded w-full mb-3" />
      <button onClick={save} className="bg-blue-600 text-white px-4 py-2 rounded w-full">
        Save Changes
      </button>
    </div>
  );
}
