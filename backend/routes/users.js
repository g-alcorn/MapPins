const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
// Base URL: /api/users

// Register a new user
router.post('/register', async (req, res) => {
  // Generate password
  const salt = await bcrypt.genSalt(10);
  const hashedPass = await bcrypt.hash(req.body.password, salt);

  // Create user
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPass
  });

  try {
    // Save User in cloud

    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch(e) {
    res.status(500).json(e);
  };
});

// Login
router.post('/login', async (req, res) => {
  try {
    // Finds the user in the DB
    const user = await User.findOne({ username: req.body.username });
    !user && res.status(500).json('Incorrect username or password')

    // Checks password
    const validatePassword = await bcrypt.compare(req.body.password, user.password);
    !validatePassword && res.status(500).json('Incorrect username or password');

    // Send response if successful
    res.status(200).json({
      __id: user._id,
      username: user.username
    });
  } catch(e) {
    res.status(500).json(e);
  }
})

module.exports = router;