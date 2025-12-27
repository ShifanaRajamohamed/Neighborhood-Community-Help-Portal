import express from 'express';
import {
  register,
  login,
  getUserProfile,
  updateUserProfile,
  getCurrentUser,
  getAllUsers,
  approveHelper
} from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { validateUserRegistration } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// Public routes
router.post('/register', validateUserRegistration, register);
router.post('/login', login);

// Protected routes
router.get('/me', authenticate, getCurrentUser);
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserProfile);
router.put('/:id', authenticate, updateUserProfile);
router.put('/:id/approve', authenticate, authorize(UserRole.ADMIN), approveHelper);

export default router;
