import User from "../../models/user.mjs";

export default async function (req, res) {
    const { body } = req;

    if (!body.login || !body.password) 
        return res.createResponse(400, 'Bad request', {});
        
    const userID = await User.getIDfromLogin(body.login);

    if (!userID)
        return res.createResponse(401, 'Unauthorized', {});

    const user = new User(userID);
    const log = await user.load();

    if (!log)
        return res.createResponse(500, 'Internal Server Error', {});

    const passCheck = await user.checkPassword(body.password);

    if (!passCheck)
        return res.createResponse(401, 'Unauthorized', {});

    const token = await user.generateToken();
    
    return res.createResponse(200, 'ok', { token });
}