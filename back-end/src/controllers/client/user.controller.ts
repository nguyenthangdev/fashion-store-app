import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { getCookieOptions } from '~/utils/constants'
import { userServices } from '~/services/client/user.service'

// [POST] /user/register
export const register = async (req: Request, res: Response) => {
  try {
    const result = await userServices.register(req.body)
    if (!result.success) {
      res.status(StatusCodes.CONFLICT).json({
        code: result.code,
        message: result.message
      })
      return
    }

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Đăng ký tài khoản thành công, mời bạn đăng nhập lại để tiếp tục!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /user/login
export const login = async (req: Request, res: Response) => {
  try {
    const result = await userServices.login(req.body, req.cookies.cartId)
    if (!result.success) {
      const statusCode = result.code === 401 ? StatusCodes.UNAUTHORIZED : StatusCodes.FORBIDDEN
        
      res.status(statusCode).json({
        code: result.code,
        message: result.message
      })
      return
    }
    const { accessTokenUser, refreshTokenUser, userInfo, cartId  } = result
    
    res.cookie('accessTokenUser', accessTokenUser, getCookieOptions('1h'))
    res.cookie('refreshTokenUser', refreshTokenUser, getCookieOptions('14d'))
    res.cookie('cartId', cartId, getCookieOptions('30d'))

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Đăng nhập thành công!',
      accountUser: userInfo
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /user/refresh-token
export const refreshToken = async (req: Request, res: Response) => {
  try {
    const result = await userServices.refreshToken(req.cookies?.refreshTokenUser)
    if (!result.success) {
      const statusCode = result.code === 401 ? StatusCodes.UNAUTHORIZED : StatusCodes.NOT_FOUND
      res.status(statusCode).json({
        code: result.code,
        message: result.message
      })
      return
    }
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
    const { newAccessTokenUser } = result
    res.cookie('accessTokenUser', newAccessTokenUser, getCookieOptions('1h'))

    res.status(StatusCodes.OK).json({ 
      message: 'Làm mới accessTokenUser thành công!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /user/logout
export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie('accessTokenUser', getCookieOptions('1h'))
    res.clearCookie('refreshTokenUser', getCookieOptions('14d'))

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Đăng xuất thành công!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /user/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  try {
    const result = await userServices.forgotPasswordPost(req.body.email)
    if (!result.success) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: result.code,
        message: result.message
      })
    }
  

    // // Lưu thông tin vào db
    // const otp = generateHelper.generateRandomNumber(6)
    // const objectForgotPassword = {
    //   email: email,
    //   otp: otp,
    //   expireAt: Date.now()
    // }
    // const record = await ForgotPasswordModel.findOne({
    //   email: email
    // })
    // const forgotPassword = new ForgotPasswordModel(objectForgotPassword)
    // // Tránh trường hợp gửi otp liên tục mà phải hết hạn otp đó thì mới gửi otp khác.
    // if (!record) {
    //   res.json({
    //     code: 200,
    //     message:
    //       'Mã OTP đã được gửi qua email của bạn, vui lòng kiểm tra email!'
    //   })
    //   await forgotPassword.save()
    // }
    // // Nếu tồn tại email thì gửi mã OTP qua email
    // const subject = 'Mã OTP xác minh lấy lại mật khẩu'
    // const html = `
    //   Mã OTP để lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 2 phút.
    // `

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Chúng tôi đã gửi một link lấy lại mật khẩu qua email của bạn. Vui lòng kiểm tra hộp thư.'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// // [POST] /user/password/otp
// export const otpPasswordPost = async (req: Request, res: Response) => {
//   try {
//     const email = req.body.email
//     const otp = req.body.otp
//     const result = await ForgotPasswordModel.findOne({
//       email: email,
//       otp: otp
//     })
//     if (!result) {
//       res.json({
//         code: 401,
//         message: 'OTP không hợp lệ!'
//       })
//       return
//     }
//     const user = await UserModel.findOne({
//       email: email
//     })
//     res.cookie('tokenUser', user.tokenUser)
//     res.json({
//       code: 200,
//       message: 'Mã OTP hợp lệ!'
//     })
//   } catch (error) {
//     res.json({
//       code: 400,
//       message: 'Lỗi!',
//       error: error
//     })
//   }
// }

// [POST] /user/password/reset
export const resetPasswordPost = async (req: Request, res: Response) => {
  try {
    const result = await userServices.resetPasswordPost(req.body)
    // console.log("🚀 ~ user.controller.ts ~ resetPasswordPost ~ result:", result);
    if (!result.success) {
      const statusCode = result.code === 401 ? StatusCodes.UNAUTHORIZED : StatusCodes.NOT_FOUND
      return res.status(statusCode).json({
        code: result.code,
        message: result.message
      })
    }
    return res.json({
      code: 200,
      message: 'Đổi mật khẩu thành công! Bạn có thể đăng nhập.'
    })
  } catch (error: any) {
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.BAD_REQUEST).json({ 
        code: 400, 
        message: 'Link đã hết hạn (quá 15 phút). Vui lòng yêu cầu lại!' 
      })
    }
    return res.status(StatusCodes.UNAUTHORIZED).json({ 
      code: 401, 
      message: 'Token không hợp lệ!' 
    })
  }
}

// [GET] /user/account/info
export const info = async (req: Request, res: Response) => {
  try {
    const accountUser = req['accountUser'] 

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thông tin tài khoản!',
      accountUser: accountUser
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /user/account/info/edit
export const editUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.editUser(req['accountUser']._id, req.body)
    if (!result.success) {
      return res.status(StatusCodes.CONFLICT).json({
        code: result.code,
        message: result.message
      })
    }

    res.json({
      code: 200,
      message: 'Đã cập nhật thành công tài khoản!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /user/account/info/change-password
export const changePasswordUser = async (req: Request, res: Response) => {
  try {
    const result = await userServices.changePasswordUser(req['accountUser']._id, req.body)
    if (!result.success) {
      const statusCode = result.code === 404 ? StatusCodes.NOT_FOUND : StatusCodes.BAD_REQUEST
      return res.status(statusCode).json({
        code: result.code,
        message: result.message
      })
    }
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Đã đổi mật khẩu tài khoản thành công!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /user/my-orders
export const getOrders = async (req: Request, res: Response) => {
  try {
    const {
      orders,
      objectSearch,
      objectPagination
    } = await userServices.getOrders(req["accountUser"]._id, req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      orders: orders,
      keyword: objectSearch.keyword,
      pagination: objectPagination,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /user/my-orders/cancel-order/:id
export const cancelOrder = async (req: Request, res: Response) => {
  try {
    await userServices.cancelOrder(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Hủy thành công đơn hàng!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /user/auth/google/callback
export const googleCallback = async (req: Request, res: Response) => {
  try {
    // 1. Nhận user từ Passport (đã được xác thực bởi passport.ts)
    const user = req.user as any

    if (!user) {
      return res.redirect(`${process.env.CLIENT_URL}/user/login?error=auth_failed`)
    }
    // Nếu không có user hoặc user bị khóa
    if (user.status === 'INACTIVE') {
      return res.redirect(`${process.env.CLIENT_URL}/user/login?error=account_locked`)
    }
    const { 
      accessTokenUser, 
      refreshTokenUser, 
      finalCartId 
    } = await userServices.googleCallback(req.cookies.cartId, user)


    // 4. Gửi JWT về client qua cookie
    const redirectUrl = new URL(`${process.env.CLIENT_URL}/auth/google/callback`)
    redirectUrl.searchParams.set('accessTokenUser', accessTokenUser)
    redirectUrl.searchParams.set('refreshTokenUser', refreshTokenUser)
    redirectUrl.searchParams.set('cartId', finalCartId)

    // 5. Chuyển hướng người dùng về trang chủ React
    res.redirect(redirectUrl.toString())

  } catch (error) {
    console.error("LỖI GOOGLE CALLBACK:", error)
    res.redirect(`${process.env.CLIENT_URL}/user/login?error=server_error`)
  }
}

// [POST] /user/set-auth-cookies
export const setAuthCookies = async (req: Request, res: Response) => {
  try {
    const { accessTokenUser, refreshTokenUser, cartId } = req.body

    res.cookie('accessTokenUser', accessTokenUser, getCookieOptions('1h'))
    res.cookie('refreshTokenUser', refreshTokenUser, getCookieOptions('14d'))

    if (cartId) {
      res.cookie('cartId', cartId, getCookieOptions('30d'))
    }

    res.status(StatusCodes.OK).json({ 
      success: true, 
      message: "Đã set cookies thành công" 
    })
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ 
      success: false, 
      message: "Token không hợp lệ" 
    })
  }
}