import { Listener, OrderStatus } from "@jjgittix/common";
import { PaymentCreatedEvent } from "@jjgittix/common";
import { Subjects } from "@jjgittix/common";
import { Message } from "node-nats-streaming";
import { Order } from "../../../../payments-service/src/models/order";

class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
    queueGroupName: string = this.queueGroupName;
    
    async onMessage(data: PaymentCreatedEvent['data'], msg: Message): Promise<void> {

        const order = await Order.findById(data.orderId)

        if (!order) {
            throw new Error('Order not found')
        }

        order.set({
            status: OrderStatus.Complete
        })

        await order.save();

        msg.ack();
    }
}

export default PaymentCreatedListener