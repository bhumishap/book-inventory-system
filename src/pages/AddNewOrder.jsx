// src/pages/AddOrder.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddOrder = () => {
  const [book, setBook] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState('Pending');
  const [error, setError] = useState(''); // State for error message
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const order = { book, quantity, status };

    try {
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (response.ok) {
        navigate('/order-management'); // Redirect to the order management page after successful addition
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error adding order'); // Set error message from response
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error, please try again later.');
    }
  };

  return (
    <div>
      <h2>Add New Order</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
      <form onSubmit={handleSubmit}>
        <label>
          Book:
          <input
            type="text"
            value={book}
            onChange={(e) => setBook(e.target.value)}
            required
          />
        </label>
        <label>
          Quantity:
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            min="1"
            required
          />
        </label>
        <label>
          Status:
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </label>
        <button type="submit">Add Order</button>
      </form>
    </div>
  );
};

export default AddOrder;
