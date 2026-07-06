import express from "express"
import 'dotenv/config'
import { connectDb } from "./database/db.js";
import userRoute from "./routes/userRoute.js"
import productRoute from "./routes/productRoute.js"
import cartRoute from "./routes/cartRoute.js"
import debugRoute from "./routes/debugRoute.js"
import categoryRoute from "./routes/categoryRoute.js"
import offerRoute from "./routes/offerRoute.js"
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json())
app.use(cors())

app.use('/api/v1/user', userRoute)
app.use('/api/v1/product', productRoute)
app.use('/api/v1/cart', cartRoute)
app.use('/api/v1/debug', debugRoute)
app.use('/api/v1/categories', categoryRoute)
app.use('/api/v1/offers', offerRoute)


// http://localhost:8000/api/v1/user/register

app.listen(PORT, () => {
  connectDb()
  console.log("Server started successfully");
  console.log(`Server running on port ${PORT}`);
});

