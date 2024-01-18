import { publicProcedure } from '@server/trpc';
import bcrypt from 'bcrypt';
import { User } from '@server/entities';
import { TRPCError } from '@trpc/server';
import { signupSchema } from './schema';
import config from '@server/config';

const { passwordCost } = config.auth;

export default publicProcedure
  .input(signupSchema)
  .mutation(async ({ input: { email, username, password }, ctx: { db } }) => {
    const hashedPassword = await bcrypt.hash(password, passwordCost);

    try {
      const user = await db
        .getRepository(User)
        .save({ email, username, password: hashedPassword });

      return {
        id: user.id,
      };
    } catch (error) {
      if (!(error instanceof Error)) {
        throw error;
      }

      if (error.message.includes('duplicate key')) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Email or username are already taken, please try different ones.`,
        });
      }

      throw error;
    }
  });
