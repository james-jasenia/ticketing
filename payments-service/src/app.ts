import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jjgittix/common';
import { createChargeRouter } from './routes/new';

const app = express();
app.set('trust proxy', true); // ingress-nginx is acting as a proxy
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' // Not ideal.
    })
)

app.use(currentUser);
app.use(createChargeRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }