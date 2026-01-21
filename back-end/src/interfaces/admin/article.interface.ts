import { Types } from 'mongoose'

// export interface ArticleInterface {
//   title: string
//   article_category_id: string
//   featured: string
//   descriptionShort: string
//   descriptionDetail: string
//   status: 'ACTIVE' | 'INACTIVE'
//   thumbnail: any
// }

export interface ArticleInterface {
  _id: Types.ObjectId | string

  title: string
  article_category_id?: string

  descriptionShort?: string
  descriptionDetail?: string
  thumbnail?: string

  status: 'ACTIVE' | 'INACTIVE'
  featured?: string
  slug?: string

  deleted: boolean

  createdBy?: {
    account_id: Types.ObjectId | string
  }

  deletedBy?: {
    account_id: Types.ObjectId | string
    deletedAt?: Date
  }

  updatedBy?: Array<{
    account_id: Types.ObjectId | string
    updatedAt?: Date
  }>

  recoveredAt?: Date

  createdAt?: Date
  updatedAt?: Date
}
