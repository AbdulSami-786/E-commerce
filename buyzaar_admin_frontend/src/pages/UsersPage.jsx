import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserEdit, FaTrashAlt, FaUsers } from "react-icons/fa";

const API = "http://127.0.0.1:5000/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch users
  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API}/users`);
      setUsers(res.data);
      localStorage.setItem("user", res.data.length)
    } catch (err) {
      alert("Error loading users: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 🔹 Start editing
  const startEdit = (user) => {
    setEditing(user.id);
    setForm({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      password: "",
    });
    window.scrollTo(0, 0);
  };

  // 🔹 Cancel editing
  const cancelEdit = () => {
    setEditing(null);
    setForm({ name: "", email: "", phone: "", password: "" });
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Update user
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API}/users/${editing}`, form);
      alert("✅ User updated successfully");
      cancelEdit();
      fetchUsers();
    } catch (err) {
      alert("❌ Error updating user: " + err.message);
    }
  };

  // 🔹 Delete user
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await axios.delete(`${API}/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("❌ Error deleting user: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        Loading Users...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FaUsers className="text-blue-600" /> Users Management
      </h2>

      {/* ✏️ Edit User Form */}
      {editing && (
        <div className="bg-white shadow rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 text-gray-700 flex items-center gap-2">
            <FaUserEdit className="text-blue-600" /> Edit User #{editing}
          </h3>
          <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-4">
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="border rounded-lg px-3 py-2 focus:outline-blue-500"
              required
            />
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="border rounded-lg px-3 py-2 focus:outline-blue-500"
              required
            />
            <input
              name="phone"
              value={form.phone}
              onChange={handleChange}
              placeholder="Phone"
              className="border rounded-lg px-3 py-2 focus:outline-blue-500"
            />
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="New Password (optional)"
              className="border rounded-lg px-3 py-2 focus:outline-blue-500"
            />

            <div className="flex items-center gap-3 mt-3 md:col-span-2">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 📋 Users Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Phone</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No users found.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-t hover:bg-gray-50 transition text-gray-700"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    #{user.id}
                  </td>
                  <td className="py-3 px-4">{user.name || "—"}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">{user.phone || "—"}</td>
                  <td className="py-3 px-4 text-center flex justify-center gap-3">
                    <button
                      onClick={() => startEdit(user)}
                      className="text-blue-600 hover:text-blue-800"
                      title="Edit User"
                    >
                      <FaUserEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete User"
                    >
                      <FaTrashAlt />
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
