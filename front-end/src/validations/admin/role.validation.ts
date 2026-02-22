import { z } from 'zod'

export const createRoleSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .min(3, 'Tiêu đề phải có ít nhất 3 kí tự!')
    .max(100, 'Tiêu đề không được quá 100 kí tự!'),

  titleId: z.string()
    .trim()
    .min(1, 'Mã định danh không được để trống!')
    .min(3, 'Mã định danh phải có ít nhất 3 kí tự!')
    .max(50, 'Mã định danh không được quá 50 kí tự'),

  description: z.string().optional()
})

export type CreateRoleFormData = z.infer<typeof createRoleSchema>

export const editRoleSchema = z.object({
  title: z.string()
    .trim()
    .min(1, 'Tiêu đề không được để trống!')
    .min(3, 'Tiêu đề phải có ít nhất 3 kí tự!')
    .max(100, 'Tiêu đề không được quá 100 kí tự!'),

  titleId: z.string()
    .trim()
    .min(1, 'Mã định danh không được để trống!')
    .min(3, 'Mã định danh phải có ít nhất 3 kí tự!')
    .max(50, 'Mã định danh không được quá 50 kí tự'),

  description: z.string().optional()
})

export type EditRoleFormData = z.infer<typeof editRoleSchema>