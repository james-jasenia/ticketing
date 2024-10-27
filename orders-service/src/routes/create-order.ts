import express, { Request, Response } from "express";
import { body } from "express-validator";
import { BadRequestError, NotFoundError, requireAuth, validateRequest } from "@jjgittix/common";
import { Ticket } from "../models/ticket";
import { Order } from "../models/order";
import { OrderStatus } from "@jjgittix/common";
import { natsWrapper } from "../nats-wrapper";
import OrderCreatedPublisher from "../events/publishers/order-created-publisher";


const router = express.Router()
const TICKET_EXPIRATION_WINDOW_SECONDS = 15 * 60 // Belongs in an external config file.

const validators = [
    body('ticketId')
        .not()
        .isEmpty()
        .withMessage('Ticket ID must be provided.'),
]

router.post('/api/orders', requireAuth, validators, validateRequest, async (req: Request, res: Response) => {

    const { ticketId } = req.body;

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) { throw new NotFoundError(); }

    const isReserved = await ticket.isReserved();

    if (isReserved) { throw new BadRequestError("Ticekt is already reserved"); }

    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + TICKET_EXPIRATION_WINDOW_SECONDS);

    const order = Order.build({
        userId: req.currentUser!.id,
        status: OrderStatus.Created,
        expiresAt: expiration,
        ticket: ticket
    });

    await order.save();

    new OrderCreatedPublisher(natsWrapper.client).publish({
        id: order.id,
        status: order.status,
        userId: order.userId,
        expiresAt: order.expiresAt.toISOString(),
        ticket: {
            id: ticket.id,
            price: ticket.price
        }
    });

    res.status(201).send(order);
})

export { router as createOrderRouter }