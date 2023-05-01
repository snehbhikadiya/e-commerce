const express=require('express');
const routes=express.Router();
const auth=require('./auth');
const dashboard=require('./dashboard');
const admin=require('./admin');

routes.use('/',auth);
routes.use('/',dashboard);
routes.use('/',admin);



module.exports=routes