import AccountModel from '~/models/account.model'
import RoleModel from '~/models/role.model'


const findAccountByEmail = async (email: string) => {
  const accountAdmin = await AccountModel.findOne({
    email: email,
    deleted: false
  }).select('+password')

  return accountAdmin
}

const findRoleById = async (role_id: string) => {
  const role = await RoleModel.findOne({ 
    _id: role_id, 
    deleted: false 
  }).lean()

  return role
}

const findAccountById = async (accountId: string) => {
  const account = await AccountModel.findOne({
    _id: accountId,
    deleted: false,
    status: "ACTIVE"
  }).lean()

  return account
}

export const authRepositories = {
  findAccountByEmail,
  findRoleById,
  findAccountById
}