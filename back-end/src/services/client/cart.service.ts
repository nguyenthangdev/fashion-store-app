import CartModel from '~/models/cart.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { cartRepositories } from '~/repositories/client/cart.repository'

const getCart = async (cartId: string) => {
  const cart = await cartRepositories.findCartById(cartId)

  if (!cart) {
    return { 
      success: false, 
      code: 404, 
      message: 'Giỏ hàng trống!', 
      cart: [] 
    }
  }

  // Tính toán tổng tiền sau khi đã có đầy đủ thông tin
  let totalsPrice = 0
  if (cart.products.length > 0) {
    for (const item of cart.products) {
      // Sau khi populate, item.product_id sẽ là một object chứa thông tin sản phẩm
      const productInfo = item.product_id as any
      if (productInfo) {
        const priceNew = productsHelper.priceNewProduct(productInfo as OneProduct)
        item['productInfo'] = productInfo // Gán productInfo vào một trường ảo
        item['totalPrice'] = priceNew * item.quantity
        totalsPrice += item['totalPrice']
      }
    }
  }
  cart.totalsPrice = totalsPrice

  return { success: true, cart }
}

const addToCart = async (productId: string, data: any, cartId: any) => {
  const { quantity, color, size } = data 
  const result = await CartModel.updateOne(
    {
      _id: cartId,
      products: {
        $elemMatch: { // Match 1 phần tử mảng với nhiều điều kiện
          product_id: productId,
          color: color,
          size: size
        }
      }
    },
    {
      // Dùng $inc để tăng số lượng một cách an toàn
      $inc: { 'products.$.quantity': quantity } 
    }
  )

  if (result.modifiedCount === 0) { // Dùng khi không có sản phẩm nào được cập nhật
    const productInfo = {
      product_id: productId,
      quantity: quantity,
      color: color,
      size: size
    }
    
    // Thêm sản phẩm mới vào giỏ hàng
  await CartModel.updateOne(
      { _id: cartId },
      { $push: { products: productInfo } }
    )
  }
}

const updateQuantity = async (cartId: any, data: any) => {
  const { productId, color, size, quantity } = data

  await cartRepositories.updateQuantity(cartId, productId, color, size, quantity)
}

const deleteInCart = async (cartId: any, data: any) => {
  const { productId, color, size } = data

  await cartRepositories.deleteInCart(cartId, productId, color, size)
}

const updateVariant = async (data: any, cartId: any) => {
  const { productId, oldColor, oldSize, newColor, newSize } = data

  // Tìm sản phẩm trong giỏ hàng với các thuộc tính cũ
  const result = await cartRepositories.updateVariant(cartId, productId, oldColor, oldSize, newColor, newSize)

  return result
}

export const cartServices = {
  getCart,
  addToCart,
  updateQuantity,
  deleteInCart,
  updateVariant
}