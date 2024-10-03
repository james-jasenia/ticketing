import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';
import mongoose from 'mongoose';

it('returns a 404 if the ticket is not found', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();
    const response = await request(app).get(`/api/tickets/${id}`).send();
    expect(response.status).toEqual(404);
});

it('returns the ticket if the ticket is found', async () => {
    const title = 'test';
    const price = 10;

    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title,
            price
        });

    expect(response.status).toEqual(201);

    const ticketResponse = await request(app)
        .get(`/api/tickets/${response.body.id}`)
        .send();

    expect(ticketResponse.status).toEqual(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
});