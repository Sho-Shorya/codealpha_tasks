import { Product } from "../models/productModel.js";
import cloudinary from "../utils/cloudinary.js";
import getDataUri from "../utils/dataUri.js";

export const addProduct = async (req, res) => {
  try {
    const { productName, productDesc, productPrice, catagory, brand } = req.body;
    // accept both `category` and misspelled `catagory` from clients
    const category = req.body.category || catagory
    const userId = req.id;
    if (!productName || !productDesc || !productPrice || !category || !brand) {
      return res.status(400).json({ success: false, message: "All fields are required!" })
    }

    //array of images to store the uploaded images in cloudinary and then store the url and public_id in DB.
    let productImg = [];

    // files may come from multiple sources depending on the client UI:
    // - `req.files` (array) when multiple files are uploaded
    // - `req.file` (single) when one file is uploaded
    const uploadedFiles = []
    if (Array.isArray(req.files) && req.files.length > 0) uploadedFiles.push(...req.files)
    else if (req.file) uploadedFiles.push(req.file)

    if (uploadedFiles.length > 0) {
      for (let file of uploadedFiles) {
        const fileUri = getDataUri(file)
        const result = await cloudinary.uploader.upload(fileUri, { folder: "mern_products" })
        productImg.push({ url: result.secure_url, public_id: result.public_id })
      }
    }

    //create a product in DB - pass a single document object to Mongoose
    const newProduct = await Product.create({
      userId,
      productName,
      productDesc,
      productPrice: Number(productPrice),
      category,
      brand,
      productImg, //array of objects--> [{url, public_id},{url, public_id}]
    })
    return res.status(200).json({
      success: true,
      message: "Product added successfully",
      product: newProduct
    })


  } catch (error) {
    return res.status(500).json({
      success: false, message: error.message
    })
  }
}

export const getallproducts = async (_, res) => {
  try {
    const products = await Product.find()
    if (!products) {
      return res.status(404).json({
        success: false,
        message: "No product available",
        products: []
      })
    }
    return res.status(200).json({
      success: true,
      products,
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId)
    if (!product) {
      res.status(400).json({
        success: false,
        message: "Product not found!"
      })
    }
    //deleting imgaes from cloudnary
    if (product.productImg && product.productImg.length > 0) {
      for (const img of product.productImg) {
        const result = await cloudinary.uploader.destroy(img.public_id);
      }
    }

    //deleting product from mongodb
    await Product.findByIdAndDelete(productId)

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    })

  } catch {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

export const updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { productName, productDesc, productPrice, catagory, brand, existingImages } = req.body;

    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!"
      })
    }
    let updatedImages = []
    if (existingImages) {
      const keepIds = JSON.parse(existingImages);
      updatedImages = product.productImg.filter((img) =>
        keepIds.includes(img.public_id)
      )

      const removeImages = product.productImg.filter((img) =>
        !keepIds.includes(img.public_id)
      )
      for (let img of removeImages) {
        await cloudinary.uploader.destroy(img.public_id)
      }
    } else {
      updatedImages = product.productImg
    }

    if (req.files && req.files.length > 0) {
      for (let file of req.files) {
        const fileUri = getDataUri(file)
        const result = await cloudinary.uploader.upload(fileUri, { folder: "mern_products" })
        updatedImages.push({
          url: result.secure_url,
          public_id: result.public_id
        })
      }
    }

    product.productName = productName || product.productName
    product.productDesc = productDesc || product.productDesc
    product.productPrice = productPrice || product.productPrice
    product.category = category || product.category
    product.bramd = bramd || product.bramd
    product.productImg = updatedImages

    await product.save()

    return res.status(200).json({
      success: true,
      message: "Product updated successfully"
    })
  } catch {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}