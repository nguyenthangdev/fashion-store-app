import mongoose from 'mongoose'

const cartSchema = new mongoose.Schema(
  {
    user_id: String,
    products: [
      {
        product_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product' // Tham chiếu đến model 'ProductModel'
        },
        quantity: { type: Number, min: 1, default: 1 },
        color: String,
        size: String,
        totalPrice: Number
      }
    ],
    totalsPrice: Number
  },
  {
    timestamps: true
  }
)

const CartModel = mongoose.model('Cart', cartSchema, 'carts')

export default CartModel
