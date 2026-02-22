import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { roleServices } from '~/services/admin/role.service'

// [GET] /admin/roles
export const getRoles = async (req: Request, res: Response) => {
  try {
    const { roles, accounts } = await roleServices.getRoles()

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      roles: roles,
      accounts: accounts
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/roles/create
export const createRole = async (req: Request, res: Response) => {
  try {
    const roleToObject = await roleServices.createRole(req.body)

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Tạo thành công nhóm quyền!',
      data: roleToObject
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/roles/edit/:id
export const editRole = async (req: Request, res: Response) => {
  try {
    await roleServices.editRole(req['accountAdmin']._id, req.params.id, req.body)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công nhóm quyền!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/roles/delete/:id
export const deleteRole = async (req: Request, res: Response) => {
  try {
    await roleServices.deleteRole(req.params.id, req['accountAdmin']._id)

    res.json({
      code: 204,
      message: 'Xóa thành công nhóm quyền!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/roles/detail/:id
export const detailRole = async (req: Request, res: Response) => {
  try {
    const role = await roleServices.detailRole(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      role: role
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
  try {
    await roleServices.permissionsPatch(req.body.permissions)
    
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật phân quyền thành công!',
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
