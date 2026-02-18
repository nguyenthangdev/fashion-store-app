import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CreateAccountDTO } from '~/dtos/admin/account.dto'
import { accountServices } from '~/services/admin/account.service'

// [GET] /admin/accounts
export const getAllAccounts = async (req: Request, res: Response) => {
  try {
    const accounts = await accountServices.getAllAccounts()
  
    if (!accounts) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        message: 'Không tìm thấy tài khoản!'
      })
    }

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy thành công trang danh sách tài khoản!',
      accounts
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/accounts/get-roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await accountServices.getAllRoles()
  
    if (!roles) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        message: 'Không tìm thấy nhóm quyền!'
      })
    }

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy thành công nhóm quyền!',
      roles
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/accounts/create
export const createAccount = async (req: Request, res: Response) => {
  try {
    const result = await accountServices.createAccount(req.body)

    if (!result.success) {
      return res.status(StatusCodes.CONFLICT).json({
        code: result.code,
        message: result.message
      })
    }
    const { accountToObject } = result
    
    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Tạo tài khoản thành công!',
      createdAccount: accountToObject
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeAccountStatusById = async (req: Request, res: Response) => {
  try {
    await accountServices.changeAccountStatusById(req.params.id, req.params.status.toUpperCase())
    
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật trạng thái tài khoản thành công!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/accounts/edit/:id
export const editAccountById = async (req: Request, res: Response) => {
  try {
    const result = await accountServices.editAccountById(req.body, req.params.id)

    if (!result.success) {
      return res.status(StatusCodes.CONFLICT).json({
        code: result.code,
        message: result.message
      })
    }

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật tài khoản thành công!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/accounts/detail/:id
export const accountDetail = async (req: Request, res: Response) => {
  try {
    const account = await accountServices.accountDetail(req.params.id)

    if (!account) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        message: 'Không tìm thấy tài khoản!'
      })
    }

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy trang chi tiết tài khoản thành công!',
      account
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/accounts/delete/:id
export const deleteAccountById = async (req: Request, res: Response) => {
  try {
    await accountServices.deleteAccountById(req.params.id)

    res.json({
      code: 204,
      message: 'Xóa tài khoản thành công!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
