const express=require('express');
const routes=express.Router();
const adminController=require('../controller/admin/adminController');
const passport=require('passport');
const {adminnotauthorise}=require('../middleware/adminauthorise');
const {uplod}=require('../middleware/multer');
// const PDFDocument = require('pdfkit');
// const fs = require('fs');


const use=(fn)=>(req,res,next)=>
{
    Promise.resolve(fn(req,res,next)).catch(next);
}

routes.get('/admin',use(adminController.admindashboard));

routes.get('/chatAdmin',use(adminController.chatAdmin));

routes.get('/adminproduct',use(adminController.adminproduct));
routes.post('/adminproduct',uplod,use(adminController.createproduct));


routes.get('/admin/updateProduct/:id',use(adminController.updateget));
routes.post('/update/:id',uplod,use(adminController.updateproduct));
routes.get('/delete/:id',use(adminController.delete));

routes.get('/admin/ouruser',use(adminController.getouruser));
routes.get('/admin/orderdata',use(adminController.order));
routes.get('/admin/ordersroute',use(adminController.ordersroute));

routes.post('/admin/orderstatus',use(adminController.status));

routes.get("/orders/:id",adminnotauthorise,use(adminController.admincustomerordertrak));

routes.get('/adminregister',adminnotauthorise,use(adminController.adminregister));
routes.post('/adminregister',adminnotauthorise,use(adminController.adminregistercreat));

routes.get('/adminlogin',adminnotauthorise,use(adminController.adminlogin));
routes.post('/adminlogin',adminnotauthorise,use(passport.authenticate('local',{
    successRedirect:'/admin',
    successMessage:'/login',
    failureFlash:true
})));




module.exports=routes