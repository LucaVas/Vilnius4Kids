import { z } from 'zod';
import { validates } from '@vilnius4kids/server/src/utils/validation';
import { Address, Rating, Report } from '..';
import { Playground } from './playground';

export type BarePlayground = Omit<
    Playground,
    'users' | 'reports' | 'ratings' | 'address'
>;
const AddressType: z.ZodType<Address> = z.any();
const RatingType: z.ZodType<Rating> = z.any();
const ReportType: z.ZodType<Report> = z.any();

export const playgroundSchema = validates<BarePlayground>().with({
    id: z.number().int().positive(),
    isPrivate: z.boolean(),
    isOpen: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
    latitude: z.number(),
    longitude: z.number(),
    description: z.string().max(500),
});

export const playgroundInsertSchema = playgroundSchema
    .omit({
        id: true,
        createdAt: true,
        updatedAt: true,
    })
    .extend({ addressId: z.number().int().positive() });
export const playgroundUpdateSchema = playgroundSchema
    .omit({ addressId: true, createdAt: true, updatedAt: true })
    .required({ id: true })
    .partial();
export const playgroundIdSchema = playgroundSchema.pick({ id: true });
export const playgroundDeleteSchema = playgroundIdSchema;
export const playgroundWithAddressSchema = playgroundSchema.extend({
    address: AddressType,
});
export const fullPlaygroundSchema = playgroundSchema.extend({
    address: AddressType,
    ratings: z.array(RatingType),
    reports: z.array(ReportType),
});

export type PlaygroundSelect = z.infer<typeof playgroundSchema>;
export type PlaygroundSelectWithAddress = z.infer<
    typeof playgroundWithAddressSchema
>;
export type FullPlayground = z.infer<typeof fullPlaygroundSchema>;
export type PlaygroundInsert = z.infer<typeof playgroundInsertSchema>;
export type PlaygroundUpdate = z.infer<typeof playgroundUpdateSchema>;
export type PlaygroundDelete = z.infer<typeof playgroundDeleteSchema>;
