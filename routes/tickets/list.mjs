

export default async function (req, res) {
    const { user } = req;

    await user.getTickets(true);

    const tickets = [];

    for (let i = 0; i < user.tickets.length; i++) {
        const ticket = user.tickets[i];
        const lastMessage = Object.values(ticket.messages).splice(-1)[0];
        if( lastMessage != undefined )
            lastMessage['readed'] = await lastMessage.isRead(user.id)
            
        tickets.push({
            id: ticket.id,
            title: ticket.title,
            status: ticket.status,
            messages: Object.values(ticket.messages).length,
            lastMessage
        });
    }

    res.createResponse(200, 'list', {tickets})
}