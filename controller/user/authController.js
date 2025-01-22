const { STRIPE_PUBLIC_KEY, STRIPE_SECRET_KEY } = process.env;
const stripe = require("stripe")(STRIPE_SECRET_KEY);
const User = require("../../model/user");
const Product = require("../../model/productModel");
const mailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const passport = require('passport');

//=============dashboard============//

//=====dashboard==get===============//
exports.dashboard = async (req, res) => {
  await Product.find().then(function (product) {
    console.log(product);
    console.log('session.userName :>> ', req.session);
    res.render("dashboard", { product: product });
  });
};

//=====dashboard==post===============//
exports.showdasboard = async (req, res) => {
  const { userId } = req.session;
  if (!userId) {
    return res.redirect("/login");
  }
  return res.redirect("/cart");
};

//=========cart details=======//

//=======cart====get===========//
exports.details = async (req, res) => {
  const product = await Product.find();
  res.render("details", { product: product });
};

//=========shop============//

//=========shop===get======//
exports.shop = async (req, res) => {
  res.render("shop");
};

//=========shopingcart===========//

//=========shopingcart===get======//

exports.shopingcart = async (req, res) => {
  res.render("shopingcart");
};

//=========checkout===========//

//=========checkout===get======//
function calculateTotalAmount(cart, additionalCharge = 0) {
  let totalAmount = cart.totalprice * cart.totalqty;

  // Add additional charge
  totalAmount += additionalCharge;

  return totalAmount;
}

exports.checkout = async (req, res) => {
  try {
    if (!req.session.cart || !req.session.cart.items) {
      return res.redirect("/dashboard");
    }

    const totalAmount = calculateTotalAmount(req.session.cart, 10);

    if (isNaN(totalAmount)) {
      console.error("Error: Total amount is NaN");
      return res.status(500).send({ error: "Invalid total amount" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalAmount * 100,
      currency: "inr",
      description: "Product purchase",
    });

    res.render("checkout", {
      cart: req.session.cart,
      totalAmount,
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).send({ error: "Unable to process checkout" });
  }
};

exports.payment = async (req, res) => {
  try {
    const token = req.body.stripeToken;
    const amount = req.body.amount;

    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: "inr",
      description: "Product purchase",
      source: token,
      customer:req.passport.user,
    });

    res.redirect("/dashboard");
  } catch (error) {
    console.error("Error in payment:", error);
    res.redirect("/checkout");
  }
};

//=========chat-box===get======//
exports.chat = async (req, res) => {
  const user = await User.find();
  res.render("chat", { user: user });
};

//============register-User============//

//=====register==get===============//
exports.getregister = async (req, res) => {
  res.render("register");
};

//=====register==post===============//
exports.register = async (req, res) => {
  const { userName, birthDate, email, password } = req.body;

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the salt rounds

    // Create a new user with the hashed password
    const newUser = await User.create({
      userName,
      birthDate,
      email,
      password: hashedPassword // Store the hashed password
    });

    req.flash("success", "Registered successfully");
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering user:", error);
    req.flash("error", "An error occurred while registering user");
    res.redirect("/register");
  }
};

//===========login-User==============//

//=====login==get===============//
exports.getlogin = async (req, res) => {
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("login", { success, error });
};

//=====login==post===============//
exports.login = async (req, res, next) => {
  passport.authenticate('local', async (err, user, info) => {
    if (err) {
      console.error("Error logging in user:", err);
      return res.redirect("/login");
    }
    if (!user) {
      // If user not found, redirect to register page
      return res.redirect("/register");
    }
    try {
      // Compare the provided password with the hashed password
      const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

      if (!isPasswordValid) {
        // If password is invalid, redirect back to login page
        return res.redirect("/login");
      }

      // Store user id in session upon successful login
      req.session.userId = user.id;
      // Redirect based on user type
      if (user.type === 'admin') {
        return res.redirect('/admin');
      } else {
        return res.redirect("/cart");
      }
    } catch (error) {
      console.error("Error logging in user:", error);
      return res.redirect("/login");
    }
  })(req, res, next);
};


//=============forget password==============//

const compny_email = process.env.EMAIL;
const compny_password = process.env.EMAIL_PASSWORD;

let transpoter = mailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: compny_email,
    pass: compny_password,
  },
});

//====forget===get===============//

exports.forget = async (req, res) => {
  res.render("forget");
};

//=====forget==post===============//

exports.createforget = async (req, res) => {
  const email = req.body.email;
  const findemail = await User.findOne({ email });
  if (!findemail) {
    return res.redirect("/login");
  }

  const payload = {
    id: findemail.id,
  };
  const token = await jwt.sign(payload, process.env.SECREAT, {
    expiresIn: "24h",
  });

  const info = await transpoter.sendMail({
    from: `E-shoopy${compny_email}`,
    to: email,
    subject: "reset your password",
    html: `<a href="http://localhost:3000/reset?token=${token}">reset password</a>`,
  });
  console.log(info);
  return res.redirect("/login");
};

// let obj=req.body
// let array=[]
// obj.
//============reset password============//

//=====reset==get===============//

exports.reset = async (req, res) => {
  const token = req.query.token;
  res.render("reset", { token });
};

//=====reset==post===============//

exports.newpassword = async (req, res) => {
  const { token, password, confirmpass } = req.body;
  if (!token || !password || !confirmpass) {
    return res.redirect("/login");
  }
  let decode = await jwt.verify(token, process.env.SECREAT);

  const { id } = decode;
  const findid = await User.findById(id);
  if (!findid) {
    return res.redirect("/regiter");
  }
  findid.password = password;
  await findid.save();

  return res.redirect("/login");
};
