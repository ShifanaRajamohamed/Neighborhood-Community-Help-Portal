import { Response } from 'express';
import { RequestService } from '../services/requestService';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, CreateRequestDTO, UpdateRequestStatusDTO } from '../types';

const requestService = new RequestService();

export const createRequest = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const requestData: CreateRequestDTO = {
    ...req.body,
    resident_id: req.user.id
  };

  const newRequest = await requestService.createRequest(requestData);

  res.status(201).json({
    success: true,
    data: newRequest,
    message: 'Help request created successfully'
  });
});

export const getRequests = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  const { status, resident_id, helper_id } = req.query;

  const filters: any = {};
  if (status) filters.status = status as string;
  if (resident_id) filters.resident_id = parseInt(resident_id as string);
  if (helper_id === 'null') filters.helper_id = null;
  else if (helper_id) filters.helper_id = parseInt(helper_id as string);

  const requests = await requestService.getAllRequests(filters);

  res.status(200).json({
    success: true,
    data: requests
  });
});

export const getRequestById = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  const requestId = parseInt(req.params.id);
  const request = await requestService.getRequestById(requestId);

  res.status(200).json({
    success: true,
    data: request
  });
});

export const updateRequestStatus = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const requestId = parseInt(req.params.id);
  const updateData: UpdateRequestStatusDTO = req.body;

  const updatedRequest = await requestService.updateRequestStatus(
    requestId,
    updateData,
    req.user.role,
    req.user.id
  );

  res.status(200).json({
    success: true,
    data: updatedRequest,
    message: 'Request status updated successfully'
  });
});
