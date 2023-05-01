const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adminSchema = new Schema({
  AdminName: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  }
},{
  timestamps:true
});

const admin = mongoose.model("admin", adminSchema);
module.exports = admin;