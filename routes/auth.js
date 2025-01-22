const express = require("express");
const routes = express.Router();
const authController = require("../controller/user/authController");
const validation = require("../utils/requestvalidation");
const { notautherise, authorise, adminOnly } = require("../middleware/authorise");
const passport = require("passport");
// authController.linkdead();

const use = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
routes.get("/dashboard", use(authController.dashboard));
routes.post("/dashboard", use(authController.showdasboard));

routes.get("/details", use(authController.details));

routes.get("/shop", use(authController.shop));

routes.get("/shopingcart", use(authController.shopingcart));

  routes.get("/checkout", use(authController.checkout));

  routes.post("/payment",use(authController.payment));

routes.get("/chat", use(authController.chat));

routes.get("/register", notautherise, use(authController.getregister));
routes.post(
  "/register",
  notautherise,
  validation("User"),
  use(authController.register)
);

routes.get("/login", notautherise, use(authController.getlogin));
routes.post(
  "/login",
  notautherise,
  use(
      passport.authenticate("local", {
          successRedirect: "/cart", // Redirect to the cart page upon successful login
          failureRedirect: "/login", // Redirect back to the login page upon failed login
          failureFlash: true
      })
  )
);


routes.get("/forget", use(authController.forget));
routes.post("/forget", use(authController.createforget));

routes.get("/reset", use(authController.reset));
routes.post("/reset", use(authController.newpassword));

module.exports = routes;
