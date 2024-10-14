import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import mongoose from "mongoose";
import signUpReturnCookie from "../../test/signin-return-cookie-helper";
import { natsWrapper } from "../../nats-wrapper";

it('returns a 401 if the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .send({
            title: 'test',
            price: 10
        });

    expect(response.status).toEqual(401);
});

it('returns a 404 if the provided ticket id does not exist', async () => {
    const cookie = await signUpReturnCookie();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 10
        });

    expect(response.status).toEqual(404);
});

it('returns a 401 if the user id is not the same as the ticket userId', async () => {
    const cookieValid = await signUpReturnCookie();
    const cookieInvalid = await signUpReturnCookie('123123123123', 'test1@test.com');

    await request(app)
        .post('/api/tickets')
        .set('Cookie', cookieValid)
        .send({
            title: 'test',
            price: 10
        })
        .expect(201);

    const getTicketResponse = await request(app)
        .get(`/api/tickets/`)
        .set('Cookie', cookieValid)
        .expect(200);

    const ticketId = getTicketResponse.body[0].id;

    const updateResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', cookieInvalid)
        .send({
            title: 'test',
            price: 20
        });

    expect(updateResponse.status).toEqual(401);
});

it('returns a 400 if the user provides an empty title', async () => {
    const cookie = await signUpReturnCookie();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: '',
            price: 10
        });

    expect(response.status).toEqual(400);
});

it('returns a 400 if the user does not provide a title', async () => {
    const cookie = await signUpReturnCookie();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            price: 10
        });

    expect(response.status).toEqual(400);
});

it('returns a 400 if the user does not provide a price', async () => {
    const cookie = await signUpReturnCookie();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test'
        });
});

it('returns a 400 if the user provides an invalid price', async () => {
    const cookie = await signUpReturnCookie();
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app)
        .put(`/api/tickets/${id}`)
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: -10
        });

    expect(response.status).toEqual(400);
});

it('updates a ticket if the provided ticket id is valid', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 10
        });

    const ticketId = response.body.id;

    const updateResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        });

    expect(updateResponse.status).toEqual(200);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${ticketId}`)
        .set('Cookie', cookie)
        .expect(200);

    expect(ticketResponse.body.title).toEqual('new title');
    expect(ticketResponse.body.price).toEqual(100);
});

it('publishes an event', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 10
        });

    const ticketId = response.body.id;

    const updateResponse = await request(app)
        .put(`/api/tickets/${ticketId}`)
        .set('Cookie', cookie)
        .send({
            title: 'new title',
            price: 100
        });

    expect(updateResponse.status).toEqual(200);
    expect(natsWrapper.client.publish).toHaveBeenCalled()
});