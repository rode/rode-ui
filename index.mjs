import {newApp, configureGracefulShutdown} from './server/server.mjs';

const listen = (app) => {
    return new Promise((resolve, reject) => {
        const server = app.listen(3000, '0.0.0.0', (err) => {
            if (err) {
                return reject(err);
            }

            return resolve(server);
        });
    });
};

try {
    const app = await newApp();
    const server = await listen(app);
    configureGracefulShutdown(server);
    console.log(`Server listening on ${server.address().address}:${server.address().port}`);
} catch(error) {
    console.error('Error starting server', error);
    process.exit(1);
}
