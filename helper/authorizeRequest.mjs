import User from "../models/user.mjs";

const xf = async function( req, res, next ){

    const auth = req.headers.authorization;
    const authorization = auth.split(' ');
    const token = authorization[1];
    const type = authorization[0];

    if (type !== 'Bearer')
        return res.createResponse(401, 'Unauthorized', {});

    const user = await User.getFromToken(token);

    if (!user)
        return res.createResponse(401, 'Unauthorized', {});

    req.user = user;

    next();
}

export default xf;