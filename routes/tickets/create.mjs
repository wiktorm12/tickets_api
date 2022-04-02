

export default async function (req, res) {
    const { user, body } = req;

    const boda = Object.keys(body);

    if( 
        !boda.includes('title') || 
        !boda.includes('message') || 
        body.title.length < 3  ||  
        body.title.length > 256 || 
        body.message.length < 3 || 
        body.message.length > 1026 
    ) return res.createResponse(400, 'error')

    const title = await user.createTicket(body.title);
    
    await title.message(body.message);

    res.createResponse(201, 'create');
}