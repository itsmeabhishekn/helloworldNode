const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Validate email and username format (optional)
    // ...

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Create a new user
    const newUser = new User({ username, email, password });

    // Save the user
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, 'nekot', { expiresIn: '1h' });

    res.status(201).json({ message: 'Signup successful', token });

  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

module.exports = router;
