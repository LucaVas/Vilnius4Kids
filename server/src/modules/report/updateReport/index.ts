import { TRPCError } from '@trpc/server';
import { authenticatedProcedure } from '@server/trpc/authenticatedProcedure';
import { Report, ReportStatusChangeLog, User } from '@server/entities';
import mailSender from '@server/modules/report/service/index';
import { reportUpdateSchema } from '../../../entities/report/schema';

export default authenticatedProcedure
    .input(reportUpdateSchema)
    .mutation(
        async ({
            input: { id, description, status },
            ctx: { db, authUser },
        }) => {
            const [{ affected, raw }, user] = await Promise.all([
                db
                    .getRepository(Report)
                    .createQueryBuilder()
                    .update()
                    .set({ description, status })
                    .where('id = :id', { id })
                    .returning('*')
                    .execute(),
                db.getRepository(User).findOneBy({ id: authUser.id }),
            ]);

            if (!user) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `User with ID [${authUser.id}] does not exist.`,
                });
            }

            if (affected === 0) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: `Report with ID [${id}] does not exist.`,
                });
            }

            await db.getRepository(ReportStatusChangeLog).insert({
                report: raw[0],
                playground: raw[0].playground,
                status,
                changeStatusMessage: description,
            });

            const sender = mailSender(
                user.username,
                user.email,
                raw[0].id
            );
            sender.send();

            return {
                message: `Report with ID [${id}] updated successfully.`,
                report: raw[0],
            };
        }
    );
