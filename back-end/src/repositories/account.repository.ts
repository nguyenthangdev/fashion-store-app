import { AccountInterface } from "~/interfaces/admin/account.interface"
import { RoleInterface } from "~/interfaces/admin/role.interface"
import AccountModel from "~/models/account.model"
import RoleModel from "~/models/role.model"

export const getAllAccounts = async ():Promise<AccountInterface[]> => {
  const accounts = await AccountModel
    .find({ deleted: false })
    .populate('role_id')
    .lean()

  return accounts 
}

export const getAllRoles = async ():Promise<RoleInterface[]> => {
  const roles = await RoleModel
    .find({ deleted: false })
    .lean()

  return roles 
}

export const isEmailExists = async (email: string): Promise<boolean> => {
  const account = await AccountModel
    .findOne({ email: email, deleted: false })
    .lean()

  return !!account
}