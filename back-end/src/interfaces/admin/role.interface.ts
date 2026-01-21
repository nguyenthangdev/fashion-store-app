import { Types } from "mongoose"

export interface RoleInterface {
  _id: Types.ObjectId
  title: string
  titleId: string
  description?: string
  permissions: string[]
  deleted: boolean
  deletedBy?: {
    account_id?: string
    deletedAt?: Date
  }
  updatedBy?: {
    account_id?: String
    updatedAt?: Date
  }[]
  createdAt: Date
  updatedAt: Date
}