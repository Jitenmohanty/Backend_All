import multer from "multer";

const storage = multer.diskStorage({
    // where you want to save...
    destination:function(req,file,cb){
        cb(null,'./public/temp')
    },
    //save with original name
    filename:function(req,file , cb){
        cb(null , file.originalname)
    }
})

export const upload = multer({
    storage,
})