module.exports =  (io, socket) => {
    console.log("socket id", socket.id);

    socket.emit("welcome", "welcome to chat app" )

    socket.broadcast.emit("newConnection", "new user connected" )


    socket.on("sendMessage", (data) => {
        socket.broadcast.emit("receiveMessage",data)    
    })
}