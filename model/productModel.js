const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const product = new Schema({
  name: String,
  image: String,
  price: Number,
  size: String,
  quantity: Number,
  description: String,
});

const productModel = mongoose.model("product", product);

module.exports = productModel;
