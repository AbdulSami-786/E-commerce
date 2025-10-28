  import React, { useEffect, useState } from "react";
  import axios from "axios";
  
  function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
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
  const [editingId, setEditingId] = useState(null);

  const API = "http://127.0.0.1:5000/api/products";

  // 🧩 Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await axios.get(API);
      setProducts(res.data);
      
      localStorage.setItem("product", res.data.length)
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchProducts();
  }, []);
  
  // 🧱 Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  // ➕ Add or Update product
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await axios.put(`${API}/${editingId}`, {
          ...formData,
          images: formData.images ? formData.images.split(",") : [],
        });
        alert("✅ Product updated successfully");
      } else {
        await axios.post(API, {
          ...formData,
          images: formData.images ? formData.images.split(",") : [],
        });
        alert("✅ Product added successfully");
      }
      setFormData({
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
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert("❌ Error: " + err.message);
    }
  };
  
  // 🗑️ Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;
    try {
      await axios.delete(`${API}/${id}`);
      fetchProducts();
    } catch (err) {
      alert("❌ Error deleting product");
    }
  };
  
  // ✏️ Edit product
  const handleEdit = (product) => {
    setEditingId(product.id);
    setFormData({
      name: product.name || "",
      slug: product.slug || "",
      description: product.description || "",
      price: product.price || "",
      stock: product.stock || "",
      sku: product.sku || "",
      category_id: product.category_id || "",
      images: (() => {
        try {
          const imgs = product.images ? JSON.parse(product.images) : [];
          return Array.isArray(imgs) ? imgs.join(",") : "";
        } catch {
          return "";
        }
      })(),
      is_active: product.is_active || 0,
    });
  };
  
  if (loading) return <h3 style={{ textAlign: "center" }}>Loading...</h3>;
  if (error)
    return (
  <h3 style={{ color: "red", textAlign: "center" }}>Error: {error}</h3>
);

console.log(products);
return (
  <div style={{ padding: "30px", fontFamily: "Arial" }}>
      <h2>🛍️ Buyzaar Admin Panel</h2>
      <p>Manage products below</p>

      {/* Add/Edit Form */}
      <form
        onSubmit={handleSubmit}
        style={{
          background: "#fafafa",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "30px",
          border: "1px solid #ddd",
        }}
      >
        <h3>{editingId ? "✏️ Edit Product" : "➕ Add Product"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} required />
          <input name="slug" placeholder="Slug" value={formData.slug} onChange={handleChange} required />
          <input name="price" placeholder="Price" value={formData.price} onChange={handleChange} required />
          <input name="stock" placeholder="Stock" value={formData.stock} onChange={handleChange} required />
          <input name="sku" placeholder="SKU" value={formData.sku} onChange={handleChange} />
          <input name="category_id" placeholder="Category ID" value={formData.category_id} onChange={handleChange} />
          <input name="images" placeholder='Image URLs (comma separated)' value={formData.images} onChange={handleChange} />
          <select name="is_active" value={formData.is_active} onChange={handleChange}>
            <option value={1}>Active</option>
            <option value={0}>Inactive</option>
          </select>
        </div>

        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          rows="3"
          style={{ width: "100%", marginTop: "10px" }}
        />

        <button
          type="submit"
          style={{
            marginTop: "10px",
            padding: "10px 20px",
            background: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          {editingId ? "Update Product" : "Add Product"}
        </button>
      </form>

      {/* Product Table */}
      <table
        border="1"
        cellPadding="8"
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead style={{ background: "#f0f0f0" }}>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Slug</th>
            <th>Price</th>
            <th>Stock</th>
            <th>SKU</th>
            <th>Images</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.length === 0 ? (
            <tr>
              <td colSpan="9" style={{ textAlign: "center" }}>
                No products found
              </td>
            </tr>
          ) : (
            products.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.slug}</td>
                <td>{p.price}</td>
                <td>{p.stock}</td>
                <td>{p.sku}</td>
                <td>
                  {(() => {
                    try {
                      const imgs = p.images ? JSON.parse(p.images) : [];
                      return Array.isArray(imgs)
                        ? imgs.slice(0, 2).map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="product"
                              style={{
                                width: 40,
                                height: 40,
                                borderRadius: 4,
                                marginRight: 4,
                                objectFit: "cover",
                              }}
                            />
                          ))
                        : "—";
                    } catch {
                      return "—";
                    }
                  })()}
                </td>
                <td>{p.is_active ? "✅" : "❌"}</td>
                <td>
                  <button
                    onClick={() => handleEdit(p)}
                    style={{
                      background: "#ffc107",
                      border: "none",
                      padding: "5px 10px",
                      marginRight: "5px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    style={{
                      background: "#dc3545",
                      border: "none",
                      padding: "5px 10px",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
        p            Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default Products;