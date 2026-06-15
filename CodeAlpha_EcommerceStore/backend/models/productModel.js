import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    userId:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user"
    },
    productName: {
      type: String,
      required: true
    },
    productDesc: {
      type: String,
      required: true
    },
    productImg: [{
      url: { type: String, required: true },
      public_id: { type: String, required: true }
    }],
    productPrice:{type:Number},
    category:{type:String},
    brand:{type:String},
  },{timeStamps:true}
)

export const Product = mongoose.model("product",productSchema) ;