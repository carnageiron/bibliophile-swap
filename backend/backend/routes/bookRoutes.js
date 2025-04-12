
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

// Mock books database
const books = [
  {
    id: "1",
    title: "The Great Gatsby",
    author: "F. Scott Fitzgerald",
    cover: "/placeholder.svg",
    isbn: "9780743273565",
    description: "A classic novel about the American Dream and its corruption in the 1920s.",
    pageCount: 180,
    genre: ["Fiction", "Classic"],
    publishedDate: "1925-04-10",
    condition: "Good",
    ownerId: "user1",
    available: true
  },
  {
    id: "2",
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    cover: "/placeholder.svg",
    isbn: "9780061120084",
    description: "A powerful story of racial inequality in the American South through the eyes of a young girl.",
    pageCount: 324,
    genre: ["Fiction", "Classic"],
    publishedDate: "1960-07-11",
    condition: "Very Good",
    ownerId: "user2",
    available: true
  }
];

// @route   GET /api/books
// @desc    Get all books
// @access  Public
router.get('/', (req, res) => {
  res.json(books);
});

// @route   GET /api/books/:id
// @desc    Get book by ID
// @access  Public
router.get('/:id', (req, res) => {
  const book = books.find(book => book.id === req.params.id);
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }
  res.json(book);
});

// @route   POST /api/books

router.post('/', protect, (req, res) => {
  // Implementation for adding a book
  res.status(201).json({ message: 'Book added successfully' });
});

module.exports = router;
