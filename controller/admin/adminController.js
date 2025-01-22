const Product=require('../../model/productModel');
const User=require('../../model/user');
const Order=require('../../model/userdetailsModel');
const fs=require('fs');
const passport = require('passport');


exports.admindashboard=async(req,res)=>
{
    const products=await Product.find();
    console.log(" user: req.user", req.user);
    console.log("session",req.session);
    res.render('admin/admin',{title:'admin-product',products,  user: req.user,
        success: req.flash('success'),
        error: req.flash('error')});
}

exports.chatAdmin=async(req,res)=>
{
    const user = await User.find();
    res.render('admin/chatAdmin',{ user: user });
}

exports.adminproduct=async(req,res)=>
{
    res.render('admin/adminproduct');
}

exports.createproduct=async(req,res)=>
{
    const register=new Product({
        name:req.body.name,
        image:req.file.filename,
        price:req.body.price,
        size:req.body.size,
        quantity:req.body.quantity,
        description:req.body.description
    })
    register.save();
   return res.redirect('/admin');
}

exports.updateget=async(req,res)=>
{
    const {id}=req.params
    const finduser=await Product.findById(id);
    if(!finduser)
    {
       return res.redirect('/adminproduct');
    }
     res.render('admin/updateProduct',{title:'admin-update-product',user:finduser});
}

exports.updateproduct=async(req,res)=>
{
    const {id}=req.params
    let newimg=''
    if(req.file)
    {
        newimg=req.file.filename
       try {
        fs.unlinkSync('./public/upload/img'+req.body.old_image)
       } catch (error) {
        console.log(error);
       }
       
    }
    else
    {
        newimg=req.body.old_image
    }
    const findproduct=await Product.findById(id)
    findproduct.name=req.body.name,
    findproduct.image=newimg
    findproduct.price=req.body.price,
    findproduct.size=req.body.size
    findproduct.quantity=req.body.quantity
    findproduct.description=req.body.description

    await findproduct.save()
    return res.redirect('/admin');
}

exports.delete=async(req,res)=>
{
    const {id}=req.params
    const deleteproduct=await Product.findByIdAndDelete(id)
    res.redirect('/admin');
}


exports.getouruser=async(req,res)=>
{
    const finduser=await User.find();
    res.render('admin/ourUser',{users:finduser});
}

  exports.login = async (req, res, next) => {
    passport.authenticate('local', {
      successRedirect: req.user.type === 'admin' ? '/admin' : '/cart',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res, next);
  };

exports.admincustomerordertrak=async(req,res)=>
{
    const ordertrak=await Store.findById(req.params.id);
    if(req.user._id.toString()===ordertrak.customerId.toString()){
        res.render('trakorder',{order:ordertrak});
    }
    else
    {
        res.redirect('/dashboard');
    }
}


exports.ordersroute=async(req,res)=>
{
   return res.render('admin/adminsideorders')
}


exports.order=(req,res)=>
{
    const findorder= Order.find({status:{$ne:'completed'}},null,{sort:{'createdAt':-1}}).populate('customerId').exec((err,order)=>{
        if(order){    
            console.log('order',order);
            return res.json(order);
        }
        if(err)
        {
            console.log(err);
        }
    })
}


exports.status=async(req,res)=>
{
    const updateorder=await Order.updateOne({_id:req.body.orderId},{status:req.body.status});
    if(!updateorder)
    {
        console.log(err);   
    }
    
    return res.redirect('/admin/ordersroute');
}





