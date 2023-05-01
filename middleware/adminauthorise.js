const Admin=require('../model/adminModel');

exports.adminauthorise=async(req,res,next)=>
{
    
    if(req.isAuthenticated())
    {
      return next();
    }
    return res.redirect('/adminlogin');
}

exports.adminnotauthorise=async(req,res)=>
{
    if(!req.isAuthenticated())
    {
        return next();
    }

    return res.redirect('/admin');
}