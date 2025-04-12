const express = require('express');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Debug middleware to log all incoming requests
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', bookRoutes);

// Test route to verify server is running
app.get('/api/test', (req, res) => {
  res.json({ message: 'API is working!' });
});


  // Basic route for development
  app.get('/', (req, res) => {
    res.json({ message: 'Bibliophile Swap API' });
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ message: 'Server error occurred', error: err.message });
});

// Start server automatically when file is executed
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
