import AccountModel from '~/models/account.model'
import bcrypt from 'bcrypt'
import { AccountInterface } from '~/interfaces/admin/account.interface'
// import { AccountsWithRolesResponseDTO, CreateAccountDTO, CreateAccountResponseDTO } from '~/dtos/admin/account.dto'
import { accountRepositories } from '~/repositories/account.repository'
import { CreateAccountDTO } from '~/dtos/admin/account.dto'
import { pickAccount } from '~/utils/formatters'

const getAllAccounts = async () => {
  const accounts = accountRepositories.getAllAccounts()
  
  return accounts || []
}

const getAllRoles = async () => {
  const roles = accountRepositories.getAllRoles()
  
  return roles || []
}

const createAccount = async (reqBody: CreateAccountDTO) => {
  const data = {
    ...reqBody
  }
  
  const account = await accountRepositories.findAccountByEmail(data.email)

  if (account) {
    return { 
      success: false, 
      code: 409, 
      message: `Email ${data.email} đã tồn tại`
    }
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(data.password, salt)

  const newAccount = new AccountModel({
    ...data,
    password: hashedPassword
  })

  await newAccount.save()
  const accountToObject = newAccount.toObject() as AccountInterface

  return { success: true, accountToObject: pickAccount(accountToObject) }
}

const changeAccountStatusById = async (account_id: string, status: string) => {
  await accountRepositories.changeAccountStatusById(account_id, status)
}

const editAccountById = async (reqBody: AccountInterface, account_id: string) => {
  const data = {
    ...reqBody
  }

  const account = await accountRepositories.findAccountByUniqueEmail(data.email, account_id)
  if (account) {
    return { 
      success: false, 
      code: 409, 
      message: `Email ${data.email} đã tồn tại`
    }
  }

  if (data.password) {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(data.password, salt)
    data.password = hashedPassword
  }
  await accountRepositories.editAccountById(account_id, data)

  return { success: true }
}

const accountDetail = async (account_id: string) => {
  const account = await accountRepositories.findAccountById(account_id)

  return account
}

const deleteAccountById = async (account_id: string) => {
  await accountRepositories.deleteAccountById(account_id)
}

export const accountServices = {
  getAllAccounts,
  getAllRoles,
  createAccount,
  changeAccountStatusById,
  editAccountById,
  accountDetail,
  deleteAccountById
}