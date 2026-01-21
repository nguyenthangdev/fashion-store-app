import AccountModel from "~/models/account.model"
import bcrypt from 'bcrypt'
import RoleModel from "~/models/role.model"
import { AccountInterface } from "~/interfaces/admin/account.interface"
import { AccountsWithRolesResponseDTO, CreateAccountDTO, CreateAccountResponseDTO } from "~/dtos/admin/account.dto"
import * as accountRepository from '~/repositories/account.repository'

export const getAccountsWithRoles = async ():Promise<AccountsWithRolesResponseDTO | null> => {
  const accounts = await accountRepository.getAllAccounts()
  if (!accounts) return null

  const roles = await accountRepository.getAllRoles()
  if (!roles) return null

  return { accounts, roles }
}
    
export const createAccount = async (dto: CreateAccountDTO): Promise<CreateAccountResponseDTO> => {
  const account = await accountRepository.isEmailExists(dto.email)

  if (account) {
    return { 
      success: false, 
      code: 409, 
      message: `Email ${dto.email} đã tồn tại`
    }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(dto.password, salt)

  const newAccount = new AccountModel({
    ...dto,
    password: hashedPassword
  })
  await newAccount.save()
  const accountToObject = newAccount.toObject()
  delete accountToObject.password

  return { success: true, accountToObject }
}

export const changeAccountStatus = async (status: string, account_id: string) => {
  await AccountModel.updateOne(
    { _id: account_id }, 
    { $set: { status } }
  )
}

export const editAccount = async (data: AccountInterface, account_id: string) => {
  const dataTemp = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    avatar: data.avatar,
    role_id: data.role_id,
    status: data.status
  }

  const isEmailExist = await AccountModel.findOne({
    _id: { $ne: account_id },
    email: dataTemp.email,
    deleted: false
  })
  if (isEmailExist) {
      return { 
          success: false, 
          code: 409, 
          message: `Email ${dataTemp.email} đã tồn tại`
      }
  }

  if (dataTemp.password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(dataTemp.password, salt)
    dataTemp.password = hashedPassword
  } else {
    delete dataTemp.password
  }
  await AccountModel.updateOne(
    { _id: account_id }, 
    { $set: dataTemp }
  )

  return { success: true }
}

export const accountDetail = async (account_id: string) => {
  const account = await AccountModel
    .findOne({ _id: account_id, deleted: false })
    .populate('role_id')
    .lean()

  const roles = await RoleModel
    .find({ deleted: false })
    .lean()

  return { account, roles }
}

export const deleteAccount = async (account_id: string) => {
  await AccountModel.updateOne(
    { _id: account_id },
    { $set: { deleted: true, deletedAt: new Date() } }
  )
}
