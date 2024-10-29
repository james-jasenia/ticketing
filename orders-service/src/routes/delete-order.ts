import express, { Request, Response } from "express";
import { Order } from "../models/order";
import { NotAuthorisedError, NotFoundError, OrderStatus } from "@jjgittix/common";
import { requireAuth } from "@jjgittix/common";
import OrderCancelledPublisher from "../events/publishers/order-cancelled-publisher";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router()

// This should be a PATCH, not a delete.
router.delete('/api/orders/:orderId', requireAuth, async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
        throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorisedError();
    }

    order.status = OrderStatus.Cacnelled
    await order.save();

    new OrderCancelledPublisher(natsWrapper.client).publish({
        id: order.id,
        version: order.version,
        ticket: {
            id: order.ticket.id
        }
    });

    res.send(order);
})

export { router as deleteOrderRouter }