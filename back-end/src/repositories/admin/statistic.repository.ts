import ProductModel from '~/models/product.model'
import UserModel from '~/models/user.model'
import OrderModel from '~/models/order.model'

const getStatistic = async () => {
  const result = await OrderModel.aggregate([
    { $match: { "paymentInfo.status": "PAID" } }, // chỉ tính đơn đã thanh toán
    {
      $group: {
        _id: { $month: "$createdAt" },            // group theo tháng
        totalRevenue: { $sum: "$amount" }     // cộng dồn doanh thu
      }
    },
    { $sort: { "_id": 1 } } // sắp xếp theo tháng tăng dần
  ])

  return result
}

const countUser = async () => {
  const result = await UserModel.countDocuments({
    deleted: false
  })

  return result
}

const countProduct = async () => {
  const result = await ProductModel.countDocuments({
    deleted: false
  })

  return result
}

const countOrder = async () => {
  const result = await OrderModel.countDocuments({
    deleted: false
  })

  return result
}
export const statisticRepositories = {
  getStatistic,
  countUser,
  countProduct,
  countOrder
}