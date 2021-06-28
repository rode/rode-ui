import express from 'express';
import next from 'next';

const app = express();
app.disable('x-powered-by');

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
    process.on(signal, signalHandler(signal));
});

