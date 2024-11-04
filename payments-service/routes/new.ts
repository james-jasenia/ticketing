import express, { Request, Response } from "express";
import { body } from "express-validator";
import { requireAuth, validateRequest, BadRequestError, NotFoundError, NotAuthorisedError, OrderStatus } from "@jjgittix/common";
import { Order } from "../src/models/order";

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

    res.send({})
})

export { router as createChargeRouter };
