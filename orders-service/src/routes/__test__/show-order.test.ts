import request from 'supertest';
import { app } from '../../app';
import signUpReturnCookie from '../../test/signin-return-cookie-helper';
import mongoose from 'mongoose';
import { Ticket } from '../../models/ticket';

const buildTicket = async (title: string, price: number) => {
    const ticket = Ticket.build({
        title: title,
        price: price
    })

    await ticket.save();

    return ticket
}

it('fetches an order', async () => {
    const cookie = await signUpReturnCookie();

    const ticket = await buildTicket(
        "new ticket",
        20
    )
    

    const { body: order } = await request(app)
        .post('/api/orders/')
        .set("Cookie", cookie)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .get(`/api/orders/${order.id}/`)
        .set("Cookie", cookie)
        .send()
        .expect(200)
    
})

it('returns a 401 if one user tries to return another users order', async () => {
    const cookie = await signUpReturnCookie();

    const ticket = await buildTicket(
        "new ticket",
        20
    )

    const { body: order } = await request(app)
        .post('/api/orders/')
        .set("Cookie", cookie)
        .send({ ticketId: ticket.id })
        .expect(201)

    const cookieTwo = await signUpReturnCookie('anyId', 'another@gmail.com')

    await request(app)
        .get(`/api/orders/${order.id}/`)
        .set("Cookie", cookieTwo)
        .send()
        .expect(401)
    
})