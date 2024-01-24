import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { ReportCategory } from './reportCategory';

export type BareReportCategory = Omit<ReportCategory, 'report'>;

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
