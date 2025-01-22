const multer=require('multer');



let storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./public/img')
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
})


exports.uplod=multer({
    storage:storage
}).single('image');