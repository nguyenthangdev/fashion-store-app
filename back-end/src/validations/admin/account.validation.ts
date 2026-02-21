import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'
import Joi from 'joi'
import mongoose from 'mongoose'

export const createAccount = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(50)
      .messages({
        "any.required": 'Họ và tên là bắt buộc!',
        "string.empty": "Họ và tên không được để trống!",
        "string.min": "Họ và tên phải có ít nhất 3 ký tự!",
        "string.max": "Họ và tên không được vượt quá 50 ký tự!"
      }),

    email: Joi.string()
      .trim()
      .required()
      .min(1)
      .email()
      .lowercase()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Email không được để trống!",
        "string.email": "Email không đúng định dạng!"
      }),

    password: Joi.string()
      .trim()
      .required()
      .min(8)
      .pattern(/[A-Z]/)
      .pattern(/[a-z]/)
      .pattern(/[0-9]/)
      .pattern(/[@$!%*?&]/)
      .messages({
        "any.required": "Mật khẩu là bắt buộc!",
        "string.empty": "Mật khẩu không được để trống!",
        "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
        "string.pattern.base": "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
      }),

    phone: Joi.string()
      .trim()
      .required()
      .min(1)
      .pattern(/^(0[35789]\d{8}|\+84[35789]\d{8})$/)
      .messages({
        "any.required": "Số điện thoại là bắt buộc!",
        "string.empty": "Số điện thoại không được để trống!",
        "string.pattern.base": "Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!"
      }),

    role_id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error('any.invalid')
        }
        return value
      })
      .messages({
        'any.required': 'Phân quyền là bắt buộc!',
        'string.empty': 'Phân quyền không được để trống!',
        'any.invalid': 'Phân quyền không hợp lệ!'
      }),

    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required()
      .messages({
        'any.only': 'Trạng thái phải là ACTIVE hoặc INACTIVE!',
        'any.required': 'Trạng thái là bắt buộc!'
      }),
      
    avatar: Joi.string()
      .trim()
      .optional()
      .allow(null, '')
      .uri()
      .messages({
        "string.uri": "URL avatar không hợp lệ!"
      })
    })

  const { error, value  } = schema.validate(req.body, {
    abortEarly: false,      
    stripUnknown: true,     
    convert: true           
  })
  if (error) {
    const errors = error.details.map(detail => detail.message)
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: 400,
      message: errors[0],
      errors
    })
  }

  req.body = value
  next()
}

export const editAccountById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    fullName: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(50)
      .trim()
      .messages({
        "any.required": "Họ tên là bắt buộc!",
        "string.empty": "Họ và tên không được để trống!",
        "string.max": "Họ tên không được vượt quá 50 ký tự!"
      }),
    
    email: Joi.string()
      .trim()
      .required()
      .min(1)
      .email()
      .lowercase()
      .messages({
        "any.required": "Email là bắt buộc!",
        "string.empty": "Email không được để trống!",
        "string.email": "Email không đúng định dạng!"
      }),
    
    password: Joi.string()
      .optional() 
      .allow('', null)
      .when(Joi.string().trim().min(1), {
        then: Joi.string()
          .min(8)
          .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
          .messages({
            "string.min": "Mật khẩu phải chứa ít nhất 8 ký tự!",
            "string.pattern.base":
              "Mật khẩu phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt (@$!%*?&)!"
          }),
      }),
    
    phone: Joi.string()
      .trim()
      .required()
      .min(1)
      .pattern(/^(0[35789]\d{8}|\+84[35789]\d{8})$/)
      .messages({
        "any.required": "Số điện thoại là bắt buộc!",
        "string.empty": "Số điện thoại không được để trống!",
        "string.pattern.base": "Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!"
      }),
    
    role_id: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.error('any.invalid')
        }
        return value
      })
      .messages({
        'any.required': 'Phân quyền là bắt buộc!',
        'string.empty': 'Phân quyền không được để trống!',
        'any.invalid': 'Phân quyền không hợp lệ!'
      }),
    
    status: Joi.string()
      .valid('ACTIVE', 'INACTIVE')
      .required()
      .messages({
        "any.only": "Trạng thái phải là ACTIVE hoặc INACTIVE!",
        "any.required": "Trạng thái là bắt buộc!"
      }),
    avatar: Joi.string()
      .optional()
      .allow(null, '')
      .uri()
      .messages({
        "string.uri": "URL avatar không hợp lệ!"
      })
  })

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,    
    stripUnknown: true,     
    convert: true         
  })

  if (error) {
    const errors = error.details.map(detail => detail.message)
    return res.status(StatusCodes.BAD_REQUEST).json({
      code: 400,
      message: errors[0],
      errors
    })
  }

  if (req.file) {
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
    const maxSize = 5 * 1024 * 1024

    if (!allowedMimeTypes.includes(req.file.mimetype)) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        message: 'File ảnh không hợp lệ. Chỉ chấp nhận: JPG, PNG, GIF, WebP',
        errors: ['File ảnh không hợp lệ']
      })
    }

    if (req.file.size > maxSize) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        code: 400,
        message: 'Kích thước ảnh không được vượt quá 5MB',
        errors: ['Kích thước ảnh quá lớn']
      })
    }
  }

  req.body = value
  next()
}
