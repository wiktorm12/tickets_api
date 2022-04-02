import database from "./database.mjs";


class Ticket {

    constructor(id, idAccount = null, title = null, status = null) {
        this.id = id;
        this.idAccount = idAccount;
        this.title = title;
        this.status = status;
        this.messages = {};
    }
    
    static async getAllIDs() {
        const result = await database('ticket').select('id');
        return result;
    }

    static async getAllIDsFromUser(id) {
        const result = await database('ticket').select('id').where('id_account', id);
        return result;
    }

    async save() {
        if( this.id == null ) {
            const q = await database('ticket').insert({ id_account: this.idAccount, title: this.title  });
            this.id = q[0];
        } else 
            await database('ticket').update({ id_account: this.idAccount, title: this.title, status: this.status.toString() }).where('id', this.id);

        return this;
    }

    async load(withMessage = true){
        const result = await database('ticket').select('*').where('id', this.id);

        if( result.length == 0 )
            return null;
        this.id = result[0].id;
        this.idAccount = result[0].id_account;
        this.title = result[0].title;
        this.status = result[0].status;
        if( withMessage ) {
            this.messages = {};
            const messagesID = await TicketMessage.getAllIDsFromTicket(this.id);



            for( let i = 0; i < messagesID.length; i++ ) {

                const message = new TicketMessage(messagesID[i].id);
                await message.load();
                this.messages[ message.id ] = message;
            }
        }
        return this;
    }

    async message(message) {
        const messageObj = new TicketMessage(null, this.idAccount, this.id, message);
        await messageObj.save();
        this.messages[messageObj.id] = messageObj;
    }  
}

class TicketMessage {

    constructor(id, userID = null, ticketID = null, message = null) {
        this.id = id;
        this.userID = userID;
        this.ticketID = ticketID;
        this.message = message;
    }

    
    async save() {
        if( this.id == null ) {
            const q = await database("ticket_message").insert({ id_sender: this.userID, id_ticket: this.ticketID, content: this.message });
            this.id = q[0];
        } else
            await database("ticket_message").update({ id_sender: this.userID, id_ticket: this.ticketID, content: this.message }).where({ id: this.id });
        
        return this;
    }
    
    
    async load() {
        const data = await database("ticket_message").where({ id: this.id });

        if( data.length == 0 )
            return null;
        
        this.id = data[0].id;
        this.userID = data[0].id_sender;
        this.ticketID = data[0].id_ticket;
        this.message = data[0].content;
        this.created_data = data[0].created_data;


        return this;
    }

    static async getAllIDsFromTicket(id) {
        const result = await database('ticket_message').select('id').where('id_ticket', id);


        return result;
    }

    async read(userID) {

        if( !await this.isRead(userID) )
            await database("ticket_read").insert({ id_message: this.id, id_user: userID });

        return true;
    }

    async isRead(userID) {
        const data = await database("ticket_read").where({ id_message: this.id, id_user: userID });
        return data.length > 0;
    }

}

export default Ticket;
export { TicketMessage };