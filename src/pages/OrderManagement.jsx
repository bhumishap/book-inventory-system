import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './OrderManagement.css';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/orders');
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchOrders();
  }, []);

  const handleAddOrder = () => {
    navigate('/add-order'); // Navigate to Add New Order page
  };

  const handleHome = () => {
    navigate('/home'); // Navigate to home page
  };

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${orderId}`, {
        method: 'PATCH', // Use PATCH for partial updates
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update order status');
      }

      // Update local state without fetching again
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Function to determine row class based on status
  const getRowClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'row-pending'; // Ensure these classes exist in your CSS
      case 'Completed':
        return 'row-completed';
      case 'Cancelled':
        return 'row-cancelled';
      default:
        return '';
    }
  };

  return (
    <div className="order-management-container">
      <div className="button-container">
        <button className="home-button" onClick={handleHome}>
          Home
        </button>
      </div>
      <h2>Order Management</h2>
      <div className="orders-table">
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Book</th>
              <th>Quantity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={getRowClass(order.status)}>
                <td>{order.id}</td>
                <td>{order.book}</td>
                <td>{order.quantity}</td>
                <td>
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <button className="add-button" onClick={handleAddOrder}>
        Add New Order
      </button>
    </div>
  );
};

export default OrderManagement;
