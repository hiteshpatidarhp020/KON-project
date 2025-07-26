import React, { useEffect, useState } from 'react';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    product_name: '',
    quantity: '',
    customer_name: '',
  });
  const [editId, setEditId] = useState(null);

  const fetchOrders = () => {
    fetch('http://localhost:3001/orders')
      .then(res => res.json())
      .then(data => setOrders(data))
      .catch(err => console.error('Fetch error:', err));
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = () => {
    const url = editId
      ? `http://localhost:3001/orders/${editId}`
      : 'http://localhost:3001/orders';

    const method = editId ? 'PUT' : 'POST';

    fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(() => {
        setFormData({ product_name: '', quantity: '', customer_name: '' });
        setEditId(null);
        fetchOrders();
      })
      .catch(err => console.error('Submit error:', err));
  };

  const handleEdit = (order) => {
    setFormData({
      product_name: order.product_name,
      quantity: order.quantity,
      customer_name: order.customer_name,
    });
    setEditId(order.id);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this order?')) return;

    fetch(`http://localhost:3001/orders/${id}`, {
      method: 'DELETE'
    })
      .then(() => fetchOrders())
      .catch(err => console.error('Delete error:', err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Orders</h2>

      <div style={{ marginBottom: 20 }}>
        <input
          name="product_name"
          placeholder="Product"
          value={formData.product_name}
          onChange={handleChange}
        />
        <input
          name="quantity"
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={handleChange}
        />
        <input
          name="customer_name"
          placeholder="Customer"
          value={formData.customer_name}
          onChange={handleChange}
        />
        <button onClick={handleSubmit}>{editId ? 'Update' : 'Add'} Order</button>
      </div>

      <ul>
        {orders.map(order => (
          <li key={order.id}>
            {order.product_name} × {order.quantity} for {order.customer_name}
            <button onClick={() => handleEdit(order)} style={{ marginLeft: 10 }}>✏️</button>
            <button onClick={() => handleDelete(order.id)} style={{ marginLeft: 5 }}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Orders;
