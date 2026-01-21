import { Types } from 'mongoose'

export interface AccountInterface {
  _id: Types.ObjectId
  fullName: string
  email: string
  password?: string
  phone: string
  avatar?: string
  role_id?: Types.ObjectId
  status: 'ACTIVE' | 'INACTIVE'
  deleted: boolean
  deletedAt?: Date
  createdAt: Date
  updatedAt: Date
}
