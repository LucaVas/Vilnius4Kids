import { z } from 'zod';
import { getDistance } from '@server/services/maps';
import { publicProcedure } from '@server/trpc';

const distanceRequestSchema = z.object({
    origin: z.object({
        lat: z.number(),
        lng: z.number(),
    }),
    destination: z.object({
        lat: z.number(),
        lng: z.number(),
    }),
});

export default publicProcedure
    .input(distanceRequestSchema)
    .query(async ({ input: { origin, destination } }) =>
        getDistance(origin, destination)
    );
