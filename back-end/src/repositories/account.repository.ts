// import { AccountInterface } from '~/interfaces/admin/account.interface'
// import { RoleInterface } from '~/interfaces/admin/role.interface'
import { AccountInterface } from '~/interfaces/admin/account.interface'
import AccountModel from '~/models/account.model'
import RoleModel from '~/models/role.model'

const getAllAccounts = async () => {
  const accounts = await AccountModel
    .find({ deleted: false })
    .populate('role_id')
    .lean()
  
  return accounts 
}

const getAllRoles = async () => {
  const roles = await RoleModel
    .find({ deleted: false })
    .lean()

  return roles 
}

const isEmailExist = async (email: string) => {
  const account = await AccountModel
    .findOne({ email: email, deleted: false })
    .lean()

  return !!account
}

const changeAccountStatusById = async (account_id: string, status: string) => {
  await AccountModel.updateOne(
    { _id: account_id }, 
    { $set: { status } }
  )
}

const deleteAccountById = async (account_id: string) => {
  await AccountModel.updateOne(
    { _id: account_id },
    { $set: { deleted: true, deletedAt: new Date() } }
  )
}

const findAccountById = async (account_id: string) => {
  const account = await AccountModel
    .findOne({ _id: account_id, deleted: false })
    .populate('role_id')
    .lean()

  return account
}

const findAccountByEmail = async (email: string) => {
  const account = await AccountModel
    .findOne({ email: email, deleted: false })
    .lean()

  return account
}

const findAccountByUniqueEmail = async (email: string, account_id: string) => {
  const account = await AccountModel.findOne({
    _id: { $ne: account_id },
    email,
    deleted: false
  })

  return account
}

const editAccountById = async (account_id: string, data: AccountInterface) => {
  await AccountModel.updateOne(
    { _id: account_id }, 
    { $set: data }
  )
}

export const accountRepositories = {
  getAllAccounts,
  getAllRoles,
  isEmailExist,
  changeAccountStatusById,
  deleteAccountById,
  findAccountById,
  findAccountByEmail,
  findAccountByUniqueEmail,
  editAccountById
}