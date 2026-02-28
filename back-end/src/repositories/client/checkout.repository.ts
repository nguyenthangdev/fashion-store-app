import CartModel from '~/models/cart.model'
import OrderModel from '~/models/order.model'
import ProductModel from '~/models/product.model'

const findCardById = async (cartId: string) => {
  const cart = await CartModel
    .findOne({ _id: cartId })
    .populate({
      path: 'products.product_id', // Đường dẫn đến trường cần làm đầy
      model: 'Product', // Tên model tham chiếu
      select: 'title thumbnail slug price discountPercentage colors sizes stock' // Chỉ lấy các trường cần thiết
    })
  
  return cart
}

const findById = async (cartId: string) => {
  const cart = await CartModel
    .findById(cartId)
    .populate({
      path: 'products.product_id',
      model: 'Product'
    })
  
  return cart
}

const findOrderById = async (orderId: string) => {
  const order = await OrderModel.findOne({ _id: orderId })

  return order
}

const findProductById = async (productId: string) => {
  const productInfo = await ProductModel
    .findOne({ _id: productId })
    .select('title thumbnail')
  
  return productInfo
}

export const checkoutRepositories = {
  findCardById,
  findById,
  findOrderById,
  findProductById
}