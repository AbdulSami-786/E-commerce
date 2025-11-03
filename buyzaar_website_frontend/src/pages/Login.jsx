import React, { useState } from "react";
import axios from "axios";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [msg, setMsg] = useState("");

  async function login() {
    try {
      const res = await axios.post("http://localhost:5001/api/auth/login", form);
      localStorage.setItem("token", res.data.token);
      setMsg("Login success!");
      window.location = "/";
    } catch (err) {
      setMsg(err.response?.data?.error || "Login failed");
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <div className="grid gap-3">
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="border p-2 rounded" />
        <input type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="border p-2 rounded" />
        <button onClick={login} className="bg-blue-600 text-white py-2 rounded">Login</button>
        {msg && <div className="text-sm text-center text-red-500">{msg}</div>}
      </div>
    </div>
  );
}
