import { Publisher, Subjects, TicketCreatedEvent } from '@jjgittix/common'

class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
    readonly subject = Subjects.TicketCreated
}

export default TicketCreatedPublisher;