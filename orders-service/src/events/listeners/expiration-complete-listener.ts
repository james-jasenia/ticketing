import { Listener, OrderStatus, Subjects } from "@jjgittix/common";
import { ExpirationCompleteEvent } from "@jjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";
import OrderCancelledPublisher from "../publishers/order-cancelled-publisher";
import { natsWrapper } from "../../nats-wrapper";

class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
    queueGroupName: string = this.queueGroupName;
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

    async onMessage(data: ExpirationCompleteEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findById(data.orderId).populate('ticket');

        if (!order) {
            throw new Error('Order not found')
        }
        
        if (order.status === OrderStatus.Complete) {
            return msg.ack();
        }

        order.set({
            status: OrderStatus.Cacnelled
        })

        await order.save();

        await new OrderCancelledPublisher(natsWrapper.client).publish({
            id: order.id,
            version: order.version,
            ticket: {
                id: order.ticket.id
            }
        })

        msg.ack();
    }
}

export default ExpirationCompleteListener