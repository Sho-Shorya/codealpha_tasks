import mongoose from "mongoose"

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique:true},
  slug: { type: String, required: true, unique: true },
  description: { type: String, default: "" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true })

export const Category = mongoose.model("Category", categorySchema)
