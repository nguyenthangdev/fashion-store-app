import type { RoleInfoInterface } from './role.interface'
import { STATUSES } from '~/utils/constants'
export interface AccountInfoInterface {
  _id: string
  fullName: string
  email: string
  // password: string
  phone: string
  avatar: string
  role_id: RoleInfoInterface
  status: typeof STATUSES[keyof typeof STATUSES]
}

export interface MyAccountAPIResponse {
  myAccount: AccountInfoInterface,
  role: RoleInfoInterface
}

export interface AccountsAPIResponse {
  accounts: AccountInfoInterface[],
  roles: RoleInfoInterface[]
}

export interface AccountAPIResponse {
  account: AccountInfoInterface,
  roles: RoleInfoInterface[]
}