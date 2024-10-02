import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/create-ticket';

import { errorHandler, NotFoundError } from '@jjgittix/common';


const app = express();
app.set('trust proxy', true); // ingress-nginx is acting as a proxy
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' // Not ideal.
    })
)

app.use(createTicketRouter);

app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }