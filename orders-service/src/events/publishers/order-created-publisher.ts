import { Publisher } from "@jjgittix/common";
import { OrderCreatedEvent } from "@jjgittix/common";
import { Subjects } from "@jjgittix/common";

class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
    subject: Subjects.OrderCreated  = Subjects.OrderCreated;
}

export default OrderCreatedPublisher;
