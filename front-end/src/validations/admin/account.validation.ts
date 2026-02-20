import { z } from 'zod'

export const createAccountSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Vui lòng nhập họ và tên!')
    .min(3, 'Họ và tên phải có ít nhất 3 kí tự!')
    .max(50, 'Họ và tên không được vượt quá 50 kí tự!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  email: z.string()
    .trim()
    .lowercase()
    .min(1, 'Vui lòng nhập email!')
    .pipe(z.email('Email không hợp lệ!')),

  password: z.string()
    .trim()
    .min(1, 'Vui lòng nhập mật khẩu!')
    .min(8, 'Mật khẩu phải có ít nhất 8 kí tự!')
    .regex(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa!')
    .regex(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường!')
    .regex(/[0-9]/, 'Mật khẩu phải có ít nhất 1 số!')
    .regex(/[@$!%*?&]/, 'Mật khẩu phải có ít nhất 1 kí tự đặc biệt!'),

  phone: z.string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại!')
    .refine(
      val => /^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val),
      { message: 'Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!' }
    ),

  role_id: z.string().min(1, 'Vui lòng chọn phân quyền!'),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  avatar: z.instanceof(File)
    .optional()
    .nullable()
})

export type CreateAccountFormData = z.infer<typeof createAccountSchema>

export const editAccountSchema = z.object({
  fullName: z.string()
    .trim()
    .min(1, 'Họ và tên là bắt buộc!')
    .min(3, 'Họ và tên phải có ít nhất 3 kí tự!')
    .max(50, 'Họ và tên không được vượt quá 50 kí tự!')
    .transform((val) => val.replace(/\s+/g, ' ')),

  email: z.string()
    .trim()
    .min(1, 'Email là bắt buộc!')
    .pipe(z.email('Email không hợp lệ!')),

  phone: z.string()
    .trim()
    .min(1, 'Số điện thoại là bắt buộc!')
    .refine(
      val => /^(0[35789]\d{8}|\+84[35789]\d{8})$/.test(val),
      { message: 'Số điện thoại phải có 10 số và bắt đầu bằng 03/05/07/08/09 hoặc +84!' }
    ),

  password: z.string()
    .trim()
    .optional()
    .superRefine((val, ctx) => {
      if (!val || val === '') return

      if (val.length < 8) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 8 kí tự!'
        })
      }
      if (!/[A-Z]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 chữ hoa!'
        })
      }
      if (!/[a-z]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 chữ thường!'
        })
      }
      if (!/[0-9]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 số!'
        })
      }

      if (!/[@$!%*?&]/.test(val)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt!'
        })
      }
    }),

  role_id: z.string().min(1, 'Vui lòng chọn phân quyền!'),

  status: z.enum(['ACTIVE', 'INACTIVE'], {
    message: 'Trạng thái không hợp lệ!'
  }),

  avatar: z
    .union([
      z.instanceof(File),
      z.string(),
      z.null()
    ])
    .optional()
})

export type EditAccountFormData = z.infer<typeof editAccountSchema>