const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const cookieParser = require('cookie-parser');

const router = express.Router();
const secret = process.env.JWT_SECRET;

// Ensure cookie-parser middleware is used
router.use(cookieParser());

router.post('/google', async (req, res) => {
  const { name, email } = req.body;
  console.log('Received Google sign-in request:', { name, email });

  try {
    let user = await User.findOne({ email });
    if (user) {
      console.log('User found:', user);
    } else {
      console.log('User not found, creating new user');
      user = new User({ name, email });
      await user.save();
      console.log('New user created:', user);
    }

    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '1h' });
    console.log('Token created:', token);

    res.status(200).cookie('access_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite:'none',
    }).json({ user });
    console.log('Token sent in cookie:', token);
  } catch (error) {
    console.error('Login error:', error);
    res.status(401).json({ error: 'Authentication failed' });
  }
});


router.get('/check', async (req, res) => {
  const token = req.cookies.access_token;
  console.log('Checking authentication with token:', token);

  if (!token) {
    console.error('No token found');
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id);
    if (!user) {
      console.error('User not found for token');
      return res.status(401).json({ error: 'User not found' });
    }
    res.status(200).json({ user });
    console.log('User authenticated:', user);
  } catch (error) {
    console.error('Auth check error:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});


router.get('/logout', (req, res) => {
  console.log('Logging out user');
  res.clearCookie('access_token').json({ message: 'Logged out successfully!' });
});

module.exports = router;


