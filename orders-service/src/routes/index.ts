import express, { Request, Response } from "express";
import { requireAuth } from "@jjgittix/common";
import { Order } from "../models/order";

const router = express.Router()

router.get('/api/orders', requireAuth, async (req: Request, res: Response) => {
    const userId = req.currentUser!.id

    const orders = await Order
        .find({ userId: userId })
        .populate('ticket') // populate data from the ticket document.

    res.send({ orders: orders })
})

export { router as indexOrderRouter }