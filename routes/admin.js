const express = require("express");
const routes = express.Router();
const adminController = require("../controller/admin/adminController");
const passport = require("passport");
const { notautherise, authorise, adminOnly } = require("../middleware/authorise");
// const { notautherise, authorise } = require("../middleware/adminauthorise");
const { uplod } = require("../middleware/multer");
// const PDFDocument = require('pdfkit');
// const fs = require('fs');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

routes.get("/admin", adminOnly,adminController.admindashboard);

routes.get("/chatAdmin",use(adminController.chatAdmin));

routes.get("/adminproduct",use(adminController.adminproduct));
routes.post("/adminproduct", uplod, use(adminController.createproduct));

routes.get("/admin/updateProduct/:id", use(adminController.updateget));
routes.post("/update/:id", uplod, use(adminController.updateproduct));
routes.get("/delete/:id", use(adminController.delete));

routes.get("/admin/ouruser", use(adminController.getouruser));
routes.get("/admin/orderdata", use(adminController.order));
routes.get("/admin/ordersroute",use(adminController.ordersroute));

routes.post("/admin/orderstatus", use(adminController.status));

routes.get("/orders/:id", use(adminController.admincustomerordertrak));




  

module.exports = routes;
