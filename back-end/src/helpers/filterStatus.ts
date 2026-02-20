import { QueryInterface, StatusInterface } from "~/interfaces/admin/general.interface"

const filterStatusHelpers = (query: QueryInterface): StatusInterface[] => {
  const statuses: StatusInterface[] = [
    { name: 'Tất cả', status: '', class: '' },
    { name: 'Hoạt động', status: 'ACTIVE', class: '' },
    { name: 'Ngừng hoạt động', status: 'INACTIVE', class: '' }
  ]

  const target = query.status ?? ''
  const index = statuses.findIndex((item) => item.status === target)

  if (index >= 0) {
    statuses[index].class = 'ACTIVE'
  }

  return statuses
}

export default filterStatusHelpers
