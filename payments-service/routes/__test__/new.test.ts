import request from "supertest";
import { app } from "../../src/app";
import signUpReturnCookie from "../../src/test/signin-return-cookie-helper";
import mongoose from "mongoose";
import { Order } from "../../src/models/order";
import { OrderStatus } from "@jjgittix/common";

it('returns a 404 when purchasing an order that does not exist', async () => {
    const cookie = await signUpReturnCookie();

    await request(app)
        .post('/api/payments/')
        .set('Cookie', cookie)
        .send({
            token: 'asdf',
            orderId: new mongoose.Types.ObjectId().toHexString()
        })
        .expect(404)
})  

it('returns a 401 when purchasing an order that doesnt belong to the user', async () => {
    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: new mongoose.Types.ObjectId().toHexString(),
        version: 0,
        price: 10,
        status: OrderStatus.Created
    })

    await order.save();

    const cookie = await signUpReturnCookie();

    await request(app)
        .post('/api/payments/')
        .set('Cookie', cookie)
        .send({
            token: 'asdf',
            orderId: order.id
        })
        .expect(401)
})

it('returns a 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
        id: new mongoose.Types.ObjectId().toHexString(),
        userId: userId,
        version: 0,
        price: 10,
        status: OrderStatus.Cacnelled
    })

    await order.save();

    const cookie = await signUpReturnCookie(`${userId}`);

    await request(app)
        .post('/api/payments/')
        .set('Cookie', cookie)
        .send({
            token: 'asdf',
            orderId: order.id
        })
        .expect(400)
})