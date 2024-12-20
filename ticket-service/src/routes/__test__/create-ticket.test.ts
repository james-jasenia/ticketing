import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';
import { Ticket } from '../../models/ticket';
import { natsWrapper } from '../../nats-wrapper';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
});

it('will return a 401 if the user is not signed in given valid data is provided', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({});

    expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({});

    expect(response.status).not.toEqual(401);
});

it('returns an error if an invalid title is provided', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            price: 10
        });

    expect(response.status).toEqual(400);
});

it('returns an error if an invalid price is provided', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: -10
        });

    expect(response.status).toEqual(400);
});

it('creates a ticket with valid inputs', async () => {
    const cookie = await signUpReturnCookie();

    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    const title = 'test';
    const price = 10;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title,
            price
        });

    expect(response.status).toEqual(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].title).toEqual(title);
    expect(tickets[0].price).toEqual(price);
});

it('publishes an event', async () => {
    const cookie = await signUpReturnCookie();
    
    const title = 'test';
    const price = 10;

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title,
            price
        });

    expect(response.status).toEqual(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled()
});