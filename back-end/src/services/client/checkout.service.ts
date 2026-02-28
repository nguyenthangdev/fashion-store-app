import ProductModel from '~/models/product.model'
import OrderModel from '~/models/order.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import "~/crons/order.cron"
import { CheckoutInterface } from '~/interfaces/client/checkout.interface'
import { checkoutRepositories } from '~/repositories/client/checkout.repository'

const getCheckout = async (cartId: string) => {
  const cart = await checkoutRepositories.findCardById(cartId)
  
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

  return {
    success: true,
    cart
  }
}

const order = async (cartId: string, userId: string, data: CheckoutInterface) => {
  const dataTemp = {
    fullName: data.fullName,
    phone: data.phone,
    address: data.address,
    paymentMethod: data.paymentMethod,
    note: data.note
  }
  const userInfo = {
    fullName: dataTemp.fullName,
    phone: dataTemp.phone, 
    address: dataTemp.address
  }
  const cart = await checkoutRepositories.findById(cartId)

  if (!cart || cart.products.length === 0) {
    return { 
      success: false, 
      code: 404, 
      message: 'Giỏ hàng trống!', 
      cart: [] 
    }
  }

  const products = cart.products.map(item => {
    const productInfo = item.product_id as any // Sau khi populate, đây là object
    return {
      product_id: productInfo._id,
      title: productInfo.title,
      slug: productInfo.slug,
      thumbnail: productInfo.thumbnail,
      price: productInfo.price,
      discountPercentage: productInfo.discountPercentage,
      quantity: item.quantity,
      color: item.color,
      size: item.size
    }
  })

  const totalBill = products.reduce((acc, product) => {
    const priceNew = (product.price * (100 - product.discountPercentage)) / 100
    return acc + priceNew * product.quantity
  }, 0)

  const orderInfo = {
    user_id: userId,
    cart_id: cartId,
    userInfo,
    products,
    amount: Math.floor(totalBill),
    note: dataTemp.note,
    paymentInfo: { method: dataTemp.paymentMethod, status: 'PENDING' }
  }

  const newOrder = new OrderModel(orderInfo)
  await newOrder.save()

  return {
    success: true,
    newOrder,
    paymentMethod: dataTemp.paymentMethod
  }
}

const success = async (orderId: string) => {
  const order = await checkoutRepositories.findOrderById(orderId)

  for (const product of order.products) {
    const productInfo = await checkoutRepositories.findProductById(product.product_id.toString())

    product['productInfo'] = productInfo
    product['priceNew'] = productsHelper.priceNewProduct(product as OneProduct)
    product['totalPrice'] = product['priceNew'] * product.quantity
  }
  order['totalsPrice'] = order.products.reduce(
    (sum, item) => sum + item['totalPrice'],
    0
  )
  return order
}

export const checkoutServices = {
  getCheckout,
  order,
  success
}