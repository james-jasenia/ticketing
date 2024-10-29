import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';
import { natsWrapper } from '../../nats-wrapper';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { Ticket } from '../../models/ticket';
import { OrderStatus } from '@jjgittix/common';


it('has a route handler listening to /api/orders for post requests', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .post('/api/orders')
        .send({ ticketId });

    expect(response.status).not.toEqual(404);
});

it('will return a 401 if the user is not signed in given valid data is provided', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .post('/api/orders')
        .send({ ticketId });

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    const cookie = await signUpReturnCookie();

    console.log(cookie)

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId });

        console.log(response.headers)

    expect(response.status).not.toEqual(401);
});

it('returns an error if no ticket id is provided is provided', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({});

    expect(response.status).toEqual(400);
});


it('returns an error if the ticket is already reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'any title',
        price: 10
    })

    await ticket.save();

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + 60 * 15);

    const order = Order.build({
        userId: 'asdfadsf',
        status: OrderStatus.AwaitingPayment,
        expiresAt: expiration,
        ticket
    })

    await order.save();

    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id });

    expect(response.status).toEqual(400);
    expect(response.body).toEqual({
        "errors": [
            {
                message: "Ticekt is already reserved"
            }
        ]
    });
});

it('returns a ticket if the ticket has successfully been reserved', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'any title',
        price: 10
    })

    await ticket.save();

    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id });

    expect(response.status).toEqual(201);
});

it('emits an order created event', async () => {
    const ticket = Ticket.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        title: 'any title',
        price: 10
    })

    await ticket.save();

    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id });

    expect(response.status).toEqual(201);
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});