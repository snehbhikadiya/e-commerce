const mongoose=require('mongoose');
const Msg=require('../model/message');
module.exports=(io,socket)=>{
    console.log('socketid',socket.id);
    Msg.find().then((result)=>
    {
        socket.emit('outputmessage',result)        
    })
    socket.emit('welcome','welcome to chat app');  

    socket.broadcast.emit('newconnection', 'new user connected');

    socket.on('sendmessage',(data,resiver,sender)=>
    {
        console.log("recive message", data,resiver,sender);

        const message=new Msg({message:data,resiver:resiver,sender:sender})
        message.save().then(()=>{
            
        socket.broadcast.emit('receivemessage',data)
        })
    })

    socket.on("disconnect", () => {
        console.log("user disconnected");
    })
}