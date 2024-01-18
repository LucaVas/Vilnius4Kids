import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Report } from './report';
import { ReportStatus } from './ReportStatus';

export type BareReport = Omit<Report, 'user' | 'changeLogs' | 'playgrounds'>;

export const reportSchema = validates<BareReport>().with({
  id: z.number().int().positive(),
  description: z.string().trim().min(3).max(500),
  status: z.nativeEnum(ReportStatus),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const reportInsertSchema = reportSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export const reportUpdateSchema = reportInsertSchema.partial();

export type ReportSelect = z.infer<typeof reportSchema>;
export type ReportInsert = z.infer<typeof reportInsertSchema>;
export type ReportUpdate = z.infer<typeof reportUpdateSchema>;
