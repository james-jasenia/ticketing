import { Listener, OrderStatus } from "@jjgittix/common";
import { OrderCreatedEvent } from "@jjgittix/common";
import { Subjects } from "@jjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../models/order";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = this.queueGroupName;
    
    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const order = Order.build({
            id: data.id,
            price: data.ticket.price,
            status: data.status,
            userId: data.userId,
            version: data.version
        });

        await order.save();

        msg.ack();
    }
}

export default OrderCreatedListener