import React from 'react';
import { Link } from 'react-router-dom';

/**
 * props:
 *  - product: object
 *  - className: extra classes
 */
export default function ProductCard({ product, className = '' }) {
  const images = product?.images ? JSON.parse(product.images) : [];
  return (
    <Link to={`/products/${product.id}`} className={`block bg-white p-3 rounded shadow hover:shadow-lg ${className}`}>
      <div className="h-40 w-full mb-3 overflow-hidden rounded">
        <img src={images[0] || '/placeholder.png'} alt={product.name} className="w-full h-full object-cover" />
      </div>
      <div className="font-semibold truncate">{product.name}</div>
      <div className="text-sm text-gray-600">PKR {product.price}</div>
    </Link>
  );
}
