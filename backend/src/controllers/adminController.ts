import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as adminService from '../services/adminService';
import { AppError } from '../middleware/errorHandler';
import { RequestStatus } from '../types';

export const adminController = {
  // Get all requests with optional filters
  getAllRequests: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { status, category, startDate, endDate } = req.query;

      const filters: any = {};
      if (status) filters.status = status as RequestStatus;
      if (category) filters.category = category as string;
      if (startDate) filters.startDate = new Date(startDate as string);
      if (endDate) filters.endDate = new Date(endDate as string);

      const requests = await adminService.getAllRequests(filters);

      res.status(200).json({
        success: true,
        data: requests
      });
    } catch (error) {
      next(error);
    }
  },

  // Get request by ID with full details
  getRequestById: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const requestId = parseInt(id, 10);

      if (isNaN(requestId)) {
        throw new AppError('Invalid request ID', 400);
      }

      const request = await adminService.getRequestById(requestId);

      if (!request) {
        throw new AppError('Request not found', 404);
      }

      res.status(200).json({
        success: true,
        data: request
      });
    } catch (error) {
      next(error);
    }
  },

  // Update request status (admin override)
  updateRequestStatus: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, helper_id } = req.body;
      const requestId = parseInt(id, 10);

      if (isNaN(requestId)) {
        throw new AppError('Invalid request ID', 400);
      }

      if (!status || !Object.values(RequestStatus).includes(status)) {
        throw new AppError('Invalid status value', 400);
      }

      const adminId = req.user!.id;
      const updatedRequest = await adminService.updateRequestStatus(
        requestId,
        status,
        adminId,
        helper_id
      );

      res.status(200).json({
        success: true,
        message: 'Request status updated successfully',
        data: updatedRequest
      });
    } catch (error) {
      next(error);
    }
  },

  // Get admin dashboard statistics
  getDashboardStats: async (
    _req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const stats = await adminService.getDashboardStats();

      res.status(200).json({
        success: true,
        data: stats
      });
    } catch (error) {
      next(error);
    }
  },

  // Archive/soft-delete request
  archiveRequest: async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const requestId = parseInt(id, 10);

      if (isNaN(requestId)) {
        throw new AppError('Invalid request ID', 400);
      }

      await adminService.archiveRequest(requestId);

      res.status(200).json({
        success: true,
        message: 'Request archived successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};
