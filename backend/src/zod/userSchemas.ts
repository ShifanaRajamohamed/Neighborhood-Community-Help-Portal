import { z } from 'zod';

// User registration schema
export const createUserSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255, 'Name must be less than 255 characters'),
  contact_info: z.string().email('Invalid email format'),
  email: z.string().email('Invalid email format').optional(),
  location: z.string().min(1, 'Location is required'),
  full_address: z.string().optional(),
  abstract_address: z.string().optional(),
  role: z.enum(['resident', 'helper', 'admin', 'requester'], {
    errorMap: () => ({ message: 'Role must be one of: resident, helper, admin, requester' })
  }).default('resident'),
  password: z.string().min(6, 'Password must be at least 6 characters')
});

// User login schema
export const loginSchema = z.object({
  contact_info: z.string().min(1, 'Contact info is required'),
  password: z.string().min(1, 'Password is required')
});

// User update schema
export const updateUserSchema = z.object({
  name: z.string().min(2).max(255).optional(),
  contact_info: z.string().email().optional(),
  email: z.string().email().optional(),
  location: z.string().min(1).optional(),
  full_address: z.string().optional(),
  abstract_address: z.string().optional()
}).partial();

// User ID parameter schema
export const userIdSchema = z.object({
  id: z.string().transform((val) => parseInt(val)).refine((val) => !isNaN(val) && val > 0, 'Invalid user ID')
});

// Export types
export type CreateUserInput = z.infer<typeof createUserSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UserIdParams = z.infer<typeof userIdSchema>;
