import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { errorHandler, NotFoundError, currentUser } from '@jjgittix/common';

import { createOrderRouter } from './routes/create-order';
import { deleteOrderRouter } from './routes/delete-order';
import { indexOrderRouter } from './routes';
import { showOrderRouter } from './routes/show-order';


const app = express();
app.set('trust proxy', true); // ingress-nginx is acting as a proxy
app.use(json());
app.use(
    cookieSession({
        signed: false,
        secure: process.env.NODE_ENV !== 'test' // Not ideal.
    })
)

app.use(createOrderRouter);
app.use(deleteOrderRouter);
app.use(indexOrderRouter);
app.use(showOrderRouter);
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }