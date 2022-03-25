import database from "./database.mjs";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

class User {

    constructor(id, login = null, admin = false) {
        this.id = id;
        this.login = login;
        this.admin = admin;
    }

    setPassword(password) {
        this.password = bcrypt.hashSync(password, 5);
    }

    async checkPassword(password, action = false) {
        if( this.password == null )
            await this.load();

        const result = bcrypt.compareSync(password, this.password);

        if( !action || result)
            return result;

        this.admin = null;
        this.login = null;
        this.password = null;
    
        return result;
    }

    async save() {
        if( this.id == null ) {
            const q = await database('users').insert({ login: this.login, password: this.password, admin: this.admin });
            this.id = q[0];
        } else 
            await database('users').update({ login: this.login, password: this.password, admin: this.admin }).where('id', this.id);

        return this;
    }

    async load() {
        const data = await database('users').where('id', this.id);

        if( data.length == 0 )
            return null;

        this.id = data[0].id;
        this.login = data[0].login;
        this.password = data[0].password;
        this.admin = data[0].admin;

        return this;
    }

    async generateToken() {
        const token = jwt.sign({ id: this.id, hash: this.password }, process.env.JWT_SECRET);
        return token;
    }

    static async getFromToken(token) {
        try {
            const data = jwt.verify(token, process.env.JWT_SECRET);
            if( !data.id || !data.hash )
                return null;

            const user = new User(data.id);
            await user.load();

            if( user.password != data.hash )
                return null;

            return user;
        } catch (error) {
            return null;
        }
    }

    static async getIDfromLogin(login) {
        const data = await database('users').select('id').where('login', login);

        if( data.length == 0 )
            return null;

        return data[0].id;
    }

}

export default User;