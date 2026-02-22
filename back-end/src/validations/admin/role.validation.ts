import Joi from 'joi'
import { Request, Response, NextFunction } from 'express'
import { StatusCodes } from 'http-status-codes'

export const createRole = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
   const schema =  Joi.object({
    title: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(100)
      .messages({
        'any.required': 'Tiêu đề là bắt buộc!',
        'string.empty': 'Tiêu đề không được để trống!',
        'string.min': 'Tiêu đề phải có ít nhất 3 kí tự!',
        'string.max': 'Tiêu đề không được vượt quá 100 kí tự!',
      }),

    titleId: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(50)
      .messages({
        'any.required': 'Mã định danh là bắt buộc!',
        'string.empty': 'Mã định danh không được để trống!',
        'string.min': 'Mã định danh phải có ít nhất 3 kí tự!',
        'string.max': 'Mã định danh không được vượt quá 50 ký tự!'
      }),

    description: Joi.string().allow('').optional()
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

  req.body = value
  next()
}

export const editRole = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const schema = Joi.object({
    title: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(100)
      .messages({
        'any.required': 'Tiêu đề là bắt buộc!',
        'string.empty': 'Tiêu đề không được để trống!',
        'string.min': 'Tiêu đề phải có ít nhất 3 kí tự!',
        'string.max': 'Tiêu đề không được quá 100 kí tự!',
      }),

    titleId: Joi.string()
      .trim()
      .required()
      .min(3)
      .max(50)
      .messages({
        'any.required': 'Mã định danh là bắt buộc!',
        'string.empty': 'Mã định danh không được để trống!',
        'string.min': 'Mã định danh phải có ít nhất 3 kí tự!',
        'string.max': 'Mã định danh không được vượt quá 50 ký tự!'
      }),

    description: Joi.string().allow('').optional()
  })

  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
    convert: true
  })

  if (error) {
    const errors = error.details.map(detail => detail.message)
    res.json({
      code: 400,
      message: errors[0],
      errors
    })
    return
  }
  
  req.body = value
  next()
}