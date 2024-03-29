import { z } from 'zod';
import { validates } from '@vilnius4kids/server/src/utils/validation';
import { ReportCategory } from './reportCategory';

export type BareReportCategory = Omit<ReportCategory, 'reports'>;

export const reportCategorySchema = validates<BareReportCategory>().with({
    id: z.number().int().positive(),
    name: z
        .string()
        .trim()
        .min(5, {
            message:
                'Report category name should be at least 5 characters long',
        })
        .max(50, {
            message: 'Report category name cannot exceed 50 characters',
        })
        .describe('Report category name'),
    topic: z
        .string()
        .trim()
        .min(5, {
            message:
                'Report category topic should be at least 5 characters long',
        })
        .max(50, {
            message: 'Report category topic cannot exceed 50 characters',
        })
        .describe('Report category topic'),
    description: z
        .string()
        .trim()
        .min(5, {
            message:
                'Report category description should be at least 5 characters long',
        })
        .max(500, {
            message: 'Report category description cannot exceed 50 characters',
        })
        .describe('Report category description'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const reportCategoryInsertSchema = reportCategorySchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});

export const reportCategoryUpdateSchema = reportCategorySchema.omit({
    createdAt: true,
    updatedAt: true,
});

export const reportCategoryIdSchema = reportCategorySchema.pick({ id: true });

export type ReportCategorySelect = z.infer<typeof reportCategorySchema>;
export type ReportCategoryInsert = z.infer<typeof reportCategoryInsertSchema>;
export type ReportCategoryUpdate = z.infer<typeof reportCategoryUpdateSchema>;
