import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import crypto from 'crypto';
import { sendVerificationEmail } from '../utils/emailService.js';

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
const registerUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = await User.create({
      email,
      password,
      verificationToken,
    });

    if (user) {
      // Send verification email
      const emailSent = await sendVerificationEmail(email, verificationToken);
      
      if (!emailSent) {
        // If email fails, delete the user and return error
        await user.deleteOne();
        return res.status(500).json({ 
          message: 'Failed to send verification email. Please try again.' 
        });
      }

      res.status(201).json({
        message: 'Registration successful! Please check your email to verify your account.',
        email: user.email
      });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const user = await User.findOne({ verificationToken: req.params.token });

    if (!user) {
      return res.status(400).json({ message: 'Invalid verification token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      if (!user.isVerified) {
        return res.status(401).json({ message: 'Please verify your email first' });
      }

      res.json({
        _id: user._id,
        email: user.email,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export { registerUser, loginUser, verifyEmail, getUserProfile };