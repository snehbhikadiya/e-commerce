const User=require('../model/user');

exports.authorise=async(req,res,next)=>
{
    // const {userId}=req.session
    // if(!userId)
    // {
    //     return res.redirect('/login');
    // }
    // const finduserId=await User.findById(userId);
    // if(!finduserId)
    // {
    //     return res.redirect('/register');
    // }
    // req.session.userId=finduserId
    // next();

    if(req.isAuthenticated())
    {
      return next();
    }
    return res.redirect('/login');

}

exports.notautherise=async(req,res,next)=>
{
    console.log(req.isAuthenticated())
    if(!req.isAuthenticated())
    {
        return next();
    }

    return res.redirect('/cart');
}


