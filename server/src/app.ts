import * as Sentry from '@sentry/node';
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

    Sentry.init({
        dsn: 'https://a0a95d40f868ce67be7611bedbbeface@o4506653934485504.ingest.sentry.io/4506653981605888',
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Sentry.Integrations.Express({
                // to trace all requests to the default router
                app,
            }),
        ],
        tracesSampleRate: 1.0,
    });

    // RequestHandler creates a separate execution context, so that all
    // transactions/spans/breadcrumbs are isolated across requests
    app.use(Sentry.Handlers.requestHandler());
    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());

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

    app.use(Sentry.Handlers.errorHandler());

    return app;
}
