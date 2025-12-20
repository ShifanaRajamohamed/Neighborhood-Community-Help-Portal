import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorHandler';
import { UserRole, RequestStatus } from '../types';

export const validateUserRegistration = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { name, contact_info, location, role, password } = req.body;

  if (!name || typeof name !== 'string' || name.trim().length === 0) {
    throw new AppError('Name is required and must be a non-empty string', 400);
  }

  if (!contact_info || typeof contact_info !== 'string' || contact_info.trim().length === 0) {
    throw new AppError('Contact info is required', 400);
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contact_info)) {
    throw new AppError('Please provide a valid email address', 400);
  }

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    throw new AppError('Location is required', 400);
  }

  if (!role || !Object.values(UserRole).includes(role)) {
    throw new AppError('Valid role is required (resident, helper, admin)', 400);
  }

  // Enhanced password validation
  if (!password || typeof password !== 'string') {
    throw new AppError('Password is required', 400);
  }

  if (password.length < 8) {
    throw new AppError('Password must be at least 8 characters long', 400);
  }

  // Check for password complexity
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumber || !hasSpecialChar) {
    throw new AppError(
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      400
    );
  }

  next();
};

export const validateRequestCreation = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { title, description, category } = req.body;

  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    throw new AppError('Title is required', 400);
  }

  if (!description || typeof description !== 'string' || description.trim().length === 0) {
    throw new AppError('Description is required', 400);
  }

  if (!category || typeof category !== 'string' || category.trim().length === 0) {
    throw new AppError('Category is required', 400);
  }

  next();
};

export const validateStatusUpdate = (
  req: Request,
  _res: Response,
  next: NextFunction
): void => {
  const { status } = req.body;

  if (!status || !Object.values(RequestStatus).includes(status)) {
    throw new AppError('Valid status is required', 400);
  }

  next();
};
