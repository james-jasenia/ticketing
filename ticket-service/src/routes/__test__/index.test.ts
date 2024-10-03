import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';

function createTicket(cookie: string) {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', cookie)
        .send({
            title: 'test',
            price: 10
        });
}

it('can fetch a list of tickets', async () => {
    const cookie = await signUpReturnCookie();

    await createTicket(cookie[0]);
    await createTicket(cookie[0]);
    await createTicket(cookie[0]);

    const response = await request(app).get('/api/tickets').send();
    
    expect(response.status).toEqual(200);
    expect(response.body.length).toEqual(3);
});
