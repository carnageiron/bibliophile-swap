const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'bibliophile-swap-secret'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(express.json());

// File paths
const usersFilePath = path.join(__dirname, 'users.json');
const booksFilePath = path.join(__dirname, 'books.json');

// Helper functions
const readData = (filePath) => {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  } catch {
    return [];
  }
};

const writeData = (filePath, data) => {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
};

// Auth routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const users = readData(usersFilePath);

    // Check if user already exists
    if (users.some(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const userId = `user${users.length + 1}`;
    const newUser = {
      id: userId,
      name,
      email,
      password: hashedPassword,
      avatar: `/placeholder.svg`,
      bio: '',
      location: '',
      joined: new Date().toISOString(),
      credits: 100,
      booksOffered: 0,
      booksReceived: 0,
      rating: 5
    };

    users.push(newUser);
    writeData(usersFilePath, users);

    // Create token
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });

    const { password: _, ...userData } = newUser;
    res.status(201).json({ user: userData, token });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const users = readData(usersFilePath);

    const user = users.find(user => user.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });
    const { password: _, ...userData } = user;

    res.json({ user: userData, token });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Auth middleware
const authMiddleware = (req, res, next) => {
  try {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Book routes
app.get('/api/books', (req, res) => {
  const books = readData(booksFilePath);
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const books = readData(booksFilePath);
  const book = books.find(book => book.id === req.params.id);
  if (!book) return res.status(404).json({ message: 'Book not found' });
  res.json(book);
});

// Protected route
app.get('/api/profile', authMiddleware, (req, res) => {
  const users = readData(usersFilePath);
  const user = users.find(user => user.id === req.user.id);
  if (!user) return res.status(404).json({ message: 'User not found' });

  const { password, ...userData } = user;
  res.json(userData);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
