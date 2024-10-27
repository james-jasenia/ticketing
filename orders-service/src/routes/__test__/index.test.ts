import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';

const buildTicket = async (title: string, price: number) => {
    const ticket = Ticket.build({
        title: title,
        price: price
    })

    await ticket.save();

    return ticket
}

it('has a route handler listening to /api/orders for get requests', async () => {
    const ticketId = new mongoose.Types.ObjectId();

    const response = await request(app)
        .get('/api/orders')
        .send({ ticketId });

    expect(response.status).not.toEqual(404);
});

it('will return a 401 if the user is not signed in given valid data is provided', async () => {
    const response = await request(app)
        .get('/api/orders')

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', cookie)

    expect(response.status).not.toEqual(401);
});


it('fetches orders for a specific user', async () => {
    const userOneCookie = await signUpReturnCookie('1', 'testOne@gmail.com');
    const userTwoCookie = await signUpReturnCookie('2', 'testTwo@gmail.com');

    // Create three tickets
    const ticketOne = await buildTicket('ticket one', 1);
    const ticketTwo = await buildTicket('ticket two', 2);
    const ticketThree = await buildTicket('ticket three', 3);

    // Create 1 ticket for User #1
    await request(app)
        .post('/api/orders')
        .set('Cookie', userOneCookie)
        .send({ ticketId: ticketOne.id })
        .expect(201)

    // Create 2 tickets for User #2

    await request(app)
        .post('/api/orders')
        .set('Cookie', userTwoCookie)
        .send({ ticketId: ticketTwo.id })
        .expect(201)

    await request(app)
        .post('/api/orders')
        .set('Cookie', userTwoCookie)
        .send({ ticketId: ticketThree.id })
        .expect(201)

    const response = await request(app)
        .get('/api/orders')
        .set('Cookie', userTwoCookie)
        .expect(200)

    const orders = response.body.orders

    expect(orders.length).toEqual(2);

    expect(orders[0].ticket.title).toEqual('ticket two');
    expect(orders[0].ticket.price).toEqual(2);
    
    expect(orders[1].ticket.title).toEqual('ticket three');
    expect(orders[1].ticket.price).toEqual(3);
    // Make a request for orders for User #2
})

it.todo('it emits an event')