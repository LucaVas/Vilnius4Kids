import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Address } from './address';

export type BareAddress = Omit<Address, 'users' | 'playground'>;

export const addressSchema = validates<BareAddress>().with({
  id: z.number().int().positive(),
  street: z.string().trim().toLowerCase().min(3).max(255),
  number: z.number().int().positive(),
  zipCode: z.number().int().positive(),
  city: z.string().trim().toLowerCase().min(2).max(255),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const addressInsertSchema = addressSchema.omit({ id: true, createdAt: true, updatedAt: true });
export const addressUpdateSchema = addressInsertSchema.partial()

export type AddressSelect = z.infer<typeof addressSchema>;
export type AddressInsert = z.infer<typeof addressInsertSchema>;
export type AddressUpdate = z.infer<typeof addressUpdateSchema>;
