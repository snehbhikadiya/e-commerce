const LocalStrategy=require('passport-local').Strategy
const User=require('../model/user');



module.exports=async(passport)=>{
    passport.serializeUser((user,done)=>
   
    {
        console.log(user)
        if(user)
        {
            return done(null,user._id);
        }
        const err=new Error('user not found');
        throw done(err)
    })

    passport.deserializeUser((id,done)=>{
        User.findById(id,(err,user)=>
        {
            if(err)
            {
                return done(null,false);
            }
            return done(null,user);
        })
    })
       
    passport.use('local',new LocalStrategy({
        usernameField:'email'
    },
    async function(name,password,done)
    {
        User.findOne({email:name},function(err,user){
            if(err)
            {
                const err=new Error('error from passport')
                throw err
            }
            if(!user)
            {
                return done(null,false,{type:'error',message:'incorect user'});
            }
            if(user.password!==password)
            {
                return done(null,false,{type:'error',message:'incorect password'});
            }
            return done(null,user)
        })
    }
    ))
}
