import Account from '~/models/account.model'
import { Request, Response } from 'express'
import { JWTProvider } from '~/providers/jwt.provider'
import { StatusCodes } from 'http-status-codes'
import Session from '~/models/session.model'
import crypto from 'crypto'
import { getCookieOptions } from '~/utils/constants'
import * as authService from '~/services/admin/auth.service'

// [POST] /admin/auth/login
export const loginAdmin = async (req: Request, res: Response) => {
  try {
    const {
      accessToken,
      refreshToken,
      role,
      accountAdmin
    } = await authService.loginAdmin(req.body)

    // const parser = new UAParser(req.get("User-Agent"))
    // const device = parser.getDevice()
    // const os = parser.getOS()
    // const browser = parser.getBrowser()
    // const session = new Session({
    //   accountId: accountAdmin._id,
    //   refreshTokenHash: hashToken(refreshToken),
    //   userAgent: req.get('User-Agent'),
    //   ip: req.ip,
    //   // deviceName: `${device.vendor || "Unknown"} ${device.model || ""} - ${os.name} - ${browser.name}`,
    //   deviceName: "Unknow",
    //   expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    // })
    // await session.save()

    res.cookie('accessToken', accessToken, getCookieOptions('14 days'))
    res.cookie('refreshToken', refreshToken, getCookieOptions('14 days'))

    res.json({ 
      code: 200, 
      message: 'Đăng nhập thành công!', 
      accountAdmin: accountAdmin,
      role: role
    })

  } catch (error) {
    res.json({
      code: error.statusCode || 400,
      message: error.message || 'Lỗi',
      error: error
    })
  }
}

// [POST] /admin/auth/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const newAccessToken = await authService.refreshTokenAdmin(req.cookies?.refreshToken)
    // const session = await Session.findOne({
    //   accountId: new mongoose.Types.ObjectId(refreshTokenDecoded.accountId),
    //   refreshTokenHash: hashToken(refreshToken)
    // })

    // if (!session) {
    //   res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Refresh Token không hợp lệ' })
    //   return
    // }
    
    // // Xóa phiên cũ, tạo phiên mới + accessToken mới
    // await session.deleteOne()

    

    // const newRefreshToken = await JWTProvider.generateToken(
    //   payload,
    //   process.env.JWT_REFRESH_TOKEN_SECRET_ADMIN,
    //   '14 days'
    // )
    // console.log("🚀 ~ auth.controller.ts ~ refreshToken ~ newRefreshToken:", newRefreshToken);

    res.cookie('accessToken', newAccessToken, getCookieOptions('14 days'))

    // res.cookie('refreshToken', newRefreshToken, {
    //   httpOnly: true,
    //   secure: true,
    //   sameSite: 'none',
    //   maxAge: ms('14 days'),
    //   path: '/'
    // })

    res.status(StatusCodes.OK).json({ message: 'Làm mới accessToken thành công!' })
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json( {message: 'RefreshToken invalid!'} )
  }
}
// [DELETE] /admin/auth/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessToken', getCookieOptions('14 days'))
    res.clearCookie('refreshToken', getCookieOptions('14 days'))

    res.json({ code: 200, message: "Đăng xuất thành công 1 thiết bị!" })
  } catch (error) {
    res.json({
      code: 400,
      error: error
    })
  }
}

// [POST] /auth/logout-all
export const logoutALL = async (req: Request, res: Response) => {
  try {
    const accessToken = req.cookies?.accessToken
    if (!accessToken) return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Không tồn tại accessToken' })
    const accessTokenDecoded = await JWTProvider.verifyToken(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET_ADMIN
    ) as {
      accountId: string,
      email: string,
      role_id: string
    }
    await Session.deleteMany({ accountId: accessTokenDecoded.accountId })

    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        path: '/'
      })

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/'
    })  

    res.status(StatusCodes.OK).json({ message: 'Đăng xuất thành công tất cả thiết bị!' })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export function hashToken(token: string): string {
  return crypto.createHash('sha256').update(token).digest('hex')
}