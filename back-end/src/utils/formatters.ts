import { pick } from 'lodash'
import { AccountInterface } from '~/interfaces/admin/account.interface'

export const pickAccount = (accountInfo: AccountInterface) => {
  if (!accountInfo) return {}
  return pick(accountInfo, ['_id', 'fullName', 'email', 'phone', 'avatar', 'role_id', 'status', 'createdAt', 'updatedAt'])
}