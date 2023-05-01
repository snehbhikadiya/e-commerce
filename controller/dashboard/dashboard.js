const Moment = require('moment');
const Product=require('../../model/productModel');
const Store=require('../../model/userdetailsModel');

exports.cart=async(req,res)=>
{
    await Product.find()
    req.flash('success', 'order placed successfully');
    res.render('cart');
}


exports.update=async(req,res)=>
{

    if(!req.session.cart)
    {
        req.session.cart={
            items:{},
            totalqty:0,
            totalprice:0
        }
        
    }
    var cart=req.session.cart
    console.log('cart',cart);
    console.log('data product',req.body);

    if (!cart.items[req.body._id]) {
        cart.items[req.body._id] = {
          item: req.body,
          qty: 1
        };
        cart.totalqty += 1;
        cart.totalprice += Number(req.body.price);
      } else {
        cart.items[req.body._id].qty += 1;
        cart.totalqty += 1;
        cart.totalprice += Number(req.body.price);
      }
      
    return res.json({
        totalqty:req.session.cart.totalqty
    
    })
}




exports.logout=async(req,res)=>
{
   try {
    await logout(req)
    return res.status(200).json({
        success:true
    })
   } catch (error) {
    throw error
   }
}

const logout=async(req)=>
{
    return new Promise((resolve,reject)=>{
        req.logout(function (err){
            if(err)
            {
                return reject (err)
            }
             resolve (true)
        })
    })
}

exports.store=(async(req,res)=>
{
   const {firstname,lastname,email,phoneno,addressno1,addressno2,country,city,state,zipcode,customerId,item,payment,status}=req.body
   const shop= new Store({firstname,lastname,email,phoneno,addressno1,city,state,zipcode,customerId:req.user._id,item:req.session.cart.items})
   const shopcreate=await shop.save()
   delete req.session.cart
   res.redirect('/dashboard');
})


exports.customerorder=async(req,res)=>
{
    const customerorder=await Store.find({customerId:req.user._id},null,{sort:{'createdAt':-1}});
    const success=req.flash('success');
    const error=req.flash('error');
    res.render('orders',{customerorder:customerorder,Moment:Moment,success,error});
   
}   


exports.customerordertrak=async(req,res)=>
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
