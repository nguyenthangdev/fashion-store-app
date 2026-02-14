import { Request } from 'express';

export interface GeneralRequest extends Request {
  accountAdmin?: any
  cartId?: string
  totalProduct?: number
  fileUrls?: string[]
  layoutProductsCategory?: any
  layoutArticlesCategory?: any
  accountUser?: any
  settingsGeneral?: any
}
