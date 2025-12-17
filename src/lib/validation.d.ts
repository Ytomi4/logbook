import { z } from 'zod';
export declare const createBookSchema: z.ZodObject<{
    title: z.ZodString;
    author: z.ZodOptional<z.ZodString>;
    publisher: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodString>;
    coverUrl: z.ZodOptional<z.ZodString>;
    ndlBibId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateBookSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    publisher: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodString>;
    coverUrl: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const logTypeSchema: z.ZodEnum<{
    memo: "memo";
    quote: "quote";
}>;
export declare const createLogSchema: z.ZodObject<{
    logType: z.ZodEnum<{
        memo: "memo";
        quote: "quote";
    }>;
    content: z.ZodString;
}, z.core.$strip>;
export declare const updateLogSchema: z.ZodObject<{
    logType: z.ZodOptional<z.ZodEnum<{
        memo: "memo";
        quote: "quote";
    }>>;
    content: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const paginationSchema: z.ZodObject<{
    limit: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    offset: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const listBooksQuerySchema: z.ZodObject<{
    include_deleted: z.ZodPipe<z.ZodOptional<z.ZodString>, z.ZodTransform<boolean, string | undefined>>;
}, z.core.$strip>;
export declare const ndlSearchSchema: z.ZodObject<{
    title: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodString>;
    isbn: z.ZodOptional<z.ZodString>;
    cnt: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
}, z.core.$strip>;
export declare const uuidSchema: z.ZodString;
export type CreateBookInput = z.infer<typeof createBookSchema>;
export type UpdateBookInput = z.infer<typeof updateBookSchema>;
export type CreateLogInput = z.infer<typeof createLogSchema>;
export type UpdateLogInput = z.infer<typeof updateLogSchema>;
export type PaginationInput = z.infer<typeof paginationSchema>;
export type NdlSearchInput = z.infer<typeof ndlSearchSchema>;
//# sourceMappingURL=validation.d.ts.map