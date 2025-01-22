const mongoose=require('mongoose');
const Schema=mongoose.Schema

const stor=new Schema({
    firstname:String,
    lastname:String,
    email:String,
    phoneno:{
        type:String,
        set: (val) => val.replace(/^0+/, ''),
        trim:true,
    },
    addressno1:String,
    addressno2:String,
    country:String,
    city:String,
    state:String,
    zipcode:String,
    customerId:{type:mongoose.Schema.Types.ObjectId,
        ref:'user',
        required:true
        },
    item:{type:Object,required:true},
    payment:{type:String,default:'COD'},
    status:{type:String,default:'order_placed'},

},{timestamps:true}) ;

const mongoosemodel=mongoose.model('store',stor);

module.exports=mongoosemodel