import { Types } from 'mongoose'

export interface RoleInterface {
  _id: Types.ObjectId
  title: string
  titleId: string
  description?: string | null
  permissions: string[]
  deleted: boolean
  deletedBy?: {
    account_id?: string | null
    deletedAt?: Date | null
  } | null
  updatedBy?: {
    account_id?: string | null
    updatedAt?: Date | null
  }[] 
  createdAt: Date
  updatedAt: Date
}