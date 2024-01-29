import * as Sentry from '@sentry/node';
import express from 'express';
import {
    createExpressMiddleware,
    type CreateExpressContextOptions,
} from '@trpc/server/adapters/express';
import cors from 'cors';
import { renderTrpcPanel } from 'trpc-panel';
import { ProfilingIntegration } from '@sentry/profiling-node';
import type { Database } from './database';
import { appRouter } from './modules';
import type { Context } from './trpc';

export default function createApp(db: Database) {
    const app = express();

    Sentry.init({
        dsn: 'https://33a2d1aaeff837b5bf7b226f1e78eae7@o4506653934485504.ingest.sentry.io/4506653945495552',
        integrations: [
            // enable HTTP calls tracing
            new Sentry.Integrations.Http({ tracing: true }),
            // enable Express.js middleware tracing
            new Sentry.Integrations.Express({ app }),
            new ProfilingIntegration(),
        ],
        // Performance Monitoring
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set sampling rate for profiling - this is relative to tracesSampleRate
        profilesSampleRate: 1.0,
    });

    // The request handler must be the first middleware on the app
    app.use(Sentry.Handlers.requestHandler());

    // TracingHandler creates a trace for every incoming request
    app.use(Sentry.Handlers.tracingHandler());

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
            }),

            router: appRouter,
        })
    );

    // The error handler must be registered before any other error middleware and after all controllers
    app.use(Sentry.Handlers.errorHandler());

    return app;
}
