import express from 'express';
import {
  createRequest,
  getRequests,
  getRequestById,
  updateRequestStatus,
  makeOffer,
  acceptOffer,
  deleteRequest
} from '../controllers/requestController';
import { authenticate, authorize } from '../middleware/auth';
import { validateRequestCreation, validateStatusUpdate } from '../middleware/validation';
import { UserRole } from '../types';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Create request (Residents and Requesters)
router.post(
  '/',
  authorize(UserRole.RESIDENT, UserRole.REQUESTER),
  validateRequestCreation,
  createRequest
);

// Get all requests (All authenticated users)
router.get('/', getRequests);

// Get single request (All authenticated users)
router.get('/:id', getRequestById);

// Update request status (Residents, Requesters and Helpers)
router.put(
  '/:id/status',
  authorize(UserRole.RESIDENT, UserRole.REQUESTER, UserRole.HELPER),
  validateStatusUpdate,
  updateRequestStatus
);

// Update request (generic update)
router.put('/:id', updateRequestStatus);

// Make offer on request (Helpers only)
router.post('/:id/offers', authorize(UserRole.HELPER), makeOffer);

// Accept offer (Requesters only)
router.put('/:id/accept/:helperId', authorize(UserRole.REQUESTER), acceptOffer);

// Delete request
router.delete('/:id', deleteRequest);

export default router;
