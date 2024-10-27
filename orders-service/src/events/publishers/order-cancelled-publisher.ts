import { Publisher } from "@jjgittix/common";
import { OrderCancelledEvent } from "@jjgittix/common";
import { Subjects } from "@jjgittix/common";

class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
    subject: Subjects.OrderCancelled  = Subjects.OrderCancelled;
}

export default OrderCancelledPublisher;
