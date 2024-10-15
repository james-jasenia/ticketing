import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import { createTicketRouter } from './routes/create-ticket';
import { errorHandler, NotFoundError, currentUser } from '@jjgittix/common';
import { showTicketRouter } from './routes/show-ticket';
import { indexRouter } from './routes';
import { updateTicketRouter } from './routes/update-ticket';


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
app.use(createTicketRouter);
app.use(showTicketRouter);
app.use(indexRouter);
app.use(updateTicketRouter);
app.all('*', async () => {
    throw new NotFoundError();
});

app.use(errorHandler);

export { app }