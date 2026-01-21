import { Types } from "mongoose"
import { AccountInterface } from "~/interfaces/admin/account.interface"
import { RoleInterface } from "~/interfaces/admin/role.interface"

export interface AccountsWithRolesResponseDTO {
  accounts: AccountInterface[]
  roles: RoleInterface[]
}

export interface CreateAccountResponseDTO {
  success: boolean
  accountToObject?: AccountInterface
  code?: number
  message?: string
}

export interface CreateAccountDTO {
  fullName: string
  email: string
  password: string
  phone: String
  avatar: string
  role_id: Types.ObjectId | string
  status: 'ACTIVE' | 'INACTIVE'
}