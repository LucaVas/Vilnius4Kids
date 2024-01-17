import express from 'express';
import {
    createExpressMiddleware,
    type CreateExpressContextOptions,
} from '@trpc/server/adapters/express';
import cors from 'cors';
import { renderTrpcPanel } from 'trpc-panel';
import OpenAI from 'openai';
import type { Database } from './database';
import { appRouter } from './modules';
import type { Context } from './trpc';

export default function createApp(db: Database, ai: OpenAI) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/health', (_, res) => {
        res.status(200).send('OK');
    });

    app.use('/ready', (_, res) => {
        res.status(200).send('OK');
    });

    app.use('/panel', (_, res) =>
        res.status(200).send(
            renderTrpcPanel(appRouter, {
                url: 'http://localhost:3000/v1/trpc',
                transformer: 'superjson',
            })
        )
    );

    app.use(
        '/v1/trpc',
        createExpressMiddleware({
            createContext: ({
                req,
                res,
            }: CreateExpressContextOptions): Context => ({
                db,
                req,
                res,
                ai,
            }),

            router: appRouter,
        })
    );

    return app;
}
