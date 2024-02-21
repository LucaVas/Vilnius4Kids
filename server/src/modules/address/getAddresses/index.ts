import { Address } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';

export default authenticatedProcedure.query(async ({ ctx: { db } }) => {
    const [addresses] = await db.getRepository(Address).findAndCount();

    return {
        addresses,
    };
});
