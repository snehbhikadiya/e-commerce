const express = require("express");
const routes = express.Router();
const dashboardController = require("../controller/dashboard/dashboard");
const { authorise } = require("../middleware/authorise");
// const {cartauthorization}=require('../middleware/authorise');

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

routes.get("/cart", authorise, use(dashboardController.cart));
routes.post("/updatecart", use(dashboardController.update));
routes.post("/order", authorise, use(dashboardController.store));
routes.get("/orders", authorise, use(dashboardController.customerorder));
routes.get("/orders/:id", authorise, use(dashboardController.customerordertrak));

routes.get("/logout", use(dashboardController.logout));

module.exports = routes;
