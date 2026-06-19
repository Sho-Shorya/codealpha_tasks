import multer from "multer"

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname)
  }
})

export const singleUpload = multer({ storage }).single("file")

// Expect field name `files` for multiple uploads (matches frontend/Postman)
export const multipleUpload = multer({ storage }).array("files", 5)
