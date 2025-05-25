import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  loginUser,
  registerUser,
  verifyEmail,
  getUserProfile,
} from '../controllers/userController.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/signup', registerUser);
router.post('/verify/:token', verifyEmail);
router.get('/profile', protect, getUserProfile);

export default router;