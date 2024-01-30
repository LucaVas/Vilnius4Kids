import express from 'express';
import {
    createExpressMiddleware,
    type CreateExpressContextOptions,
} from '@trpc/server/adapters/express';
import cors from 'cors';
import { renderTrpcPanel } from 'trpc-panel';
import type { Database } from './database';
import { appRouter } from './modules';
import type { Context } from './trpc';

export default function createApp(db: Database) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    app.use('/api/health', (_, res) => {
        res.status(200).send('OK');
    });

    app.use('/api/ready', (_, res) => {
        res.status(200).send('OK');
    });

    app.use('/api/panel', (_, res) =>
        res.status(200).send(
            renderTrpcPanel(appRouter, {
                url: 'http://localhost:3000/api/v1/trpc',
                transformer: 'superjson',
            })
        )
    );

    app.use(
        '/api/v1/trpc',
        createExpressMiddleware({
            createContext: ({
                req,
                res,
            }: CreateExpressContextOptions): Context => ({
                db,
                req,
                res,
            }),

            router: appRouter,
        })
    );

    return app;
}
