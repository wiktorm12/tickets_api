import Router from 'express';
const router = Router();

import createResponse from './helper/createResponse.mjs';
router.use( createResponse )

import authorizeRequest from './helper/authorizeRequest.mjs';

import user_login from './routes/users/login.mjs';
router.post('/user/login', user_login);


import ticket_list from './routes/tickets/list.mjs';
router.get( '/tickets/list',  authorizeRequest, ticket_list );

import ticket_messages from './routes/tickets/messages.mjs';
router.get( '/tickets/message/:id',  authorizeRequest, ticket_messages );

import ticket_create from './routes/tickets/create.mjs';
router.post( '/tickets',  authorizeRequest, ticket_create );

import ticket_message from './routes/tickets/message.mjs';
router.post( '/tickets/message/:id',  authorizeRequest, ticket_message );

import ticket_status from './routes/tickets/status.mjs';
router.patch( '/tickets/admin/status/:id',  authorizeRequest, ticket_status );

router.use(function(req,res){
    res.status(404).json({
        code: 404,
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