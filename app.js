require('dotenv').config();
require('./config/db');
const express=require('express');
const app=express();
const routes=require('./routes/index');
const path=require('path');
const mongostore=require('connect-mongo');
const session=require('express-session');
const flash=require('connect-flash');
const http=require('http');
const passport=require('passport'); 
const sockethandler=require('./handler/sokethandler');
const Emitter=require('events');
const server=http.createServer(app);
const {Server}=require('socket.io');
const io=new Server(server);


require('./config/passport')(passport);

app.use(express.json({limit:'53mb'}));
app.set('view engine','ejs');

app.use(express.static('./public/img'))
app.use(express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({extended:false,limit:737*45*54}));
const Mongostore=mongostore.create({
    mongoUrl:process.env.MONGO_URL,
    ttl:76494*465*566,
    crypto:{secret:process.env.SECREAT} 
})
    const eventEmitter=new Emitter();
    const eventEmitter1=app.set('eventEmitter',eventEmitter); 
    exports.eventEmitter1


app.use(session({
    secret:process.env.SECREAT,
    resave:false,
    saveUninitialized:false,
    store:Mongostore,
    cookie:{secure:false,sameSite:true,maxAge:8687*6768*678}
}))



app.use((req,res,next)=>{
    res.locals.session=req.session
    next();
})

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());   

app.use(routes);
app.use((req,res)=>{
    res.status(404).render('404.ejs')
})

app.use((err,req,res,next)=>
{
    const message=err.message
    const status=err.statusCode || 500 || 404

    res.status(status).json({
        message
    })
})


server.listen(3000,()=>
{
    console.log('server start on 3000');
    
})

