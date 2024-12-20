import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorisedError, OrderStatus } from "@jjgittix/common";
import { Order } from "../models/order";
import { stripe } from "../stripe";
import { Payment } from "../models/payment";
import PaymentCreatedPublisher from "../events/publishers/payment-created-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

const validator = [
    body('token')
        .not()
        .isEmpty(),
    body('orderId')
        .not()
        .isEmpty()
]

router.post('/api/payments/', requireAuth, validator, validateRequest, async (req: Request, res: Response) => {
    const { token, orderId } = req.body;
    const order = await Order.findById(orderId);

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorisedError();
    }

    if (order.status === OrderStatus.Cacnelled) {
        throw new BadRequestError('Order has been cancelled');
    }
    
    const charge = await stripe.charges.create(
        {
            amount: order.price * 100,
            currency: 'aud',
            source: token
        }
    )

    const payment = Payment.build({
        orderId: order.id,
        stripeId: charge.id
    })

    await payment.save();

    await new PaymentCreatedPublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId
    })

    res.status(201).send({ id: payment.id })
})

export { router as createChargeRouter };
