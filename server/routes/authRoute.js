import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../schema/user.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: 'User already exists' });

    const hashPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, passwordHash: hashPassword });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      user: {
        id: newUser._id,
        email: newUser.email,
        isProfileComplete: newUser.isProfileComplete,
        profile: newUser.profile,
      },
      token,
      message: "Welcome to QuickScholar!"
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});


router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({
      success: true,
      user: {
        id: user._id,
        email: user.email,
        isProfileComplete: user.isProfileComplete,
        profile: user.profile,
      }, token,
      message: "logged in successfully."
    });
  } catch (error) {
    res.json({ error: error.message });
  }
});

export default router;
