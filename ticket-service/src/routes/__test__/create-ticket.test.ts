import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';

it('has a route handler listening to /api/tickets for post requests', async () => {
    const response = await request(app).post('/api/tickets').send({});
    expect(response.status).not.toEqual(404);
});

it('will return a 401 if the user is not signed in given valid data is provided', async () => {
    const response = await request(app)
        .post('/api/tickets')
        .send({
            title: 'test',
            price: 10
        });

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