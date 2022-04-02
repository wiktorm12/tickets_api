import Ticket from "../../models/ticket.mjs";

export default async function (req, res) {
    const { user, body, params } = req;

    if( !user.admin )
        return res.createResponse(403, 'error');

    const boda = Object.keys(body);

    if( 
        !boda.includes('status') || 
        ![0, 1, 2, 3].includes(body.status)
    ) return res.createResponse(400, 'error')

    const ticket = new Ticket(params.id);
    await ticket.load();

    if( ticket.idAccount == null )
        return res.createResponse(404, 'Not found');

    ticket.status = body.status;
    await ticket.save();


    res.createResponse(201, 'create');
   
}