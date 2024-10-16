import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa'; // Arrow icon for the back button
import './AddEditBook.css';

const AddEditBook = ({ books, setBooks }) => {
  const { id } = useParams(); // Get book ID from the URL
  const navigate = useNavigate();

  const [bookData, setBookData] = useState({
    title: '',
    author: '',
    quantity: '',
    retailPrice: '',
    sellingPrice: '',
    genre: '',
  });

  useEffect(() => {
    if (id) {
      const bookToEdit = books.find(book => book.id === parseInt(id));
      if (bookToEdit) {
        setBookData({
          title: bookToEdit.title || '',
          author: bookToEdit.author || '',
          quantity: bookToEdit.quantity !== undefined ? bookToEdit.quantity : '',
          retailPrice: bookToEdit.retailPrice || '',
          sellingPrice: bookToEdit.sellingPrice || '',
          genre: bookToEdit.genre || '',
        });
      }
    }
  }, [id, books]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookData(prevState => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        // Edit existing book
        const response = await fetch(`http://localhost:5000/api/books/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });

        if (!response.ok) {
          throw new Error('Failed to update book');
        }

        const updatedBook = await response.json();
        setBooks(prevBooks => prevBooks.map(book => (book.id === parseInt(id) ? updatedBook : book)));
      } else {
        // Add new book
        const response = await fetch('http://localhost:5000/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookData),
        });

        if (!response.ok) {
          throw new Error('Failed to add book');
        }

        const newBook = await response.json();
        setBooks(prevBooks => [...prevBooks, newBook]);
      }

      // Reset form data to initial state
      setBookData({
        title: '',
        author: '',
        quantity: '',
        retailPrice: '',
        sellingPrice: '',
        genre: '',
      });

      // Redirect back to inventory after saving
      navigate('/books-inventory'); 
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleBack = () => {
    navigate('/books-inventory'); // Go back to the books inventory page
  };

  return (
    <div className="add-edit-book-container">
      <button className="back-button" onClick={handleBack}>
        <FaArrowLeft /> {/* Small arrow for back button */}
      </button>
      <h2>{id ? 'Edit Book' : 'Add New Book'}</h2>

      {id && (
        <div className="current-quantity">
          <strong>Current Quantity: </strong>{bookData.quantity}
        </div>
      )}

      <form className="book-form" onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          name="title"
          value={bookData.title}
          onChange={handleInputChange}
          required
        />

        <label>Author</label>
        <input
          type="text"
          name="author"
          value={bookData.author}
          onChange={handleInputChange}
          required
        />

        <label>Quantity</label>
        <input
          type="number"
          name="quantity"
          value={bookData.quantity}
          onChange={handleInputChange}
          required
          min="0"
        />

        <label>Retail Price</label>
        <input
          type="number"
          name="retailPrice"
          value={bookData.retailPrice}
          onChange={handleInputChange}
          required
          step="0.01"
        />

        <label>Selling Price</label>
        <input
          type="number"
          name="sellingPrice"
          value={bookData.sellingPrice}
          onChange={handleInputChange}
          required
          step="0.01"
        />

        <label>Genre</label>
        <input
          type="text"
          name="genre"
          value={bookData.genre}
          onChange={handleInputChange}
          required
        />

        <button type="submit" className="submit-button">
          {id ? 'Save Changes' : 'Add Book'}
        </button>
      </form>
    </div>
  );
};

export default AddEditBook;
