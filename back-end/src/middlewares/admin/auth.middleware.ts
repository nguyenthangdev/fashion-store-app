import { Request, Response, NextFunction } from 'express'
import AccountModel from '~/models/account.model'
import { StatusCodes } from 'http-status-codes'
import { JWTProvider } from '~/providers/jwt.provider'
import RoleModel from '~/models/role.model'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const accessToken = req.cookies?.accessToken
    if (!accessToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vui lòng gửi kèm token!' })
    }

    const accessTokenDecoded = JWTProvider.verifyToken(
      accessToken, 
      process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN as string
    ) as {
      accountId: string,
      email: string,
      role_id: string  
    }

    if (!accessTokenDecoded) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token không hợp lệ!!' })
    }
  
    const accountAdmin = await AccountModel.findOne({
      _id: accessTokenDecoded.accountId,
      deleted: false,
      status: 'ACTIVE'
    }).lean()

    if (!accountAdmin) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Người quản trị không tồn tại!' })
    }

    const role = await RoleModel.findOne({
      _id: accountAdmin.role_id,
      deleted: false
    })

    if (!role){
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'Không thể xác định quyền tài khoản!' })
    }

    req['accountAdmin'] = accountAdmin
    req['accountAdmin.roleName'] = role.titleId

    next()
  } catch (error: any) {
    if (error.message?.includes('jwt expired')) {
      return res.status(StatusCodes.GONE).json({ message: 'Cần refresh token mới!' })
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại!' })
  }
}