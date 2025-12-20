import { Response } from 'express';
import { UserService } from '../services/userService';
import { AuthRequest } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { ApiResponse, CreateUserDTO } from '../types';

const userService = new UserService();

export const register = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  const userData: CreateUserDTO = req.body;
  const result = await userService.createUser(userData);

  res.status(201).json({
    success: true,
    data: result,
    message: 'User registered successfully'
  });
});

export const login = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  const { contact_info, password } = req.body;
  const result = await userService.login(contact_info, password);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Login successful'
  });
});

export const getUserProfile = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  const userId = parseInt(req.params.id);
  const user = await userService.getUserById(userId);

  res.status(200).json({
    success: true,
    data: user
  });
});

export const updateUserProfile = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  const userId = parseInt(req.params.id);

  // Users can only update their own profile unless admin
  if (req.user?.id !== userId && req.user?.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: 'You can only update your own profile'
    });
    return;
  }

  const updatedUser = await userService.updateUser(userId, req.body);

  res.status(200).json({
    success: true,
    data: updatedUser,
    message: 'Profile updated successfully'
  });
});

export const getCurrentUser = asyncHandler(async (req: AuthRequest, res: Response<ApiResponse>) => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Not authenticated'
    });
    return;
  }

  const user = await userService.getUserById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});
