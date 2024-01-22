import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

type PlaygroundCache = {
    timestamp: number;
    playgrounds: Playground[];
};

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    let playgroundsCache = {} as PlaygroundCache;
    const now = Date.now();

    // simple cache for 1 minute
    if (
        !playgroundsCache ||
        playgroundsCache.playgrounds.length === 0 ||
        now - playgroundsCache.timestamp === 60000
    ) {
        playgroundsCache = {
            timestamp: now,
            playgrounds: await db.getRepository(Playground).find({
                relations: {
                    address: true,
                },
            }),
        };
    }

    return {
        playgrounds: playgroundsCache.playgrounds,
        count: playgroundsCache.playgrounds.length,
    };
});
