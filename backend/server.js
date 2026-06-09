const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
require('dotenv').config();

const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI;
const API_KEY = process.env.API_KEY || 'default-api-key';

app.use(cors());
app.use(express.json());

// Connect to MongoDB
async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

// API Key Middleware
function apiKeyMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey || apiKey !== API_KEY) {
    return res.status(401).json({ message: 'Invalid or missing API key' });
  }
  next();
}

// Register endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, role, age, practicesSport, sportType, personalGoal, level } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      name: name || email.split('@')[0],
      email,
      passwordHash,
      role: role || 'User',
      age,
      practicesSport,
      sportType,
      personalGoal,
      level,
    });

    await user.save();

    const token = Buffer.from(`${email}:${user._id}`).toString('base64');
    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = Buffer.from(`${email}:${user._id}`).toString('base64');
    res.json({
      message: 'Login successful',
      token,
      user: user.toJSON(),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

// Dashboard endpoint (requires API key)
app.get('/api/dashboard', apiKeyMiddleware, async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const dashboard = {
      user: user.toJSON(),
      role: user.role,
      stats: {
        totalUsers: await User.countDocuments(),
        coachCount: await User.countDocuments({ role: 'Coach' }),
        athleteCount: await User.countDocuments({ role: 'User' }),
      },
    };

    res.json(dashboard);
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Dashboard fetch failed', error: error.message });
  }
});

// Profile endpoint
app.get('/api/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Token required' });
    }

    const decoded = Buffer.from(token, 'base64').toString().split(':');
    const userId = decoded[1];

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Profile fetch failed', error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Gorila Sport API is running' });
});

// Start server
async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🦍 Gorila Sport backend API running on http://localhost:${PORT}`);
      console.log(`📍 API Key configured: ${API_KEY ? 'Yes' : 'No (using default)'}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
