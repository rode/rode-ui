const express = require('express');
const next = require('next');
const {auth} = require('express-openid-connect');

(async () => {
    const app = express();
    app.disable('x-powered-by');
    app.use(auth({
        authorizationParams: {
            response_type: 'code',
            response_mode: 'form_post',
            scope: 'openid',
        },
        enableTelemetry: false,
        issuerBaseURL: 'https://keycloak.local/auth/realms/rode-demo',
        baseURL: 'http://localhost:3000',
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        secret: process.env.APP_SECRET,
        idpLogout: true,
    }));
    app.use(async (req, res, next) => {
        if (!req.oidc) {
            req.accessToken = null
            return next();
        }

        const {isExpired, access_token: accessToken, refresh} = req.oidc.accessToken;
        if (accessToken && isExpired()) {
            console.log('token expired, refreshing');
            req.oidc.accessToken = await refresh();
            console.log('refreshed')
        }

        req.accessToken = req.oidc.accessToken.access_token
        next();
    })
    const nextApp = next({dev: true});

    await nextApp.prepare();

    app.all('*', nextApp.getRequestHandler());

    const server = app.listen(3000, () => {
        console.log('server started')
    });

    const signalHandler = (signal) => () => {
        console.log(`Received ${signal}, stopping server`)
        server.close((error) => {
            let exitCode = 0;
            if (error) {
                console.error('Error occurred stopping server', error);
                exitCode = 1;
            }

            process.exit(exitCode)
        });
    };

    ['SIGINT', 'SIGTERM'].forEach((signal) => {
        process.once(signal, signalHandler(signal));
    });
})();
