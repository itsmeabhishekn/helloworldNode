const express = require('express');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    // Generate a custom salt string
    const salt = crypto.randomBytes(16).toString('hex');
    
    // Hash the password with the custom salt
    const hashedPassword = await bcrypt.hash(password + salt, 10);

    // Create a new user with the hashed password and the salt
    const newUser = new User({ username, email, password: hashedPassword, salt });

    // Save the user
    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ id: newUser._id }, 'nekot', { expiresIn: '24h' });

    res.status(201).json({ message: 'Signup successful', token });
  } catch (err) {
    console.error('Signup error:', err);
    res.status(500).json({ message: 'Signup failed' });
  }
});

module.exports = router;
