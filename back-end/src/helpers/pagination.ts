import { PaginationInterface, QueryInterface } from "~/interfaces/admin/general.interface";

const paginationHelpers = (
  objectPagination: PaginationInterface,
  query: QueryInterface,
  countProducts: number
): PaginationInterface => {
  if (query.page) {
    if (typeof query.page === 'string') {
      objectPagination.currentPage = parseInt(query.page)
    }
  }
  objectPagination.skip =
    (objectPagination.currentPage - 1) * objectPagination.limitItems
  const totalPage = Math.ceil(countProducts / objectPagination.limitItems)

  objectPagination.totalPage = totalPage
  objectPagination.totalItems = countProducts
  return objectPagination
}

export default paginationHelpers
