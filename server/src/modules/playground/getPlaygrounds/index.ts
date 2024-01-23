import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

type PlaygroundCache = {
    timestamp: number;
    playgrounds: Playground[];
};

let playgroundsCache = {} as PlaygroundCache;

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    
    const now = Date.now();

    // simple cache for 1 minute
    if (
        Object.keys(playgroundsCache).length === 0 ||
        playgroundsCache.playgrounds.length === 0 ||
        now - playgroundsCache.timestamp === 60000
    ) {
        playgroundsCache = {
            timestamp: now,
            playgrounds: await db.getRepository(Playground).find({
                relations: {
                    address: true,
                    users: true
                },
            }),
        };
    }

    return {
        playgrounds: playgroundsCache.playgrounds,
        count: playgroundsCache.playgrounds.length,
    };
});
