import request from 'supertest';
import { app } from '../../app';

it('returns a 400 with an error array when an email that does not exist is supplied', async () => {
    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(400)

    expect(response.body).toEqual({
        errors: [
            {
                message: "Invalid credentials"
            }
        ]
    });
})