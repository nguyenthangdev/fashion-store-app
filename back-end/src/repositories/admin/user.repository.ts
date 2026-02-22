import UserModel from '~/models/user.model'

const findAllUsers = async () => {
  const users = await UserModel.find({ deleted: false })

  return users
}

const changeStatusUser = async (status: string, user_id: string) => {
  await UserModel.updateOne(
    { _id: user_id }, 
    { $set: { status } }
  )
}

const isEmailExist = async (user_id: string, email: string) => {
  const isEmailExist = await UserModel.findOne({
    _id: { $ne: user_id }, // $ne ($notequal) -> Tránh trường hợp khi tìm bị lặp và không cập nhật lại lên đc.
    email: email,
    deleted: false
  })

  return isEmailExist
}

const editUser = async (user_id: string, dataTemp: any) => {
  await UserModel.updateOne({ 
    _id: user_id }, 
    { $set: dataTemp }
  )
}

const findUserById = async (user_id: string) => {
  const accountUser = await UserModel.findOne({ 
    _id: user_id, 
    deleted: false 
  })

  return accountUser
}

const deleteUser = async (user_id: string) => {
  await UserModel.updateOne(
    { _id: user_id }, 
    { $set: { deleted: true, deletedAt: new Date() } }
  )
}

export const userRepositories = {
  findAllUsers,
  changeStatusUser,
  isEmailExist,
  editUser,
  findUserById,
  deleteUser
}