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

it('returns a 400 when an incorrect password is supplied', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'incorrectPassword'
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

it('it responds with a cookie after successful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)

    expect(response.get('Set-Cookie')).toBeDefined();
})

it('it returns with the users email on successful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)

    expect(response.body.email).toEqual('test@test.com')
})

it('it returns with an id on successful signin', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)

    const response = await request(app)
        .post('/api/users/signin')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(200)

    expect(response.body.id).toBeDefined();
})