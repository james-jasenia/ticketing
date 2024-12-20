import request from 'supertest';
import { app } from '../../app';

it('returns a 201 on successful signup', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201)
})

it('returns a 400 given an invalid email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'testest.com',
            password: 'password'
        })
        .expect(400)
})

it('returns a 400 given an invalid password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: '12'
        })
        .expect(400)
})

it('returns a 400 given a missing email', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            password: '12'
        })
        .expect(400)
})

it('returns a 400 given a missing password', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com'
        })
        .expect(400)
})

it('returns a 400 given an empty body', async () => {
    return request(app)
        .post('/api/users/signup')
        .send({})
        .expect(400)
})

it('returns a 400 on duplicate email', async () => {
    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(201)

    await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(400)
});

it('sets a cookie after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(201)

    expect(response.get('Set-Cookie')).toBeDefined();
});

it('returns email in the body after successful signup', async () => {
    const expectedEmail = "test@test.com"

    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: expectedEmail,
            password: 'password'
        })
        .expect(201)

    expect(response.body.email).toEqual(expectedEmail);
});

it('returns an id in the body after successful signup', async () => {
    const response = await request(app)
        .post('/api/users/signup')
        .send({
            email: "test@test.com",
            password: 'password'
        })
        .expect(201)

    expect(response.body.id).toBeDefined();
});