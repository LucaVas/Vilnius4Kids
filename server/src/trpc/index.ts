import { initTRPC } from '@trpc/server';
import type { Request, Response } from 'express';
import type { AuthUser } from '@server/entities/user/schema';
import type { Database } from '@server/database';
import SuperJSON from 'superjson';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { type TRPCPanelMeta } from 'trpc-panel';

export type Context = {
    db: Database;
    req?: Request;
    res?: Response;
    authUser?: AuthUser;
};

export type ContextMinimal = Pick<Context, 'db'>;

const t = initTRPC
    .context<Context>()
    .meta<TRPCPanelMeta>()
    .create({
        transformer: SuperJSON,
        errorFormatter(opts) {
            const { shape, error } = opts;

            if (error.cause instanceof ZodError) {
                const validationError = fromZodError(error.cause);

                return {
                    ...shape,
                    data: {
                        message: validationError.message,
                    },
                };
            }

            return shape;
        },
    });

export const {
    middleware,
    router,
    procedure: publicProcedure,
    mergeRouters,
} = t;
