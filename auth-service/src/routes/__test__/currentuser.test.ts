import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';

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

it('response is case-sensitive (currentUser, not currentuser)', async () => {
    const cookie = await signUpReturnCookie();

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .expect(200);

    expect(response.body.currentUser).toBeDefined();
    expect(response.body.currentuser).toBeUndefined();
});