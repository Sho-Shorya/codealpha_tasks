import multer from "multer"

// Use memory storage so uploads work in environments without an uploads/ folder
const storage = multer.memoryStorage()

export const singleUpload = multer({ storage }).single("file")

// Expect field name `files` for multiple uploads (matches frontend/Postman)
// Accept files sent from the UI using any field name (keeps frontend behavior flexible)
// This will populate `req.files` with an array of files regardless of the field name.
export const multipleUpload = multer({ storage }).any()
