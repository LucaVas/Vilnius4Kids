import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { ReportStatusChangeLog } from './reportStatusChangeLog';
import { ReportStatus } from '../report/reportStatus';

export type BareChangeLog = Omit<
  ReportStatusChangeLog,
  'reports' | 'playground'
>;

export const changeLogSchema = validates<BareChangeLog>().with({
  id: z.number().int().positive(),
  status: z.nativeEnum(ReportStatus),
  changeStatusMessage: z.string().trim().min(3).max(255),
  changedAt: z.date(),
});

export const changeLogInsertSchema = changeLogSchema.omit({
  id: true,
  changedAt: true,
});
export const changeLogUpdateSchema = changeLogInsertSchema.partial();

export type ChangeLogSelect = z.infer<typeof changeLogSchema>;
export type ChangeLogInsert = z.infer<typeof changeLogInsertSchema>;
export type ChangeLogUpdate = z.infer<typeof changeLogUpdateSchema>;
