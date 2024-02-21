import { z } from 'zod';
import { validates } from '@vilnius4kids/server/src/utils/validation';
import { Subscription } from './subscription';

export type BareSubscription = Omit<Subscription, 'user'>;

export const subscriptionSchema = validates<BareSubscription>().with({
    id: z.number().int().positive(),
    email: z.string().trim().toLowerCase().min(5).max(255).email(),
    isUser: z.boolean(),
    isContacted: z.boolean(),
    subscribedAt: z.date(),
    updatedAt: z.date(),
});

export const subscriptionInsertSchema = subscriptionSchema.pick({
    email: true,
});

export type UserInsert = z.infer<typeof subscriptionInsertSchema>;
export type UserSelect = z.infer<typeof subscriptionSchema>;
