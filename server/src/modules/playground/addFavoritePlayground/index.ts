import { Playground, User } from '@server/entities';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { TRPCError } from '@trpc/server';
import { playgroundIdSchema } from '../../../entities/playground/schema';

export default authenticatedProcedure
    .input(playgroundIdSchema)
    .mutation(async ({ input: { id }, ctx: { db, authUser } }) => {
        const [playground, user] = await Promise.all([
            db.getRepository(Playground).findOne({
                where: {
                    id,
                },
                relations: {
                    address: true,
                },
            }),
            db.getRepository(User).findOneBy({ id: authUser.id }),
        ]);

        if (!playground) {
            throw new TRPCError({
                message: `Playground with ID [${id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }
        if (!user) {
            throw new TRPCError({
                message: `User with ID [${authUser.id}] does not exist.`,
                code: 'NOT_FOUND',
            });
        }

        await db
            .getRepository(Playground)
            .save({ ...playground, users: [user] });

        return {
            playground,
            message: 'Favorite playground added successfully.',
        };
    });
