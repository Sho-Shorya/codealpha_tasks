import express from "express"
import 'dotenv/config'
import { connectDb } from "./database/db.js";
import cors from 'cors'

const app = express();
const PORT = process.env.PORT || 5000;

//middleware
app.use(express.json())
app.use(cors())

app.listen(PORT, () => {
  connectDb()
  console.log("Server started successfully");
  console.log(`Server running on port ${PORT}`);
});

