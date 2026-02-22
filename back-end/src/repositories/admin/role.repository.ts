import RoleModel from '~/models/role.model'
import AccountModel from '~/models/account.model'

const findAllRoles = async () => {
  const roles = await RoleModel.find({ deleted: false }).lean()

  return roles
}

const findAccountById = async (account_id: string) => {
  const userUpdated = await AccountModel.findOne({
    _id: account_id
  }).lean()

  return userUpdated
}

const findAllAccounts = async () => {
  const accounts = await AccountModel.find({ deleted: false }).lean()

  return accounts
}

const editRole = async (role_id: string, dataTemp: any, updatedBy: any) => {
  await RoleModel.updateOne(
    { _id: role_id },
    {
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

const deleteRole = async (role_id: string, account_id: string) => {
  await RoleModel.updateOne(
    { _id: role_id },
    {
      $set: {
        deleted: true,
        deletedBy: {
          account_id: account_id,
          deletedAt: new Date()
        }
      }
    }
  )
}

const findRoleById = async (role_id: string) => {
  const role = await RoleModel.findOne({ 
    _id: role_id, 
    deleted: false 
  }).lean()
    
  return role
}

const findById = async (role_id: string) => {
  const existing = await RoleModel.findById(role_id)

  return existing
}

const permissionsPatch = async (role_id: string, permissions: any) => {
  await RoleModel.updateOne(
    { _id: role_id },
    { $set: { permissions: permissions }}
  )
}

export const roleRepositories = {
  findAllRoles,
  findAccountById,
  findAllAccounts,
  editRole,
  deleteRole,
  findRoleById,
  findById,
  permissionsPatch
}