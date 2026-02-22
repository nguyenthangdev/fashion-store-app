import RoleModel from '~/models/role.model'
import { RoleInterface } from '~/interfaces/admin/role.interface'
import { roleRepositories } from '~/repositories/admin/role.repository'

const getRoles = async () => {
  const roles = await roleRepositories.findAllRoles()
  for (const record of roles) {
    // Lấy ra thông tin người cập nhật
    const updatedBy = record.updatedBy[record.updatedBy.length - 1] // Lấy phần tử cuối của mảng updatedBy
    if (updatedBy) {
      const userUpdated = await roleRepositories.findAccountById(updatedBy.account_id)
      updatedBy['accountFullName'] = userUpdated.fullName
    }
  }

  const accounts = await roleRepositories.findAllAccounts()

  return { roles, accounts }
}

const createRole = async (data: RoleInterface) => {
  const dataTemp = {
    title: data.title,
    titleId: data.titleId,
    description: data.description
  }
  const role = new RoleModel(dataTemp)
  await role.save()
  const roleToObject = role.toObject()

  return roleToObject
}

const editRole = async (account_id: string, role_id: string, data: RoleInterface) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    titleId: data.titleId,
    description: data.description
  }
  await roleRepositories.editRole(role_id, dataTemp, updatedBy)
}

const deleteRole = async (role_id: string, account_id: string) => {
  await roleRepositories.deleteRole(role_id, account_id)
}

const detailRole = async (role_id: string) => {
  const role = await roleRepositories.findRoleById(role_id)

  return role
}

const permissionsPatch = async (permissionRequireList: any) => {
  for (const item of permissionRequireList) {
    const existing = await roleRepositories.findById(item._id)

    if (!existing) continue

    await roleRepositories.permissionsPatch(item._id, item.permissions)
  }
}

export const roleServices = {
  getRoles,
  createRole,
  editRole,
  deleteRole,
  detailRole,
  permissionsPatch
}