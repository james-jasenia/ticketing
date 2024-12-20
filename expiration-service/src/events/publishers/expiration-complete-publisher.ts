import { Subjects, Publisher, ExpirationCompleteEvent } from "@jjgittix/common";

class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
    subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}

export default ExpirationCompletePublisher