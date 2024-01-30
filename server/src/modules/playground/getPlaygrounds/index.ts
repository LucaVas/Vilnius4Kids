import { Playground } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { DataSource } from 'typeorm';
import config from '@server/config';

type Cache = {
    data: Playground[];
    timestamp: number;
};

let cache: Cache = { data: [], timestamp: Date.now() };
const HOUR_MS = config.env === 'test' ? 0 : 60 * 60 * 1000;

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    const playgrounds = await getPlaygroundsFromStore(db);

    return {
        playgrounds,
        count: playgrounds.length,
    };
});

async function getPlaygroundsFromStore(db: DataSource) {
    if (cache.timestamp > Date.now() - HOUR_MS) {
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
