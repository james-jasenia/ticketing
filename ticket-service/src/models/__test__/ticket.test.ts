import { Ticket } from "../ticket";


// When created, the ticket will have an initial version number. Because we are creating two instances, when we go to save the second instance, there will be an issue with the version number.
// The reason is because we have version bumped when we save the first instance. The second instance will be a version behind so there will be a conflict.
it('implements optimistic concurrency control', async () =>  {
    const ticket = Ticket.build({
        title: 'any title',
        userId: 'any user id',
        price: 10
    })

    await ticket.save();

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);

    firstInstance!.set({ price: 10 })
    secondInstance!.set({ price: 15 })

    await firstInstance!.save();
    
    try {
        await secondInstance!.save();
    } catch (err) {
        return;
    }

    throw new Error('Test should have thrown earlier.')
});

it('increments the version number on multiple saves', async () =>  {
    const ticket = Ticket.build({
        title: 'any title',
        userId: 'any user id',
        price: 10
    })

    await ticket.save();

    expect(ticket.version).toEqual(0);

    await ticket.save();

    expect(ticket.version).toEqual(1);

    await ticket.save();

    expect(ticket.version).toEqual(2);
});