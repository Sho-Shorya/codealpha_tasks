import express from "express"
import 'dotenv/config'
import connectDb from "./database/db.js";
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import cors from'cors'

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json())
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials:true
}))

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)


// http://localhost:8000/api/v1/user/register

app.listen(PORT,()=>{
  connectDb()
  console.log("Server started successfully");
  console.log(`Server running on port ${PORT}`);
});

