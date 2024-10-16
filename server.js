// Import necessary packages
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const PORT = 5000;

// Create an Express app
const app = express();
app.use(cors());
app.use(bodyParser.json()); // Middleware to parse JSON request bodies

// Connect to SQLite database
const db = new sqlite3.Database('./inventory.db', (err) => {
  if (err) {
    console.error('Could not connect to the SQLite database:', err.message);
  } else {
    console.log('Connected to the SQLite database.');
  }
});

// Define API route to fetch all books
app.get('/api/books', (req, res) => {
  db.all('SELECT * FROM books', [], (err, rows) => {
    if (err) {
      console.error('Error fetching books:', err.message);
      return res.status(500).json({ message: 'Error fetching books' });
    }
    res.json(rows);
  });
});

// Define API route to add a new book
app.post('/api/books', (req, res) => {
  const { title, author, quantity, retailPrice, sellingPrice, genre } = req.body;

  // Validate required fields
  if (!title || !author || quantity < 0 || retailPrice < 0 || sellingPrice < 0 || !genre) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const sql = 'INSERT INTO books (title, author, quantity, retailPrice, sellingPrice, genre) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [title, author, quantity, retailPrice, sellingPrice, genre], function(err) {
    if (err) {
      console.error('Error adding book:', err.message);
      return res.status(500).json({ message: 'Error adding book' });
    }
    res.status(201).json({ id: this.lastID, title, author, quantity, retailPrice, sellingPrice, genre });
  });
});

// Define API route to update an existing book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, quantity, retailPrice, sellingPrice, genre } = req.body;

  // Validate required fields
  if (!title || !author || quantity < 0 || retailPrice < 0 || sellingPrice < 0 || !genre) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const sql = 'UPDATE books SET title = ?, author = ?, quantity = ?, retailPrice = ?, sellingPrice = ?, genre = ? WHERE id = ?';
  db.run(sql, [title, author, quantity, retailPrice, sellingPrice, genre, id], function(err) {
    if (err) {
      console.error('Error updating book:', err.message);
      return res.status(500).json({ message: 'Error updating book' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ id, title, author, quantity, retailPrice, sellingPrice, genre });
  });
});

// Define API route to partially update an existing book
app.patch('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, quantity, retailPrice, sellingPrice, genre } = req.body;

  // Prepare an array for the update values
  const updates = [];
  const updateFields = [];

  if (title) {
    updates.push(title);
    updateFields.push('title = ?');
  }
  if (author) {
    updates.push(author);
    updateFields.push('author = ?');
  }
  if (quantity !== undefined) {
    updates.push(quantity);
    updateFields.push('quantity = ?');
  }
  if (retailPrice !== undefined) {
    updates.push(retailPrice);
    updateFields.push('retailPrice = ?');
  }
  if (sellingPrice !== undefined) {
    updates.push(sellingPrice);
    updateFields.push('sellingPrice = ?');
  }
  if (genre) {
    updates.push(genre);
    updateFields.push('genre = ?');
  }

  // If no fields to update, return 400
  if (updates.length === 0) {
    return res.status(400).json({ message: 'No fields to update' });
  }

  updates.push(id);
  const sql = `UPDATE books SET ${updateFields.join(', ')} WHERE id = ?`;

  db.run(sql, updates, function(err) {
    if (err) {
      console.error('Error updating book:', err.message);
      return res.status(500).json({ message: 'Error updating book' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json({ id, title, author, quantity, retailPrice, sellingPrice, genre });
  });
});

// Define API route to delete a book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM books WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      console.error('Error deleting book:', err.message);
      return res.status(500).json({ message: 'Error deleting book' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.status(204).send(); // No content response
  });
});

// Define API route to fetch all orders
app.get('/api/orders', (req, res) => {
  db.all('SELECT * FROM orders', [], (err, rows) => {
    if (err) {
      console.error('Error fetching orders:', err.message);
      return res.status(500).json({ message: 'Error fetching orders' });
    }
    res.json(rows);
  });
});

// Define API route to add a new order
app.post('/api/orders', (req, res) => {
  const { book, quantity, status } = req.body;

  // Validate required fields
  if (!book || quantity < 0 || !status) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const sql = 'INSERT INTO orders (book, quantity, status) VALUES (?, ?, ?)';
  db.run(sql, [book, quantity, status], function(err) {
    if (err) {
      console.error('Error adding order:', err.message);
      return res.status(500).json({ message: 'Error adding order' });
    }
    res.status(201).json({ id: this.lastID, book, quantity, status });
  });
});

// Define API route to partially update an existing order
app.patch('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const sql = 'UPDATE orders SET status = ? WHERE id = ?';
  db.run(sql, [status, id], function(err) {
    if (err) {
      console.error('Error updating order:', err.message);
      return res.status(500).json({ message: 'Error updating order' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ id, status });
  });
});

// Define API route to update an existing order
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { book, quantity, status } = req.body;

  // Validate required fields
  if (!book || quantity < 0 || !status) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const sql = 'UPDATE orders SET book = ?, quantity = ?, status = ? WHERE id = ?';
  db.run(sql, [book, quantity, status, id], function(err) {
    if (err) {
      console.error('Error updating order:', err.message);
      return res.status(500).json({ message: 'Error updating order' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json({ id, book, quantity, status });
  });
});

// Define API route to delete an order
app.delete('/api/orders/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM orders WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      console.error('Error deleting order:', err.message);
      return res.status(500).json({ message: 'Error deleting order' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(204).send(); // No content response
  });
});

// Define API route to fetch all customers
app.get('/api/customers', (req, res) => {
  db.all('SELECT * FROM customers', [], (err, rows) => {
    if (err) {
      console.error('Error fetching customers:', err.message);
      return res.status(500).json({ message: 'Error fetching customers' });
    }
    res.json(rows);
  });
});

// Define API route to add a new customer
app.post('/api/customers', (req, res) => {
  const { name, email, phone, registrationDate, lastPurchaseDate, notes } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !registrationDate || !lastPurchaseDate) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const sql = 'INSERT INTO customers (name, email, phone, registrationDate, lastPurchaseDate, notes) VALUES (?, ?, ?, ?, ?, ?)';
  db.run(sql, [name, email, phone, registrationDate, lastPurchaseDate, notes], function(err) {
    if (err) {
      console.error('Error adding customer:', err.message);
      return res.status(500).json({ message: 'Error adding customer' });
    }
    res.status(201).json({ id: this.lastID, name, email, phone, registrationDate, lastPurchaseDate, notes });
  });
});

// Define API route to update an existing customer
app.put('/api/customers/:id', (req, res) => {
  const { id } = req.params;
  const { name, email, phone, registrationDate, lastPurchaseDate, notes } = req.body;

  // Validate required fields
  if (!name || !email || !phone || !registrationDate || !lastPurchaseDate) {
    return res.status(400).json({ message: 'Invalid input data' });
  }

  const sql = 'UPDATE customers SET name = ?, email = ?, phone = ?, registrationDate = ?, lastPurchaseDate = ?, notes = ? WHERE id = ?';
  db.run(sql, [name, email, phone, registrationDate, lastPurchaseDate, notes, id], function(err) {
    if (err) {
      console.error('Error updating customer:', err.message);
      return res.status(500).json({ message: 'Error updating customer' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.json({ id, name, email, phone, registrationDate, lastPurchaseDate, notes });
  });
});

// Define API route to delete a customer
app.delete('/api/customers/:id', (req, res) => {
  const { id } = req.params;

  const sql = 'DELETE FROM customers WHERE id = ?';
  db.run(sql, id, function(err) {
    if (err) {
      console.error('Error deleting customer:', err.message);
      return res.status(500).json({ message: 'Error deleting customer' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ message: 'Customer not found' });
    }
    res.status(204).send(); // No content response
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
