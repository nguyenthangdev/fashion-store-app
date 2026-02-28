import { Response, NextFunction } from 'express'
import { GeneralRequest } from '~/interfaces/request.interface'
import CartModel from '~/models/cart.model'
import { getCookieOptions } from '~/utils/constants'

export const cartId = async (
  req: GeneralRequest,
  res: Response,
  next: NextFunction
) => {
  const cartId = req.cookies.cartId
  if (!cartId) {
    const cart = new CartModel()
    await cart.save()
    res.cookie('cartId', cart.id, getCookieOptions('30d'))
    req["cartId"] = cart.id
  } else {
    const cart = await CartModel.findById(cartId).lean()
    if (!cart) {
      // Nếu cookie có cartId nhưng CSDL không có (ví dụ: CSDL bị xóa)
      // => Tạo giỏ hàng mới
      const newCart = new CartModel()
      await newCart.save()
      res.cookie('cartId', newCart.id, getCookieOptions('30d'))
      req["cartId"] = newCart.id
    } else {
      // Tìm thấy giỏ hàng
      if (cart.products.length > 0) {
        cart["totalProduct"] = cart.products.length
      }
      req["cartId"] = cart._id.toString()
    }
  }
  next()
}
