import Ticket from "../../models/ticket.mjs";

export default async function (req, res) {
    const { user } = req;

    await user.getTickets();

    const messages = [];
    let tic = {};

    for (let i = 0; i < user.tickets.length; i++) {
        if( user.tickets[i].id != req.params.id ) 
            continue;
            
        const ticket = new Ticket(req.params.id);
        await ticket.load();

        tic = {
            id: ticket.id,
            title: ticket.title,
            status: ticket.status,
            idAccount: ticket.idAccount,
        };

        const mess = Object.values(ticket.messages);

        for (let j = 0; j < mess.length; j++) {
            const message = mess[j];

            await message.read(user.id);

            messages.push({
                id: message.id,
                text: message.message,
                date: message.created_data,
                user: message.userID,
            });
        }

        break;

    }

    res.createResponse(200, 'list', { 
        ticket: tic,
        messages: messages
     })
}