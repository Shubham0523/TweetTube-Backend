import multer from "multer";

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/temp')
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)   //to make naming convention better to avoid duplicacy
    }
  })
  
export const upload = multer({ storage, })