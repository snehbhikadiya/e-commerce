const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  userName: {
    type: String,
  },
  birthDate: {
    type: String  
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  verify: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    enum: ['user', 'admin'],
    default: "user"
  },
  expiresIn: {
    type: Date,
    default: () => new Date().getTime() + 1000 * 60 * 5
  }
}, {
  timestamps: true
});

const User = mongoose.model("User", userSchema);
module.exports = User;
