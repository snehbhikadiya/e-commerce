const mongoose=require('mongoose');
const Schema=mongoose.Schema

const message=new Schema({
    message:String,
    sender:{
        type:mongoose.Schema.Types.ObjectId
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId
    }
})

const messageModel=mongoose.model('message',message);

module.exports=messageModel