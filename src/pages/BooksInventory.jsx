import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome } from 'react-icons/fa'; // Import the home icon
import './BooksInventory.css';

const BooksInventory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState([]);
  const [error, setError] = useState(null); // Added error state
  const navigate = useNavigate();

  // Fetch books from the API when the component mounts
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
        setError('Failed to load books. Please try again later.'); // Set error message
      }
    };

    fetchBooks();
  }, []);

  const handleAddBook = () => {
    navigate('/add-edit-book'); // Navigate to Add/Edit Book page
  };

  const handleEditBook = (bookId) => {
    navigate(`/add-edit-book/${bookId}`); // Navigate to Edit Book page with book ID
  };

  const handleHome = () => {
    navigate('/home'); // Navigate to home page
  };

  // Filter books based on the search term
  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="inventory-container">
      <button className="home-button" onClick={handleHome} aria-label="Go to home">
        <FaHome /> {/* Home icon */}
      </button>
      <h2 className="inventory-title">Books Inventory</h2> {/* Added class for better styling */}

      <input
        type="text"
        className="search-input"
        placeholder="Search books..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        aria-label="Search books"
      />

      {error && <p className="error-message">{error}</p>} {/* Display error message if any */}

      <div className="books-grid">
        {filteredBooks.length > 0 ? (
          filteredBooks.map((book) => (
            <div className="book-card" key={book.id}>
              <h3>{book.title}</h3>
              <p><strong>Author:</strong> {book.author}</p>
              <p><strong>Quantity:</strong> {book.quantity}</p>
              <p><strong>Genre:</strong> {book.genre}</p>
              <p><strong>Retail Price:</strong> Rs.{book.retailPrice.toFixed(2)}</p>
              <p><strong>Selling Price:</strong> Rs.{book.sellingPrice.toFixed(2)}</p>
              <p><strong>Profit:</strong> Rs.{(book.sellingPrice - book.retailPrice).toFixed(2)}</p>
              <button className="edit-button" onClick={() => handleEditBook(book.id)}>
                Edit
              </button>
            </div>
          ))
        ) : (
          <p>No books found that match your search criteria.</p>
        )}
      </div>

      <button className="add-button" onClick={handleAddBook}>
        Add New Book
      </button>
    </div>
  );
};

export default BooksInventory;
