import { Request, Response, NextFunction } from 'express'
import Account from '~/models/account.model'
import { StatusCodes } from 'http-status-codes'
import { JWTProvider } from '~/providers/jwt.provider'

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const accessToken = req.cookies?.accessToken
  if (!accessToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Vui lòng gửi kèm token!' })
    return
  }
  try {
    const accessTokenDecoded = await JWTProvider.verifyToken(
      accessToken, 
      process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN
    ) as {
      accountId: string,
      email: string,
      role_id: string  
    }
    const accountAdmin = await Account.findOne({
      _id: accessTokenDecoded.accountId,
      deleted: false,
      status: 'active'
    }).select('-password')
  
    if (!accountAdmin) {
      res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token không hợp lệ!' })
      return
    }

    req['accountAdmin'] = accountAdmin
    next()

  } catch (error) {
    if (error.message?.includes('jwt expired')) {
      res.status(StatusCodes.GONE).json({ message: 'Cần refresh token mới!' })
      return
    }
    res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Token không hợp lệ, vui lòng đăng nhập lại!' })
    return
  }
}