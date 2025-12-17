import { Request, Response, NextFunction } from 'express'
import Joi from "joi"

export const registerPost = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    fullName: Joi.string()
      .required()
      .min(5)
      .max(50)
      .trim()
      .messages({
        "string.empty": "Vui lòng nhập họ tên!",
        "string.min": "Họ tên phải có ít nhất 5 ký tự!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
      email: Joi.string()
        .required()
        .email()
        .lowercase()
        .trim()
        .messages({
          "string.empty": "Vui lòng nhập email của bạn!",
          "string.email": "Email không đúng định dạng!"
        }),
      password: Joi.string()
        .required()
        .min(8)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
        .messages({
          "string.empty": "Vui lòng nhập mật khẩu!",
          "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
          "string.pattern.base": "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
        }),
      confirmPassword: Joi.string()
        .required()
        .valid(Joi.ref('password'))
        .messages({
          "string.empty": "Vui lòng xác nhận mật khẩu!",
          "any.only": "Mật khẩu xác nhận không khớp!"
        }),
  })
  const { error, value  } = schema.validate(req.body, {
    abortEarly: false,      // Hiển thị tất cả lỗi
    stripUnknown: true,     // Loại bỏ trường không có trong schema (Chống hacker gửi linh tinh lên)
    convert: true           // Chuyển đổi kiểu dữ liệu (Form HTML thường gửi data dạng STRING)
  })
  if (error) {
    const errors = error.details.map(detail => detail.message);
    res.json({
      code: 400,
      message: errors[0],
      errors
    })
    return
  }
  req.body = value;
  next()
}

export const loginPost = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập email!'
    })
    return
  }

  if (!req.body.password) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu!'
    })
    return
  }
  next()
}

export const forgotPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.email) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập email!'
    })
    return
  }
  next()
}

export const otpPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.otp) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mã OTP!'
    })
    return
  }
  next()
}

export const resetPasswordPost = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.password) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu!'
    })
    return
  }
  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập xác nhận mật khẩu!'
    })
    return
  }
  if (req.body.password != req.body.confirmPassword) {
    res.json({
      code: 400,
      message: 'Mật khẩu không khớp, vui lòng nhập lại!'
    })
    return
  }
  next()
}

export const editPatch = (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập họ tên!'
    })
    return
  }

  if (!req.body.email) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập email!'
    })
    return
  }
  next()
}

export const changePasswordPatch = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.currentPassword) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu hiện tại!'
    })
    return
  }
  if (!req.body.password) {
    res.json({
      code: 400,
      message: 'Vui lòng nhập mật khẩu mới!'
    })
    return
  }
  if (!req.body.confirmPassword) {
    res.json({
      code: 400,
      message: 'Vui lòng xác nhận nhập mật khẩu!'
    })
    return
  }
  if (req.body.password != req.body.confirmPassword) {
    res.json({
      code: 400,
      message: 'Mật khẩu không khớp, vui lòng nhập lại!'
    })
    return
  }
  next()
}
