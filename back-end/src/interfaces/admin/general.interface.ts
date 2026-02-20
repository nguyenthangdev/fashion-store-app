export interface TreeInterface {
  _id: any
  parent_id: string
  [key: string]: any
  index?: number
  children?: TreeInterface[]
}

interface UserLogInterface {
  account_id: string
  fullName: string
}

export interface LogNodeInterface extends TreeInterface {
  createdBy?: UserLogInterface
  lastUpdatedBy?: UserLogInterface & { updatedAt?: string }
}

export interface UpdatedByInterface {
  account_id: string
  updatedAt: Date
}

export interface StatusInterface {
  name: string
  status: string
  class: string
}

export interface SearchInterface {
  slug?: RegExp
  keyword: string
  regex?: RegExp
  fullName?: RegExp
}

export interface QueryInterface {
  status?: string
  sortKey?: string
  sortValue?: 'asc' | 'desc'
  keyword?: string
  page?: string
}

export interface PaginationInterface {
  currentPage: number
  limitItems: number
  skip: number
  totalPage: number
  totalItems: number
}

interface OrConditionInterface {
  title?: RegExp
  slug?: RegExp
}

export interface FindInterface {
  deleted: boolean
  status?: string
  $or?: OrConditionInterface[]
}