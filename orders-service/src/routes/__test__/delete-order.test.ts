import request from 'supertest';
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import signUpReturnCookie from "../../test/signin-return-cookie-helper";
import { OrderStatus } from '@jjgittix/common';
import { Order } from '../../models/order';
import { natsWrapper } from '../../nats-wrapper';

it('marks an order as cancelled', async () => {
    const ticket = await Ticket.build({
        title: 'title',
        price: 10
    })

    await ticket.save();

    const cookie = await signUpReturnCookie();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200)

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cacnelled)
});

it('emits an order cancelled event', async () => {
    const ticket = await Ticket.build({
        title: 'title',
        price: 10
    })

    await ticket.save();

    const cookie = await signUpReturnCookie();

    const { body: order } = await request(app)
        .post('/api/orders')
        .set('Cookie', cookie)
        .send({ ticketId: ticket.id })
        .expect(201)

    await request(app)
        .delete(`/api/orders/${order.id}`)
        .set('Cookie', cookie)
        .send()
        .expect(200)

    const updatedOrder = await Order.findById(order.id);

    expect(updatedOrder?.status).toEqual(OrderStatus.Cacnelled)
    expect(natsWrapper.client.publish).toHaveBeenCalled();
});