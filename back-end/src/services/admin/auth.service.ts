import bcrypt from 'bcrypt' 
import { JWTProvider } from '~/providers/jwt.provider'
import { authRepositories } from '~/repositories/auth.repository'

export const loginAdmin = async (data: any) => {
  const { email, password } = data

  const accountAdmin = await authRepositories.findAccountByEmail(email)

  if (!accountAdmin) {
    return { 
      success: false, 
      code: 401, 
      message: 'Tài khoản hoặc mật khẩu không chính xác!' 
    }
  }

  const isMatch = await bcrypt.compare(password, accountAdmin.password)

  if (!isMatch) {
    return { 
      success: false, 
      code: 401 ,
      message: 'Tài khoản hoặc mật khẩu không chính xác!' 
    }
  }

  if (accountAdmin.status === 'INACTIVE') {
    return { 
      success: false, 
      code: 403, 
      message: 'Tài khoản đã bị khóa!' 
    }
  }

  const payload = {
    accountId: accountAdmin._id,
    email: accountAdmin.email,
    role_id: accountAdmin.role_id 
  }

  const accessToken = JWTProvider.generateToken(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN as string, 
    '1h'
  )

  const refreshToken = JWTProvider.generateToken(
    payload,
    process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN as string,
    '14d'
  )
  const role = await authRepositories.findRoleById(accountAdmin.role_id.toString())

  const accountToObject = accountAdmin.toObject()
  delete accountToObject.password

  return {
    success: true,
    accessToken,
    refreshToken,
    role,
    accountAdmin: accountToObject,
  }
}

export const refreshTokenAdmin = async (refreshToken: string) => {
  if (!refreshToken) {
    return { 
      success: false, 
      code: 401, 
      message: 'Không tồn tại refreshToken!' 
    }
  }

  const refreshTokenDecoded = JWTProvider.verifyToken(
    refreshToken, 
    process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN as string
  ) as {
    accountId: string,
    email: string,
    role_id: string
  }

  const account = await authRepositories.findAccountById(refreshTokenDecoded.accountId)
  
  if (!account) {
    return { 
      success: false, 
      code: 404, 
      message: 'Tài khoản không tồn tại!' 
    }
  }

  const payload = { 
    accountId: refreshTokenDecoded.accountId, 
    email: refreshTokenDecoded.email, 
    role_id: refreshTokenDecoded.role_id, 
  }

  const newAccessToken = JWTProvider.generateToken(
    payload,
    process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN as string,
    '1h'
  )
  return {
    success: true,
    newAccessToken
  }
}

export const authServices = {
  loginAdmin,
  refreshTokenAdmin
}