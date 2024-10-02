import request from 'supertest';
import { app } from '../app';

async function signUpReturnCookie(
    email = 'test@test.com',
    password = 'test1234!'
) {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: email,
            password: password
        })
        .expect(201)

    const cookie = response.get('Set-Cookie')

    if (!cookie) {
        throw new Error("Cookie not set after signup");
    }

    return cookie
}

export default signUpReturnCookie;