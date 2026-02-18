import type { STATUSES } from '~/utils/constants'

export interface UserInfoInterface {
  _id: string,
  fullName: string,
  email: string,
  address: string,
  status: typeof STATUSES[keyof typeof STATUSES]
  avatar: string,
  phone: string,
  password: string
}


export interface UsersDetailInterface {
  users: UserInfoInterface[],
}

export interface UserAPIResponse {
  accountUser: UserInfoInterface,
  code: number,
  message: string
}