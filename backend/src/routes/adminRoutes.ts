import { Router } from 'express';
import { adminController } from '../controllers/adminController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

// All admin routes require authentication and ADMIN role
router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

// Admin dashboard statistics
router.get('/stats', adminController.getDashboardStats);

// Admin request management
router.get('/requests', adminController.getAllRequests);
router.get('/requests/:id', adminController.getRequestById);
router.put('/requests/:id/status', adminController.updateRequestStatus);
router.delete('/requests/:id', adminController.archiveRequest);

export default router;
