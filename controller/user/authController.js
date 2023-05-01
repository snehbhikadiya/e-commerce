const User=require('../../model/user');
const Product=require('../../model/productModel');
const mailer=require('nodemailer');
const jwt=require('jsonwebtoken');



//=============dashboard============//

//=====dashboard==get===============//
exports.dashboard=async(req,res)=>
{   
    await Product.find().then(function(product){
        console.log(product);
        
        res.render('dashboard',{product:product});
    })
  
}

//=====dashboard==post===============//
exports.showdasboard=async(req,res)=>
{
    const {userId}=req.session
    if(!userId)
    {
        return res.redirect('/login');
    }
    return res.redirect('/cart');

}





//=========cart details=======//

//=======cart====get===========//
exports.details=async(req,res)=>
{
    const product=await Product.find();
    res.render('details',{product:product});
}


//=========shop============//

//=========shop===get======//
exports.shop=async(req,res)=>
{
    res.render('shop');
}


//=========shopingcart===========//

//=========shopingcart===get======//

exports.shopingcart=async(req,res)=>
{
    res.render('shopingcart');
}



//=========checkout===========//

//=========checkout===get======//

exports.checkout=async(req,res)=>
{
    await Product.find().then(function(product){
        res.render('checkout',{product:product});
    })
}


//=========chat-box============//

//=========chat-box===get======//
exports.chat=async(req,res)=>
{
    res.render('chat');
}


//============register-User============//

//=====register==get===============//
exports.getregister=async(req,res)=>
{
    res.render('register');
}

//=====register==post===============//
exports.register=async(req,res)=>
{
    const {  userName,birthDate,email,password}=req.body
    const users={ userName,birthDate,email,password}
    const register=await User.create(users);
    req.flash('success','register successfully')
    res.redirect('/login');
}

//===========login-User==============//

//=====login==get===============//
exports.getlogin=async(req,res)=>
{
    const success=req.flash('success');
    const error=req.flash('error');
    res.render('login',{success,error});
}

//=====login==post===============//
exports.login=async(req,res)=>
{
    const {email,password}=req.body
    const findemail=await User.findOne({email});
    if(!findemail)
    {
       return res.redirect('/register');
    }
    if(findemail.password!==password)
    {
       return res.redirect('/login');
    }
    req.session.userId=findemail.id
    res.redirect('/cart');
}



//=============forget password==============//

const compny_email=process.env.EMAIL
const compny_password=process.env.EMAIL_PASSWORD

let transpoter= mailer.createTransport({
    host:'smtp.gmail.com',
    port:587,
    secure:false,
    auth:{
        user:compny_email,
        pass:compny_password
    }
})

 //====forget===get===============//

exports.forget=async(req,res)=>
{
    res.render('forget')
}

//=====forget==post===============//

exports.createforget=async(req,res)=>
{
    const email=req.body.email
    const findemail=await User.findOne({email});
    if(!findemail)
    {
        return res.redirect('/login');
    }
    
    const payload={
        id:findemail.id
    }
    const token=await jwt.sign(payload,process.env.SECREAT,{
        expiresIn:'24h'
    });

    const info=await transpoter.sendMail({
        from:`E-shoopy${compny_email}`,
        to:email,
        subject:'reset your password',
        html:`<a href="http://localhost:3000/reset?token=${token}">reset password</a>`
    })
    console.log(info);
    return res.redirect('/login');

}



// let obj=req.body
// let array=[]
// obj.
//============reset password============//

//=====reset==get===============//

exports.reset=async(req,res)=>
{
    const token=req.query.token
    res.render('reset',{token});
}

//=====reset==post===============//

exports.newpassword=async(req,res)=>
{
    const {token,password,confirmpass}=req.body
    if(!token||!password||!confirmpass)
    {
        return res.redirect('/login');
    }
    let decode=await jwt.verify(token,process.env.SECREAT)

    const{id}=decode
    const findid=await User.findById(id);
    if(!findid)
    {
        return res.redirect('/regiter');
    }
    findid.password=password
    await findid.save();
    
    return res.redirect('/login');

}


