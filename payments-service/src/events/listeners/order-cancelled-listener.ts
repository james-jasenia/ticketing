import { Listener, OrderStatus } from "@jjgittix/common";
import { OrderCancelledEvent } from "@jjgittix/common";
import { Subjects } from "@jjgittix/common";
import { queueGroupName } from "./queue-groups-name";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";


class OrderCancelledListener extends Listener<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
    queueGroupName: string = queueGroupName;
    
    async onMessage(data: OrderCancelledEvent['data'], msg: Message): Promise<void> {
        const order = await Order.findOne({
            _id: data.id,
            version: data.version - 1
        })

        if (!order) {
            throw new Error('Order not found')
        }

        order.set({ status: OrderStatus.Cacnelled });

        await order.save();

        msg.ack();
    }
}

export default OrderCancelledListener;