import multer from "multer"

// Use memory storage so uploads work in environments without an uploads/ folder
const storage = multer.diskStorage({
  destination:(req,file,cb)=>{
    cb:(null, './public')
  },
  filename:(req,file,cb)=>{
    cb:(null,file.originalname)
  }
})

export const Upload = multer({ storage })