import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import OrderModel from '~/models/order.model'
import ExcelJS from 'exceljs'
import { EstimatedConfirmedDayInterface, EstimatedDeliveryDayInterface } from '~/interfaces/admin/order.interface'
import { orderRepositories } from '~/repositories/admin/order.repository'

export const getOrders = async (query: any) => {
  const find: any = { deleted: false }

  if (query.status) {
    find.status = query.status.toString()
  }
  
  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex) {
    find["userInfo.phone"] = objectSearch.regex
  }
  // End search

  // Pagination
  const countOrders = await OrderModel.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 15,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countOrders
  )
  // End Pagination

  // Sort
  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
    sort[key] = dir
  }
  // luôn sort phụ theo createdAt
  if (!sort.createdAt) {
    sort.createdAt = -1
  }
  // End Sort

  const { orders, allOrders } = await orderRepositories.getOrders(find, sort, objectPagination)

  return {
    orders,
    allOrders,
    objectSearch,
    objectPagination
  }
}

export const changeStatusOrder = async (status: string, order_id: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }

  const updater = await orderRepositories.changeStatusOrder(order_id, status, updatedBy)

  return updater
}

export const deleteOrder = async (order_id: string, account_id: string) => {
  await orderRepositories.deleteOrder(order_id, account_id)
}

export const detailOrder = async (order_id: string) => {
  const order = await orderRepositories.findOrderById(order_id)

  return order
}

export const estimatedDeliveryDay = async (data: EstimatedDeliveryDayInterface, account_id: string) => {
  const dataTemp = {
    estimatedDeliveryDay: data.estimatedDeliveryDay,
    orderId: data.id
  }
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  await orderRepositories.estimatedDeliveryDay(dataTemp, updatedBy)
}

export const estimatedConfirmedDay = async (data: EstimatedConfirmedDayInterface, account_id: string) => {
  const dataTemp = {
    estimatedConfirmedDay: data.estimatedConfirmedDay,
    orderId: data.id
  }
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  await orderRepositories.estimatedConfirmedDay(dataTemp, updatedBy)
}

export const exportOrder = async (query: any) => {
  const find: any = { deleted: false }
  const status = query.status as string

  if (status) {
      find.status = status
    }

  // Lấy TẤT CẢ đơn hàng (không phân trang) khớp với bộ lọc
    const orders = await orderRepositories.findAllOrders(find)

  // Tạo file Excel
    const workbook = new ExcelJS.Workbook()
    const worksheet = workbook.addWorksheet(`Đơn hàng ${status || 'Tất cả'}`)

  // Định nghĩa các cột
  worksheet.columns = [
    { header: 'Mã Đơn Hàng', key: 'orderId', width: 30 },
    { header: 'Ngày Đặt', key: 'createdAt', width: 20, style: { numFmt: 'dd/mm/yyyy hh:mm:ss' } },
    { header: 'Tên Khách Hàng', key: 'customerName', width: 30 },
    { header: 'Số Điện Thoại', key: 'phone', width: 20 },
    { header: 'Địa Chỉ', key: 'address', width: 50 },
    { header: 'Trạng Thái Đơn', key: 'orderStatus', width: 20 },
    { header: 'Sản Phẩm', key: 'productTitle', width: 40 },
    { header: 'Phân Loại (Màu)', key: 'color', width: 15 },
    { header: 'Phân Loại (Size)', key: 'size', width: 15 },
    { header: 'Số Lượng', key: 'quantity', width: 10 },
    { header: 'Đơn Giá (Đã giảm)', key: 'price', width: 20, style: { numFmt: '#,##0"đ"' } },
    { header: 'Thành Tiền', key: 'total', width: 20, style: { numFmt: '#,##0"đ"' } },
    { header: 'PT Thanh Toán', key: 'paymentMethod', width: 15 },
    { header: 'TT Thanh Toán', key: 'paymentStatus', width: 15 },
    { header: 'Ghi Chú', key: 'note', width: 30 }
  ]

  // Làm cho hàng tiêu đề in đậm
  worksheet.getRow(1).font = { bold: true }

  // Thêm dữ liệu vào file
  for (const order of orders) {
    for (const product of order.products) {
      const priceNew = Math.floor(product.price * (100 - product.discountPercentage) / 100)
      
      worksheet.addRow({
        orderId: order._id.toString(),
        createdAt: order.createdAt,
        customerName: order.userInfo.fullName,
        phone: order.userInfo.phone,
        address: order.userInfo.address,
        orderStatus: order.status,
        productTitle: product.title,
        color: product.color, 
        size: product.size,  
        quantity: product.quantity,
        price: priceNew,
        total: priceNew * product.quantity,
        paymentMethod: order.paymentInfo.method,
        paymentStatus: order.paymentInfo.status,
        note: order.note
      })
    }
  }
  return { workbook, status }
}

export const orderTrash = async (query: any) => {
  const find: any = {
    deleted: true
  }

  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex) {
    find["userInfo.phone"] = objectSearch.regex
  }
  // End search

  // Pagination
  const countOrders = await OrderModel.countDocuments(find)

  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 10,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countOrders
  )
  // End Pagination

  // Sort
  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
    sort[key] = dir
  }
  // luôn sort phụ theo createdAt
  if (!sort.createdAt) {
    sort.createdAt = -1
  }
  // End Sort

  const orders = await orderRepositories.orderTrash(find, sort, objectPagination)

  return {
    orders,
    objectSearch,
    objectPagination
  }
}

export const permanentlyDeleteOrder = async (id: string) => {
  await orderRepositories.permanentlyDeleteOrder(id)
}

export const recoverOrder = async (id: string) => {
  await orderRepositories.recoverOrder(id)
}

export const orderServices = {
  getOrders,
  changeStatusOrder,
  deleteOrder,
  detailOrder,
  estimatedDeliveryDay,
  estimatedConfirmedDay,
  exportOrder,
  orderTrash,
  permanentlyDeleteOrder,
  recoverOrder
}
