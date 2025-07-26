// ProductList.js
import React, { useEffect, useState } from 'react';

function ProductList() {
  const [products, setProducts] = useState([]);

  const fetchProducts = () => {
    fetch('http://localhost:3001/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>🛒 Product List</h2>
      <ul>
        {products.map(p => (
          <li key={p.id}>
            📦 {p.name} - ₹{p.price}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
