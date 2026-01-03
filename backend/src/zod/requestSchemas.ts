import { z } from 'zod';

// Create request schema
export const createRequestSchema = z.object({
  resident_id: z.number().int().positive('Invalid resident ID'),
  requester_id: z.number().int().positive('Invalid requester ID'),
  requester_name: z.string().min(1, 'Requester name is required'),
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  description: z.string().min(1, 'Description is required'),
  category: z.string().min(1, 'Category is required'),
  status: z.enum(['pending', 'offered', 'accepted', 'in_progress', 'completed']).default('pending'),
  full_address: z.string().optional(),
  abstract_address: z.string().optional(),
  is_urgent: z.boolean().default(false),
  complexity: z.enum(['Low', 'Medium', 'High']).optional(),
  estimated_duration: z.string().optional(),
  preferred_time: z.string().optional(),
  offers: z.array(z.any()).default([]), // JSON array
  timeline: z.array(z.any()).default([]) // JSON array
});

// Update request status schema
export const updateRequestStatusSchema = z.object({
  status: z.enum(['pending', 'offered', 'accepted', 'in_progress', 'completed'], {
    errorMap: () => ({ message: 'Status must be one of: pending, offered, accepted, in_progress, completed' })
  }),
  timeline: z.array(z.object({
    status: z.string(),
    timestamp: z.date(),
    note: z.string().optional()
  })).optional()
});

// Make offer schema
export const makeOfferSchema = z.object({
  helperId: z.number().int().positive('Invalid helper ID'),
  helperName: z.string().min(1, 'Helper name is required')
});

// Accept offer schema
export const acceptOfferSchema = z.object({
  helperId: z.number().int().positive('Invalid helper ID')
});

// Request ID parameter schema
export const requestIdSchema = z.object({
  id: z.string().transform((val) => parseInt(val)).refine((val) => !isNaN(val) && val > 0, 'Invalid request ID')
});

// Request query parameters
export const requestQuerySchema = z.object({
  status: z.enum(['pending', 'offered', 'accepted', 'in_progress', 'completed']).optional(),
  category: z.string().optional(),
  limit: z.string().transform((val) => parseInt(val)).refine((val) => !isNaN(val) && val > 0, 'Limit must be a positive number').optional(),
  offset: z.string().transform((val) => parseInt(val)).refine((val) => !isNaN(val) && val >= 0, 'Offset must be a non-negative number').optional()
});

// Export types
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
export type UpdateRequestStatusInput = z.infer<typeof updateRequestStatusSchema>;
export type MakeOfferInput = z.infer<typeof makeOfferSchema>;
export type AcceptOfferInput = z.infer<typeof acceptOfferSchema>;
export type RequestIdParams = z.infer<typeof requestIdSchema>;
export type RequestQueryParams = z.infer<typeof requestQuerySchema>;
