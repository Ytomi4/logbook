import { z } from 'zod';

// Book validation schemas
export const createBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  author: z.string().max(200, 'Author name is too long').optional(),
  publisher: z.string().max(200, 'Publisher name is too long').optional(),
  isbn: z
    .string()
    .regex(/^\d{10}$|^\d{13}$/, 'ISBN must be 10 or 13 digits')
    .optional(),
  coverUrl: z.string().url('Invalid URL format').optional(),
  ndlBibId: z.string().optional(),
});

export const updateBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long').optional(),
  author: z.string().max(200, 'Author name is too long').optional(),
  publisher: z.string().max(200, 'Publisher name is too long').optional(),
  isbn: z
    .string()
    .regex(/^\d{10}$|^\d{13}$/, 'ISBN must be 10 or 13 digits')
    .optional(),
  coverUrl: z.string().url('Invalid URL format').optional(),
});

// Log validation schemas
export const logTypeSchema = z.enum(['memo', 'quote']);

export const createLogSchema = z.object({
  logType: logTypeSchema,
  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content is too long'),
});

export const updateLogSchema = z.object({
  logType: logTypeSchema.optional(),
  content: z
    .string()
    .min(1, 'Content is required')
    .max(10000, 'Content is too long')
    .optional(),
});

// Query parameter schemas
export const paginationSchema = z.object({
  limit: z.coerce.number().int().min(1).max(100).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});

export const listBooksQuerySchema = z.object({
  include_deleted: z
    .string()
    .optional()
    .transform((val) => val === 'true'),
});

export const ndlSearchSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  isbn: z.string().optional(),
  cnt: z.coerce.number().int().min(1).max(50).default(10),
});

// UUID validation
export const uuidSchema = z.string().uuid('Invalid UUID format');

// Username validation schema
export const usernameSchema = z
  .string()
  .min(3, 'ハンドルネームは3文字以上で入力してください')
  .max(20, 'ハンドルネームは20文字以内で入力してください')
  .regex(
    /^[a-zA-Z0-9_]+$/,
    'ハンドルネームは英数字とアンダースコアのみ使用できます'
  );

// Profile update schema
export const updateProfileSchema = z.object({
  username: usernameSchema,
});

// Type exports
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateLogInput = z.infer<typeof createLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type NdlSearchInput = z.infer<typeof ndlSearchSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
