import ProductModel from '~/models/product.model'
import UserModel from '~/models/user.model'
import OrderModel from '~/models/order.model'

export const getStatistic = async () => {
  const statistic = {
    user: {
      total: 0,
    },
    product: {
      total: 0,
    },
    order: {
      total: 0,
    },
    revenue: {
      total: 0,
    }
  }
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

  const currentMonth = new Date().getMonth() + 1
  const currentMonthData = result.find(r => r._id === currentMonth)
  const currentMonthRevenue = currentMonthData ? currentMonthData.totalRevenue : 0

  const labels = result.map(month => `Tháng ${month._id}`)
  const data = result.map(revenue => revenue.totalRevenue)

  statistic.user.total = await UserModel.countDocuments({
    deleted: false
  })

  statistic.product.total = await ProductModel.countDocuments({
    deleted: false
  })

  statistic.order.total = await OrderModel.countDocuments({
    deleted: false
  })

  statistic.revenue.total = currentMonthRevenue
  return {
    statistic,
    labels,
    data
  }
}