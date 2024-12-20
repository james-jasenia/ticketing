import { Listener, OrderCreatedEvent, OrderStatus, Subjects } from "@jjgittix/common";
import { queueGroupName } from "./queue-group-name";
import { Message } from "node-nats-streaming";
import expirationQueue from "../../queues/expiration-queue";

class OrderCreatedListener extends Listener<OrderCreatedEvent> {
    subject: Subjects.OrderCreated = Subjects.OrderCreated;
    queueGroupName: string = queueGroupName;

    async onMessage(data: OrderCreatedEvent['data'], msg: Message): Promise<void> {
        const delay = new Date(data.expiresAt).getTime()- new Date().getTime();

        await expirationQueue.add({
            orderId: data.id
        },
        {
            delay
        });
        msg.ack();
    }
}

export default OrderCreatedListener;