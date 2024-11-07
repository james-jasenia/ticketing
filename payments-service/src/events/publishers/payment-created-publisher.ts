import { Subjects, Publisher, PaymentCreatedEvent } from "@jjgittix/common";

class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
    subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}

export default PaymentCreatedPublisher