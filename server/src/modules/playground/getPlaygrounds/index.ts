import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { DataSource } from 'typeorm';

let cache: { data: Playground[]; timestamp: number } = {
    data: [],
    timestamp: 0,
};
const HOUR_MS = 60 * 60 * 1000;

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    const playgrounds = await getPlaygrounds(db);

    return {
        playgrounds,
        count: playgrounds.length,
    };
});

async function getPlaygrounds(db: DataSource) {
    if (cache?.timestamp > Date.now() - HOUR_MS) {
        return cache.data;
    }

    const playgrounds = await db.getRepository(Playground).find({
        relations: {
            address: true,
            users: true,
        },
    });
    cache = { data: playgrounds, timestamp: Date.now() }; // Update cache
    return playgrounds;
}
