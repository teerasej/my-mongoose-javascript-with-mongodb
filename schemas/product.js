import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
    productName: String,
    price: Number,
    expireDate: Date,
    color: String
})

const ProductModel = mongoose.model('Product', productSchema);

export default ProductModel;