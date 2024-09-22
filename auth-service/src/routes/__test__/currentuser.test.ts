import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signun-return-cookie-helper';
import { response } from 'express';

it('responds with details about the current user', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser.email).toEqual('test@test.com');
    expect(response.body.currentUser.id).toBeDefined();
});

it('responds with null if the user is not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .expect(200);

    expect(response.body.currentuser).toBeUndefined();
});

