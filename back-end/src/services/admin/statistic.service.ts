import { statisticRepositories } from '~/repositories/admin/statistic.repository'

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
  const result = await statisticRepositories.getStatistic()

  const currentMonth = new Date().getMonth() + 1
  const currentMonthData = result.find(r => r._id === currentMonth)
  const currentMonthRevenue = currentMonthData ? currentMonthData.totalRevenue : 0

  const labels = result.map(month => `Tháng ${month._id}`)
  const data = result.map(revenue => revenue.totalRevenue)

  statistic.user.total = await statisticRepositories.countUser()

  statistic.product.total = await statisticRepositories.countProduct()

  statistic.order.total = await statisticRepositories.countOrder()

  statistic.revenue.total = currentMonthRevenue

  return {
    statistic,
    labels,
    data
  }
}

export const statisticServices = {
  getStatistic
}