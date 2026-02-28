import CartModel from '~/models/cart.model'
import mongoose from 'mongoose'

const findCartById = async (cartId: string) => {
  const cart = await CartModel
    .findOne({ _id: cartId })
    .populate({
      path: 'products.product_id', // Đường dẫn đến trường cần làm đầy
      model: 'Product', // Tên model tham chiếu
      select: 'title thumbnail slug price discountPercentage colors sizes stock' // Chỉ lấy các trường cần thiết
    })
    .lean()
  
  return cart
}

const updateVariant = async (
  cartId: string, 
  productId: string, 
  oldColor?: string, 
  oldSize?: string, 
  newColor?: string, 
  newSize?: string
) => {
  const result = await CartModel.updateOne(
    {
      _id: cartId,
      'products.product_id': productId,
      'products.color': oldColor,
      'products.size': oldSize
    },
    {
      // Cập nhật lại color và size cho sản phẩm đó
      $set: {
        'products.$.color': newColor, // Dùng $ để chỉ đến phần tử phù hợp trong mảng
        'products.$.size': newSize
      }
    }
  )
  return result
}

const updateQuantity = async (
  cartId:string, 
  productId: string, 
  color: string, 
  size: string, 
  quantity: number
) => {
  await CartModel.updateOne(
    { 
      _id: cartId,
      'products.product_id': mongoose.Types.ObjectId.createFromHexString(productId),
      'products.color': color,
      'products.size': size
    },
    { $set: { 'products.$.quantity': quantity } }
  )
}

const deleteInCart = async (cartId: string, productId: string, color: string, size: string) => {
  await CartModel.updateOne(
    { _id: cartId },
    {
      $pull: { 
        products: { 
          product_id: mongoose.Types.ObjectId.createFromHexString(productId),
          color: color,
          size: size
        } 
      }
    }
  )
}

export const cartRepositories = {
  findCartById,
  updateVariant,
  updateQuantity,
  deleteInCart
}