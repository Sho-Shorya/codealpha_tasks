import express from "express"
import 'dotenv/config'
import dns from "dns"
import { connectDb } from "./config/db.js";
import cors from 'cors'
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { userRouter } from "./routes/user.routes.js";
import { postRouter } from "./routes/post.routes.js";

//mongoDB error fix 
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const app = express();
const PORT = process.env.PORT || 5000;


//middleware
app.use(express.json())
app.use(cors());
app.use(cookieParser());


//api
app.use('/api/auth',authRouter)
app.use('/api/user',userRouter)
app.use('/api/post',postRouter)


app.listen(PORT, () => {
  connectDb()
  console.log("Server started successfully");
  console.log(`Server running on port ${PORT}`);
});

