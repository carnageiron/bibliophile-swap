
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// In-memory database for users (in a real app, this would be a database)
let users = [];

const JWT_SECRET = 'bibliophile-swap-secret'; // In production, use environment variable
const JWT_EXPIRES_IN = '1d';

// Register new user
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    console.log('Register attempt for:', email);
    
    // Check required fields
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if user already exists
    if (users.some(user => user.email === email)) {
      console.log('User already exists:', email);
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
    
    // Create token
    const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    // Return user data (without password) and token
    const { password: _, ...userData } = newUser;
    
    console.log('User registered successfully:', userData);
    
    res.status(201).json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error during registration', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    console.log('Login attempt for:', email);
    
    // Find user
    const user = users.find(user => user.email === email);
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Password does not match for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Create token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
    
    // Return user data (without password) and token
    const { password: _, ...userData } = user;
    
    console.log('User logged in successfully:', userData);
    
    res.json({
      user: userData,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login', error: error.message });
  }
};

// Get current user
exports.getMe = async (req, res) => {
  try {
    const user = users.find(user => user.id === req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const { password, ...userData } = user;
    res.json(userData);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all users (for testing)
exports.getAllUsers = (req, res) => {
  const safeUsers = users.map(user => {
    const { password, ...userData } = user;
    return userData;
  });
  
  res.json(safeUsers);
};

// For testing/debugging purposes
exports.resetUsers = (req, res) => {
  users = [];
  res.json({ message: 'Users reset successfully' });
};
