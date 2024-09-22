import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signun-return-cookie-helper';

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
