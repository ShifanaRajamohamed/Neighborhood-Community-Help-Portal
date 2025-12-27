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
  const { status, resident_id, helper_id, limit, offset } = req.query;

  const filters: any = {};
  if (status) filters.status = status as string;
  if (resident_id) filters.resident_id = parseInt(resident_id as string);
  if (helper_id === 'null') filters.helper_id = null;
  else if (helper_id) filters.helper_id = parseInt(helper_id as string);

  // Add pagination parameters
  if (limit) filters.limit = parseInt(limit as string);
  if (offset) filters.offset = parseInt(offset as string);

  const result = await requestService.getAllRequests(filters);

  res.status(200).json({
    success: true,
    data: result.requests,
    meta: {
      total: result.total,
      limit: filters.limit || 50,
      offset: filters.offset || 0
    }
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

export const makeOffer = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const requestId = parseInt(req.params.id);
  const { helperId, helperName } = req.body;

  const updatedRequest = await requestService.makeOffer(
    requestId,
    helperId || req.user.id,
    helperName || req.user.name || 'Unknown Helper'
  );

  res.status(200).json({
    success: true,
    data: updatedRequest,
    message: 'Offer made successfully'
  });
});

export const acceptOffer = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const requestId = parseInt(req.params.id);
  const helperId = parseInt(req.params.helperId);

  const updatedRequest = await requestService.acceptOffer(
    requestId,
    helperId,
    req.user.name || 'Unknown Requester'
  );

  res.status(200).json({
    success: true,
    data: updatedRequest,
    message: 'Offer accepted successfully'
  });
});

export const deleteRequest = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  if (!req.user) {
    res.status(401).json({ success: false, error: 'Not authenticated' });
    return;
  }

  const requestId = parseInt(req.params.id);

  await requestService.deleteRequest(requestId, req.user.id, req.user.role);

  res.status(200).json({
    success: true,
    message: 'Request deleted successfully'
  });
});
