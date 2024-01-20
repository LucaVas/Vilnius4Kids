import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Address } from './address';

export type BareAddress = Omit<Address, 'users' | 'playground'>;

export const addressSchema = validates<BareAddress>().with({
    id: z.number().int().positive(),
    street: z
        .string()
        .trim()
        .toLowerCase()
        .min(3, { message: 'Street should be at least 3 characters long.' })
        .max(255, { message: 'Street cannot exceed 255 characters.' })
        .describe('Street name'),
    number: z.number().int().positive().describe('Street number'),
    zipCode: z.number().int().positive().describe('Zip code'),
    city: z
        .string()
        .trim()
        .toLowerCase()
        .min(2)
        .max(255, { message: 'City cannot exceed 255 characters.' })
        .describe('City name'),
    district: z
        .string()
        .trim()
        .toLowerCase()
        .min(2)
        .max(255, { message: 'City cannot exceed 255 characters.' })
        .describe('City name'),
    createdAt: z.date(),
    updatedAt: z.date(),
});

export const addressInsertSchema = addressSchema.omit({
    id: true,
    createdAt: true,
    updatedAt: true,
});
export const addressUpdateSchema = addressSchema.required({ id: true }).partial();
export const addressDeleteSchema = addressSchema.pick({ id: true });

export type AddressSelect = z.infer<typeof addressSchema>;
export type AddressInsert = z.infer<typeof addressInsertSchema>;
export type AddressUpdate = z.infer<typeof addressUpdateSchema>;
export type AddressDelete = z.infer<typeof addressDeleteSchema>;
