import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../../../shared/types';

export interface AuthRequest extends Request {
  user?: { id: number; role: UserRole };
}

// Mock authentication - in real app, verify JWT tokens
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
  const userId = req.headers['user-id'] as string;
  const userRole = req.headers['user-role'] as string;

  if (userId && userRole) {
    req.user = { id: parseInt(userId), role: userRole as UserRole };
    next();
  } else {
    res.status(401).json({ error: 'Authentication required' });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Specific role guards
export const requireResident = requireRole(['Resident']);
export const requireHelper = requireRole(['Helper']);
