import React from 'react';
import { Link } from 'react-router-dom'; 
import './Home.css';
import homepageImage from '../assets/homepage.jpeg'; // Ensure this path is correct

const Home = () => {
  return (
    <div className="home-container">
      <div className="image-section">
        <img src={homepageImage} alt="Books" className="side-image" />
      </div>
      <div className="text-section">
        <header className="header">
          <h1 className="title">Welcome to BooksMuse</h1>
          <p className="subtitle">Manage your inventory with ease</p>
          <p className="description">Stay organized with our simple and efficient system tailored for your bookstore needs.</p>
        </header>

        <div className="button-container">
          <Link to="/books-inventory">
            <button className="nav-button">Books Inventory</button>
          </Link>
          <Link to="/order-management">
            <button className="nav-button">Order Management</button>
          </Link>
          <Link to="/customers">
            <button className="nav-button">Customers</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
