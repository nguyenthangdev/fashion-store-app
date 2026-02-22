import bcrypt from 'bcrypt'
import { UserInterface } from '~/interfaces/admin/user.interface'
import { userRepositories } from '~/repositories/admin/user.repository'

const getUsers = async () => {
  const users = await userRepositories.findAllUsers()

  return users
}

const changeStatusUser = async (status: string, user_id: string) => {
  await userRepositories.changeStatusUser(status, user_id)
}

const editUser = async (data: UserInterface, user_id: string) => {
  const dataTemp = {
    fullName: data.fullName,
    email: data.email,
    password: data.password,
    phone: data.phone,
    avatar: data.avatar,
    address: data.address,
    status: data.status
  }
  const isEmailExist = await userRepositories.isEmailExist(user_id, dataTemp.email)

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
    delete dataTemp.password // Xóa value password, tránh cập nhật lại vào db xóa mất mật khẩu cũ
  }

  await userRepositories.editUser(user_id, dataTemp)

  return { success: true }
}

const detailUser = async (user_id: string) => {
  const accountUser = await userRepositories.findUserById(user_id)

  return accountUser
}

const deleteUser = async (user_id: string) => {
  await userRepositories.deleteUser(user_id)
}

export const userServices = {
  getUsers,
  changeStatusUser,
  editUser,
  detailUser,
  deleteUser
}