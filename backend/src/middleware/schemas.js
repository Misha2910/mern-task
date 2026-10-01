import { z } from 'zod';
import { TASK_STATUSES } from '../models/Task.js';

const objectId = z.string().regex(/^[a-f\d]{24}$/i, 'A valid identifier is required.');
const optionalDescription = (max) => z.string().trim().max(max).optional().default('');
const optionalDescriptionUpdate = (max) => z.string().trim().max(max).optional();

export const registerSchema = z.object({
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
});

export const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
});

export const projectCreateSchema = z.object({
  name: z.string().trim().min(1).max(100),
  description: optionalDescription(1000),
});

export const projectUpdateSchema = z.object({
  name: z.string().trim().min(1).max(100).optional(),
  description: optionalDescriptionUpdate(1000),
}).refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required.',
);

export const taskCreateSchema = z.object({
  title: z.string().trim().min(1).max(160),
  description: optionalDescription(2000),
  status: z.enum(TASK_STATUSES).optional(),
});

export const taskUpdateSchema = z.object({
  title: z.string().trim().min(1).max(160).optional(),
  description: optionalDescriptionUpdate(2000),
  status: z.enum(TASK_STATUSES).optional(),
}).refine(
  (value) => Object.keys(value).length > 0,
  'At least one field is required.',
);



export const projectIdSchema = z.object({ projectId: objectId });
export const taskIdSchema = z.object({ taskId: objectId });