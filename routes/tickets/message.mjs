export default async function (req, res) {
    const { user, body, params } = req;

    const boda = Object.keys(body);

    if( 
        !boda.includes('message') || 
        body.message.length < 3 || 
        body.message.length > 1026 
    ) return res.createResponse(400, 'error')

    await user.getTickets();
    
    let create = false;

    for (let i = 0; i < user.tickets.length; i++) {
        if( user.tickets[i].id != params.id )
            continue;
        
        await user.tickets[i].message(body.message);
        create = true;
        break;
    }

    if( !create )         
        return res.createResponse(404, 'Not found');

    res.createResponse(201, 'create');
   
}