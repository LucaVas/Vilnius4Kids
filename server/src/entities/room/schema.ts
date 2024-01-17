import { z } from 'zod';
import { validates } from '@server/utils/validation';
import { Room } from './room';

export type BareRoom = Omit<Room, 'items' | 'user' | 'area'>;

export const roomSchema = validates<BareRoom>().with({
    id: z.number().int().positive(),
    name: z.string().min(2, {
        message: 'Room name must be at least 2 characters long.',
    }),
    width: z
        .number()
        .positive({ message: 'Width cannot be 0 or a negative number. ' }),
    length: z
        .number()
        .positive({ message: 'Length cannot be 0 or a negative number. ' }),
});


export const roomIdSchema = roomSchema.pick({ id: true });
export const insertRoomSchema = roomSchema.omit({ id: true });
export const updateRoomSchema = roomSchema.partial().required({ id: true });

export type RoomInsert = z.infer<typeof insertRoomSchema>;
export type RoomUpdate = z.infer<typeof roomSchema>;
