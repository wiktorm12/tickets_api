import Router from 'express';
const router = Router();

router.use(
	function( req, res, next ){
		res.createResponse = function( code = 200, message = 'ok', data = {} ){
			return res.status( code ).json({
				code,
				message,
				data
			});
		}
		next();
	}
)



import user_login from './routes/users/login.mjs';
router.post('/user/login', user_login);

router.use(function(req,res){
    res.status(404).json({
        code: 400,
        message: 'Not found',
        data: {}
    })
})

router.use(function(err,req,res,text){
	console.log(err);
	res.status(err.status || 500).json({
		code: 500,
		message:	'Internal server error',
		data: {}
	});
})

export default router;