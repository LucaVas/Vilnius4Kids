import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { newMessageSchema } from '../../../entities/message/schema';
import buildService from '../service/openai/index';

export default authenticatedProcedure
    .input(newMessageSchema)
    .mutation(async ({ input: { content }, ctx: { db, authUser, ai } }) => {
        const service = buildService(db, authUser, ai);
        const message = await service.run(content);

        return {
            message,
        };
    });
