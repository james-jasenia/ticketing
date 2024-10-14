import { Publisher, Subjects, TicketUpdatedEvent } from '@jjgittix/common'

class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
    readonly subject = Subjects.TicketUpdated
}

export default TicketUpdatedPublisher;