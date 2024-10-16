import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import BooksInventory from './pages/BooksInventory';
import OrderManagement from './pages/OrderManagement';
import CustomerPage from './pages/CustomerPage';
import AddNewOrder from './pages/AddNewOrder';
import AddEditCustomer from './pages/AddEditCustomer';
import AddEditBook from './pages/AddEditBook';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import React, { useState, useEffect } from 'react';

function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true); // Manage loading state

  // Fetch initial book data from the API
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/books');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setBooks(data);
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setLoading(false); // Set loading to false after fetch is done
      }
    };

    fetchBooks();
  }, []);

  // Render loading message while fetching
  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} /> {/* Login Page */}
        <Route path="/sign-up" element={<SignUpPage />} /> {/* Sign Up Page */}
        <Route path="/home" element={<Home />} /> {/* Home Page */}
        
        {/* Books Inventory Page */}
        <Route 
          path="/books-inventory" 
          element={<BooksInventory books={books} setBooks={setBooks} />} 
        /> 

        {/* Order Management Page */}
        <Route path="/order-management" element={<OrderManagement />} />

        {/* Customer List Page */}
        <Route path="/customers" element={<CustomerPage />} />

        {/* Add/Edit Customer */}
        <Route path="/customers/add" element={<AddEditCustomer setBooks={setBooks} />} />
        <Route path="/customers/edit/:id" element={<AddEditCustomer setBooks={setBooks} />} />

        {/* Add New Order */}
        <Route path="/add-order" element={<AddNewOrder />} />

        {/* Add/Edit Book Page (uses optional `id` param for edit) */}
        <Route 
          path="/add-edit-book/:id?" 
          element={<AddEditBook books={books} setBooks={setBooks} />} 
        /> 
      </Routes>
    </Router>
  );
}

export default App;
