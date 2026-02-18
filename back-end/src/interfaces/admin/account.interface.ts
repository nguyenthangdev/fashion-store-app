import { Types } from 'mongoose'

export interface AccountInterface {
  _id: Types.ObjectId
  fullName: string
  email: string
  password: string
  phone: string
  avatar?: string | null
  role_id: Types.ObjectId
  status: 'ACTIVE' | 'INACTIVE'
  deleted: boolean
  createdAt: Date
  updatedAt?: Date | null
}