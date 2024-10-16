import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './AddEditCustomer.css'; // Ensure to import your CSS file

const AddEditCustomer = () => {
  const { id } = useParams(); // Get the id from URL params if it exists
  const navigate = useNavigate();

  const [customer, setCustomer] = useState({
    id: '', // Customer ID
    name: '',
    email: '',
    phone: '', // New field for phone
    registrationDate: '',
    lastPurchaseDate: '',
    notes: ''
  });

  useEffect(() => {
    if (id) {
      // Fetch existing customer data for editing
      const fetchCustomer = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/customers/${id}`);
          setCustomer(response.data);
        } catch (error) {
          console.error('Error fetching customer:', error);
        }
      };
      fetchCustomer();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prevCustomer) => ({
      ...prevCustomer,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Submitting form with data:', customer); // Debug log to see form data
    try {
      if (id) {
        // Update existing customer
        await axios.put(`http://localhost:5000/api/customers/${id}`, customer);
      } else {
        // Add new customer, ID will be generated on the server
        await axios.post('http://localhost:5000/api/customers', customer);
      }
      navigate('/customers'); // Redirect back to CustomerPage
    } catch (error) {
      alert('Failed to save customer. Please try again.'); // Error handling
      console.error('Error saving customer:', error);
    }
  };

  return (
    <div className="add-edit-customer-container">
      <h1 className="form-title">{id ? 'Edit Customer' : 'Add New Customer'}</h1>
      <form className="customer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name:</label>
          <input 
            type="text" 
            name="name" 
            value={customer.name} 
            onChange={handleChange} 
            placeholder="Enter customer's name" 
            required 
          />
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input 
            type="email" 
            name="email" 
            value={customer.email} 
            onChange={handleChange} 
            placeholder="Enter customer's email" 
            required 
          />
        </div>
        <div className="form-group">
          <label>Phone:</label> {/* New field for phone */}
          <input 
            type="text" 
            name="phone" 
            value={customer.phone} 
            onChange={handleChange} 
            placeholder="Enter customer's phone number" 
            required 
          />
        </div>
        <div className="form-group">
          <label>Registration Date:</label>
          <input 
            type="date" 
            name="registrationDate" 
            value={customer.registrationDate} 
            onChange={handleChange} 
            required 
          />
        </div>
        <div className="form-group">
          <label>Last Purchase Date:</label>
          <input 
            type="date" 
            name="lastPurchaseDate" 
            value={customer.lastPurchaseDate} 
            onChange={handleChange} 
          />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <textarea 
            name="notes" 
            value={customer.notes} 
            onChange={handleChange} 
            placeholder="Enter any notes for the customer" 
          />
        </div>
        <button type="submit" className="submit-button">{id ? 'Update' : 'Add'}</button>
      </form>
    </div>
  );
};

export default AddEditCustomer;
