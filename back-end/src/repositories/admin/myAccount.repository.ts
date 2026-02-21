import AccountModel from '~/models/account.model'
import RoleModel from '~/models/role.model'

const findMyAccountById = async (account_id: string) => {
  const myAccount = await AccountModel.findOne({ 
    _id: account_id, 
    deleted: false 
  })

  return myAccount
}

const findRoleById = async (role_id: string) => {
  const role = await RoleModel.findOne({ 
    _id: role_id, 
    deleted: false 
  })

  return role
}

const isEmailExist = async (account_id: string, email: string) => {
  const isEmailExist = await AccountModel.findOne({
    _id: { $ne: account_id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
    email: email,
    deleted: false
  })

  return isEmailExist
}

const editMyAccount = async (account_id: string, dataTemp: any) => {
  await AccountModel.updateOne(
    { _id: account_id }, 
    dataTemp
  )
}

export const myAccountRepositories = {
  findMyAccountById,
  findRoleById,
  isEmailExist,
  editMyAccount
}

