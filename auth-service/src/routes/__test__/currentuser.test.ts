import request from 'supertest';
import { app } from '../../app';

it('responds with details about the current user', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(201)

    const cookie = response.get('Set-Cookie')

    if (!cookie) {
        throw new Error("Cookie not set after signup");
    }

    const response2 = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response2.body.currentUser.email).toEqual('test@test.com');
    expect(response2.body.currentUser.id).toBeDefined();
});
