import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Report } from './report';
import { ReportStatus } from './ReportStatus';

export type BareReport = Omit<
    Report,
    'user' | 'changeLogs' | 'playground' | 'category'
>;

export const reportSchema = validates<BareReport>().with({
    id: z.number().int().positive(),
    description: z
        .string()
        .trim()
        .min(5, {
            message: 'Report description should be at least 5 characters long',
        })
        .max(500, {
            message: 'Report description cannot exceed 500 characters',
        })
        .describe('Report description'),
    status: z.nativeEnum(ReportStatus).describe('Report status'),

    createdAt: z.date(),
    updatedAt: z.date(),
});

export const reportInsertSchema = reportSchema
    .omit({
        id: true,
        status: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({
        playgroundId: z.number().int().positive(),
        reportCategoryId: z.number().int().positive(),
    });

export const reportUpdateSchema = reportSchema.omit({
    createdAt: true,
    updatedAt: true,
});

export const reportOptionalIdSchema = reportSchema
    .pick({ id: true })
    .optional();
export const reportIdSchema = reportSchema.pick({ id: true })

export type ReportSelect = z.infer<typeof reportSchema>;
export type ReportInsert = z.infer<typeof reportInsertSchema>;
export type ReportUpdate = z.infer<typeof reportUpdateSchema>;
