import { PaginationInterface } from '~/interfaces/admin/general.interface'
import OrderModel from '~/models/order.model'

const getOrders = async (find: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const [orders, allOrders] = await Promise.all([
    OrderModel
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .lean()  
      .populate('createdBy.account_id', 'fullName email')
      .populate('updatedBy.account_id', 'fullName email')
      .lean(),
    OrderModel
      .find({deleted: false})
      .lean()
  ])

  return { orders, allOrders }
}

const changeStatusOrder = async (order_id: string, status: string, updatedBy: any) => {
  const updater = await OrderModel
    .findByIdAndUpdate(
      { _id: order_id },
      {
        $set: { status },
        $push: { updatedBy }
      },
      { new: true } // Trả về document sau update
    )
    .populate('updatedBy.account_id', 'fullName email')
    .lean() 
  
  return updater
}

const deleteOrder = async (order_id: string, account_id: string) => {
  await OrderModel.updateOne(
    { _id: order_id },
    {
      $set: {
        deleted: true,
        deletedBy: {
          account_id: account_id,
          deletedAt: new Date()
        }
      }
    }
  )
}

const findOrderById = async (order_id: string) => {
  const order = await OrderModel.findOne({ 
    _id: order_id, 
    deleted: false 
  })

  return order
}

const estimatedDeliveryDay = async (dataTemp: any, updatedBy: any) => {
  await OrderModel.updateOne(
    { _id: dataTemp.orderId },
    { 
      $set: { estimatedDeliveryDay: dataTemp.estimatedDeliveryDay }, 
      $push: { updatedBy }
    }
  )
}

const estimatedConfirmedDay = async (dataTemp: any, updatedBy: any) => {
  await OrderModel.updateOne(
    { _id: dataTemp.orderId },
    { 
      $set: { estimatedConfirmedDay: dataTemp.estimatedConfirmedDay }, 
      $push: { updatedBy }
    }
  )
}

const findAllOrders = async (find: any) => {
  const orders = await OrderModel
    .find(find)
    .sort({ createdAt: -1 })
    .lean()

  return orders
}

const orderTrash = async (find: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const orders = await OrderModel
    .find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .populate('deletedBy.account_id', 'fullName email')
    .lean()
  
  return orders
}

const permanentlyDeleteOrder = async (order_id: string) => {
  await OrderModel.deleteOne({ _id: order_id })
}

const recoverOrder = async (order_id: string) => {
  await OrderModel.updateOne(
    { _id: order_id },
    { $set: { deleted: false, recoveredAt: new Date() } }
  )
}

export const orderRepositories = {
  getOrders,
  changeStatusOrder,
  deleteOrder,
  findOrderById,
  estimatedDeliveryDay,
  estimatedConfirmedDay,
  findAllOrders,
  orderTrash,
  permanentlyDeleteOrder,
  recoverOrder
}
