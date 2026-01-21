import { QueryInterface, StatusInterface } from "~/interfaces/admin/general.interface"

const filterOrderHelpers = (query: QueryInterface): StatusInterface[] => {
  const filterOrder: StatusInterface[] = [
    {
      name: 'Tất cả',
      status: '',
      class: ''
    },
    {
      name: 'Chờ xử lý',
      status: 'PENDING',
      class: ''
    },
    {
      name: 'Đang vận chuyển',
      status: 'TRANSPORTING',
      class: ''
    },
    {
      name: 'Đã xác nhận',
      status: 'CONFIRMED',
      class: ''
    },
    {
      name: 'Đã hủy',
      status: 'CANCELED',
      class: ''
    }
  ]
  const target = query.status ?? ''
  const index = filterOrder.findIndex((item) => item.status === target)
  if (index >= 0) {
    filterOrder[index].class = 'CONFIRMED'
  }
  return filterOrder
}

export default filterOrderHelpers
