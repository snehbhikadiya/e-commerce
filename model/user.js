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
  },
  password: {
    type: String,
  },
  verify:{
    type:Boolean,
    default:false
  },
  expiresIn: {
    type: Date,
    default: () => {
      return new Date().getTime() + 1000 * 60 * 5
    }
  }
},{
  timestamps:true
});

const user = mongoose.model("user", userSchema);
module.exports = user;