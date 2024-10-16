import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './CustomerPage.css'; // Import your CSS for styling

const CustomerPage = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/customers');
        setCustomers(response.data);
      } catch (error) {
        console.error('Error fetching customers:', error);
      }
    };

    fetchCustomers();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        await axios.delete(`http://localhost:5000/api/customers/${id}`);
        setCustomers(customers.filter(customer => customer.id !== id));
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  };

  return (
    <div className="customer-page-container">
      <h2>Customers</h2>
      <div className="button-container">
        <Link to="/customers/add" className="add-customer-button">Add New Customer</Link>
        <Link to="/home" className="home-button">Home</Link> {/* Home button */}
      </div>
      <div className="customers-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Registration Date</th>
              <th>Last Purchase Date</th>
              <th>Notes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.registrationDate}</td>
                <td>{customer.lastPurchaseDate}</td>
                <td>{customer.notes}</td>
                <td>
                  <Link to={`/customers/edit/${customer.id}`} className="edit-button">
                    Edit
                  </Link>
                  <button onClick={() => handleDelete(customer.id)} className="delete-button">
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
};

export default CustomerPage;
