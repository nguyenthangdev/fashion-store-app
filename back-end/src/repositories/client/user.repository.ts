import UserModel from '~/models/user.model'
import CartModel from '~/models/cart.model'
import OrderModel from '~/models/order.model'
import { PaginationInterface } from '~/interfaces/admin/general.interface'

const isExistEmail = async (email: string) => {
  const isExistEmail = await UserModel.findOne({
    email: email
  })

  return isExistEmail
}

const findUserByEmail = async (email: string) => {
  const user = await UserModel.findOne({
    email: email,
    deleted: false
  }).select('+password')

  return user
}

const findUserById = async (userId: string) => {
  const user = await UserModel.findOne({
    _id: userId,
    deleted: false,
    status: "ACTIVE"
  })

  return user
}

const findAccountById = async (account_id: string) => {
  const user = await UserModel.findOne({
    _id: account_id,
    deleted: false
  }).select('+password')
  
  return user
}
const findCartByUserId = async (userId: string) => {
  const userCart = await CartModel.findOne({ user_id: userId })
  return userCart
}

const findCartById = async (cartId: string) => {
  const guestCart = await CartModel.findById(cartId)

  return guestCart
}

const updateCartForUser = async (cartId: string, userId: string) => {
  await CartModel.updateOne(
    { _id: cartId }, 
    { $set: { user_id: userId } }
  )
}

const updateUpserByPassword = async (userId: string, newPassword: string) => {
  await UserModel.updateOne(
    { _id: userId },
    { $set: { password: newPassword } }
  )
}

const isExistEmailForEdit = async (email: string, account_id: string) => {
  const isExistEmail = await UserModel.findOne({
    _id: { $ne: account_id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
    email: email,
    deleted: false
  })

  return isExistEmail
}

const editUser = async (account_id: string, data: any) => {
  await UserModel.updateOne(
    { _id: account_id }, 
    { $set: data }
  )
}

const changePasswordUser = async (account_id: string, newPassword: string) => {
  await UserModel.updateOne(
    { _id: account_id }, 
    { $set: { password: newPassword } }
  )
}

const getOrders = async (find: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const orders = await OrderModel
    .find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .lean()
  
  return orders
}

const cancelOrder = async (order_id: string) => {
  await OrderModel.updateOne(
    { _id: order_id },
    { $set: { status: 'CANCELED' } }
  )
}

export const userRepositories = {
  isExistEmail,
  findUserByEmail,
  findCartByUserId,
  findCartById,
  updateCartForUser,
  findUserById,
  updateUpserByPassword,
  isExistEmailForEdit,
  editUser,
  findAccountById,
  changePasswordUser,
  getOrders,
  cancelOrder
}