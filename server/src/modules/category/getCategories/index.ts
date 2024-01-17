import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Category } from '@server/entities';

export default authenticatedProcedure.query(async ({ ctx: { db } }) =>
    db.getRepository(Category).find()
);
