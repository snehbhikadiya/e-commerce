const Moment = require("moment");
const Product = require("../../model/productModel");
const Store = require("../../model/userdetailsModel");

exports.cart = async (req, res) => {
  await Product.find();
  req.flash("success", "order placed successfully");
  res.render("cart");
};

exports.update = async (req, res) => {
  try {
    // Initialize cart if it doesn't exist in session
    if (!req.session.cart) {
      req.session.cart = {
        items: {},
        totalqty: 0,
        totalprice: 0,
      };
    }

    var cart = req.session.cart;
    console.log("Cart before update:", cart);
    console.log("Product data received:", req.body);

    // Check if the product exists in the cart
    if (!cart.items[req.body._id]) {
      // If not, add it to the cart with quantity 1
      cart.items[req.body._id] = {
        item: req.body,
        qty: 1,
      };
      cart.totalqty += 1; // Increment totalqty by 1 when a new product is added
      cart.totalprice += Number(req.body.price);
    } else {
      // If the product already exists, increase its quantity by 1
      cart.items[req.body._id].qty += 1;
      cart.totalqty += 1; // Increment totalqty by 1 when an existing product's quantity is increased
      cart.totalprice += Number(req.body.price);
    }

    console.log("Cart after update:", cart);

    // Return the updated total quantity in the response
    return res.json({
      totalqty: req.session.cart.totalqty,
    });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Assuming this is your removeProduct controller
exports.removeProduct = async (req, res) => {
  const productId = req.body.productId;
  const cart = req.session.cart;

  if (cart && cart.items && cart.items[productId]) {
    // Update totalqty and totalprice
    const removedQty = cart.items[productId].qty;
    const removedPrice = cart.items[productId].item.price * removedQty;
    cart.totalqty -= removedQty;
    cart.totalprice -= removedPrice;

    // Remove the product from the cart
    delete cart.items[productId];

    return res.status(200).json({ success: true });
  } else {
    return res.status(404).json({ error: "Product not found in cart" });
  }
};


exports.logout = async (req, res) => {
  try {
    await logout(req);
    return res.status(200).json({
      success: true,
    });
  } catch (error) {
    throw error;
  }
};

const logout = async (req) => {
  return new Promise((resolve, reject) => {
    req.logout(function (err) {
      if (err) {
        return reject(err);
      }
      resolve(true);
    });
  });
};

exports.store = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    phoneno,
    addressno1,
    addressno2,
    country,
    city,
    state,
    zipcode,
    customerId,
    item,
    payment,
    status,
  } = req.body;
  const shop = new Store({
    firstname,
    lastname,
    email,
    phoneno,
    addressno1,
    city,
    state,
    zipcode,
    customerId: req.user._id,
    item: req.session.cart.items,
  });
  const shopcreate = await shop.save();
  delete req.session.cart;
  res.redirect("/dashboard");
};

exports.customerorder = async (req, res) => {
  const customerorder = await Store.find({ customerId: req.user._id }, null, {
    sort: { createdAt: -1 },
  });
  const success = req.flash("success");
  const error = req.flash("error");
  res.render("orders", {
    customerorder: customerorder,
    Moment: Moment,
    success,
    error,
  });
};

exports.customerordertrak = async (req, res) => {
  const ordertrak = await Store.findById(req.params.id);
  if (req.user._id.toString() === ordertrak.customerId.toString()) {
    res.render("trakorder", { order: ordertrak });
  } else {
    res.redirect("/dashboard");
  }
};
