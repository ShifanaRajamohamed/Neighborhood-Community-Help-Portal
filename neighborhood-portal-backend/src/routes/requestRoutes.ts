import express from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus
} from '../controllers/requestController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequestCreation, validateStatusUpdate } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create request (Residents only)
router.post(
  '/',
  authorize(UserRole.RESIDENT),
  validateRequestCreation,
  createRequest
);

// Get all requests (All authenticated users)
router.get('/', getRequests);

// Get single request (All authenticated users)
router.get('/:id', getRequestById);

// Update request status (Residents and Helpers)
router.put(
  '/:id/status',
  authorize(UserRole.RESIDENT, UserRole.HELPER),
  validateStatusUpdate,
  updateRequestStatus
);

export default router;
