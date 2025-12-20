import express from 'express';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  getCurrentUser
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validateUserRegistration } from '../middleware/validation';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.get('/:id', authenticate, getUserProfile);
router.put('/:id', authenticate, updateUserProfile);

export default router;
