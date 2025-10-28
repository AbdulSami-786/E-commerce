import React, { useEffect, useState } from "react";
import axios from "axios";

const API = "http://127.0.0.1:5000/api";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    slug: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    category_id: "",
    images: "",
    is_active: 1,
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API}/products`);
      setProducts(res.data);
      localStorage.setItem("product", res.data.length)
    } catch (err) {
      alert("Error loading products: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await axios.put(`${API}/products/${formData.id}`, {
          ...formData,
          images: formData.images ? formData.images.split(",") : [],
        });
        alert("✅ Product updated");
      } else {
        await axios.post(`${API}/products`, {
          ...formData,
          images: formData.images ? formData.images.split(",") : [],
        });
        alert("✅ Product added");
      }
      setFormData({
        id: null,
        name: "",
        slug: "",
        description: "",
        price: "",
        stock: "",
        sku: "",
        category_id: "",
        images: "",
        is_active: 1,
      });
      fetchProducts();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const handleEdit = (p) => {
    setFormData({
      id: p.id,
      name: p.name || "",
      slug: p.slug || "",
      description: p.description || "",
      price: p.price || "",
      stock: p.stock || "",
      sku: p.sku || "",
      category_id: p.category_id || "",
      images: (() => {
        try {
          const imgs = p.images ? JSON.parse(p.images) : [];
          return Array.isArray(imgs) ? imgs.join(",") : "";
        } catch {
          return "";
        }
      })(),
      is_active: p.is_active ? 1 : 0,
    });
    window.scrollTo(0, 0);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await axios.delete(`${API}/products/${id}`);
    fetchProducts();
  };

  if (loading) return <h3 className="text-center text-gray-500">Loading...</h3>;

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">🛍️ Products</h2>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <h3 className="col-span-full text-lg font-semibold text-gray-700">
          {formData.id ? "Edit Product" : "Add Product"}
        </h3>
        {["name", "slug", "price", "stock", "sku", "category_id"].map((f) => (
          <input
            key={f}
            name={f}
            placeholder={f.charAt(0).toUpperCase() + f.slice(1)}
            value={formData[f]}
            onChange={handleChange}
            required={["name", "slug", "price", "stock"].includes(f)}
            className="border p-2 rounded"
          />
        ))}
        <input
          name="images"
          placeholder="Images (comma separated URLs)"
          value={formData.images}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <select
          name="is_active"
          value={formData.is_active}
          onChange={handleChange}
          className="border p-2 rounded"
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          className="border p-2 rounded col-span-full"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 rounded col-span-full"
        >
          {formData.id ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Table */}
      <div className="overflow-x-auto bg-white shadow rounded-xl">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Active</th>
              <th>Images</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p.id}
                className="border-t hover:bg-gray-50 transition text-center"
              >
                <td className="text-left p-3">{p.name}</td>
                <td>{p.category_name || p.category_id}</td>
                <td>${p.price}</td>
                <td>{p.stock}</td>
                <td>{p.is_active ? "✅" : "❌"}</td>
                <td>
                  {(() => {
                    try {
                      const imgs = p.images ? JSON.parse(p.images) : [];
                      return Array.isArray(imgs)
                        ? imgs.slice(0, 2).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt=""
                              className="w-10 h-10 inline-block m-1 rounded"
                            />
                          ))
                        : "—";
                    } catch {
                      return "—";
                    }
                  })()}
                </td>
                <td>
                  <button
                    onClick={() => handleEdit(p)}
                    className="text-blue-600 hover:underline mr-2"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
