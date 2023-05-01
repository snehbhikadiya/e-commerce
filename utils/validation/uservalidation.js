const joi=require('joi');


const userSchema=joi.object({
    userName:joi.string().empty().min(2).max(10).required().trim().message({
        'string.empty':"name is required please do not empty",
        'string.min':"name have required min 2 and max 10 character",
        'any.only':'userName is required'
    }),
    birthDate:joi.date().empty().required(),

    email:joi.string().empty().min(5).max(40).required().trim().message({
        'string.empty':'please write true email',
        'string.min':'please provide valid (min 5) character',
        'any.only':'email is required'
    }),
    password:joi.string().regex(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/).allow().trim().message({
        'string.pattern.base':'invalid password'
    })
})


module.exports=userSchema