const validatiors=require('./validation/joi_index');

module.exports=function(validation)
{
    if(!validatiors.hasOwnProperty(validation)){
        throw new Error (`${validation} validaer is not exits`);
    }

    return async function(req,res,next){
        try {
            const validated=await  validatiors[validation].validateAsync(req.body)
            req.body=validated
            next();
        } catch (error) {
        if(error.isjoi)
        {
            res.status(422).json({
                success:false,
                message:error.message
            })
        }
        }
    }
}