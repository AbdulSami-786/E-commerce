import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaTrashAlt, FaPlusCircle, FaTags } from "react-icons/fa";

const API = "http://127.0.0.1:5000/api";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API}/categories`);
      setCategories(res.data);
      localStorage.setItem("catagory", res.data.length)
    } catch (err) {
      alert("Error loading categories: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 🔹 Handle input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 Add category
  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/categories`, form);
      setForm({ name: "", slug: "", description: "" });
      fetchCategories();
    } catch (err) {
      alert("Error adding category: " + err.message);
    }
  };

  // 🔹 Delete category
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this category?")) return;
    try {
      await axios.delete(`${API}/categories/${id}`);
      fetchCategories();
    } catch (err) {
      alert("Error deleting category: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="text-center text-gray-500 py-10 text-lg">
        Loading Categories...
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FaTags className="text-blue-600" /> Categories Management
      </h2>

      {/* ➕ Add Category Form */}
      <div className="bg-white shadow rounded-xl p-6 mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-700">
          <FaPlusCircle className="text-green-600" /> Add New Category
        </h3>
        <form
          onSubmit={handleAdd}
          className="grid md:grid-cols-3 gap-4 items-center"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Category Name"
            className="border rounded-lg px-3 py-2 focus:outline-blue-500"
            required
          />
          <input
            name="slug"
            value={form.slug}
            onChange={handleChange}
            placeholder="Slug"
            className="border rounded-lg px-3 py-2 focus:outline-blue-500"
            required
          />
          <input
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Description (optional)"
            className="border rounded-lg px-3 py-2 focus:outline-blue-500 md:col-span-3"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium md:col-span-3 w-fit"
          >
            Add Category
          </button>
        </form>
      </div>

      {/* 📋 Category Table */}
      <div className="bg-white shadow rounded-xl overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Slug</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="text-center py-6 text-gray-500 italic"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t hover:bg-gray-50 transition text-gray-700"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">
                    #{cat.id}
                  </td>
                  <td className="py-3 px-4">{cat.name}</td>
                  <td className="py-3 px-4 text-gray-600">{cat.slug}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {cat.description || "—"}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDelete(cat.id)}
                      className="text-red-600 hover:text-red-800"
                      title="Delete"
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
