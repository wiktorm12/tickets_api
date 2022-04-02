const xf = function( req, res, next ){
    res.createResponse = function( code = 200, message = 'ok', data = {} ){
        return res.status( code ).json({
            code,
            message,
            data
        });
    }
    next();
}

export default xf;