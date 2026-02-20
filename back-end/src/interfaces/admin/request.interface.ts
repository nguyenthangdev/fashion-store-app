import { Request } from 'express'
import { AccountInterface } from './account.interface'

export interface AuthRequest extends Request {
  accountAdmin: AccountInterface
}
