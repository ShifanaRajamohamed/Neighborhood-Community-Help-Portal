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

  if (!location || typeof location !== 'string' || location.trim().length === 0) {
    throw new AppError('Location is required', 400);
  }

  if (!role || !Object.values(UserRole).includes(role)) {
    throw new AppError('Valid role is required (resident, helper, admin)', 400);
  }

  if (!password || typeof password !== 'string' || password.length < 6) {
    throw new AppError('Password must be at least 6 characters', 400);
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
