import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Message } from './message';

export type BareMessage = Omit<Message, 'user'>;

export const roomSchema = validates<BareMessage>().with({
    id: z.number().int().positive(),
    role: z.string().min(1),
    content: z.string().min(1, { message: 'Question must be at least 1 character long.' }),
});

export const chatMessageSchema = roomSchema
    .omit({ id: true })
    .extend({ user: z.object({ id: z.number().int().positive() }) });
export const newMessageSchema = chatMessageSchema.omit({
    role: true,
    user: true,
});

export type NewMessage = z.infer<typeof newMessageSchema>;
export type ChatMessage = z.infer<typeof chatMessageSchema>;
