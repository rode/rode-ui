import config from 'config';
import express from 'express';
import next from 'next';
import {oidc, tokenRefresh} from './middleware.mjs';

export const newApp = async () => {
    const app = express();
    app.disable('x-powered-by');

    if (config.get('oidc.enabled')) {
        app.use(oidc());
        app.use(tokenRefresh());
    }

    const nextApp = next({dev: config.get('app.dev')});

    await nextApp.prepare();

    app.all('*', nextApp.getRequestHandler());

    return app;
};

export const configureGracefulShutdown = (server) => {
    const handler = (signal) => () => {
        console.log(`Received ${signal}, stopping server`);
        server.close((error) => {
            let exitCode = 0;
            if (error) {
                console.error('Error occurred stopping server', error);
                exitCode = 1;
            }

            process.exit(exitCode);
        });
    };

    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.once(signal, handler(signal))
    });
};
