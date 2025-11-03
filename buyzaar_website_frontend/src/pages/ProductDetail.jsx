import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchProduct();
    // eslint-disable-next-line
  }, [id]);

  async function fetchProduct() {
    try {
      const res = await axios.get(`http://localhost:5001/api/products/${id}`);
      setProduct(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function addToCart() {
    const token = localStorage.getItem('token');
    if (!token) return (window.location = '/signup');

    try {
      await axios.post(
        'http://localhost:5001/api/cart/items',
        { product_id: product.id, quantity: qty },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg('Added to cart');
      setTimeout(() => setMsg(''), 2500);
    } catch (err) {
      console.error(err);
      setMsg(err.response?.data?.error || 'Error adding to cart');
    }
  }

  if (!product) return <div>Loading...</div>;

  const images = product.images ? JSON.parse(product.images) : [];

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 bg-white p-4 rounded shadow">
        <img src={images[0] || '/placeholder.png'} alt={product.name} className="w-full h-96 object-cover rounded mb-4" />
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="text-gray-600 mt-2">{product.description || 'No description available.'}</p>
      </div>

      <aside className="bg-white p-4 rounded shadow">
        <div className="text-xl font-semibold mb-2">PKR {product.price}</div>
        <div className="text-sm text-gray-500 mb-4">Stock: {product.stock}</div>

        <div className="flex items-center gap-2 mb-4">
          <label className="text-sm">Qty</label>
          <input type="number" min="1" max={product.stock || 999} value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} className="border p-1 w-20 rounded" />
        </div>

        <button onClick={addToCart} className="w-full bg-blue-600 text-white py-2 rounded mb-2">Add to Cart</button>
        <button onClick={() => { localStorage.getItem('token') ? window.location = '/checkout' : window.location = '/signup'; }} className="w-full border py-2 rounded">Buy Now (COD)</button>

        {msg && <div className="mt-3 text-sm text-green-600">{msg}</div>}
      </aside>
    </div>
  );
}
