import { z } from 'zod';
export declare const createBookSchema: any;
export declare const updateBookSchema: any;
export declare const logTypeSchema: any;
export declare const createLogSchema: any;
export declare const updateLogSchema: any;
export declare const paginationSchema: any;
export declare const listBooksQuerySchema: any;
export declare const ndlSearchSchema: any;
export declare const uuidSchema: any;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateLogInput = z.infer<typeof createLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type NdlSearchInput = z.infer<typeof ndlSearchSchema>;
//# sourceMappingURL=validation.d.ts.map