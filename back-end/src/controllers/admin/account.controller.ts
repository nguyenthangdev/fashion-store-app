import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CreateAccountDTO } from '~/dtos/admin/account.dto'
import * as accountService from '~/services/admin/account.service'

// [GET] /admin/accounts
export const index = async (req: Request, res: Response) => {
  try {
    const { accounts, roles } = await accountService.getAccountsWithRoles()
  
    if (!accounts) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        message: 'Không tìm thấy tài khoản!'
      })
    }

    if (!roles) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: 404,
        message: 'Không tìm thấy nhóm quyền!'
      })
    }

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy thành công trang index tài khoản!',
      accounts,
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
    const dto: CreateAccountDTO = {
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      phone: req.body.phone,
      avatar: req.body.avatar,
      role_id: req.body.role_id,
      status: req.body.status
    }
    const result = await accountService.createAccount(dto)

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
      data: accountToObject
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/accounts/change-status/:status/:id
export const changeAccountStatus = async (req: Request, res: Response) => {
  try {
    await accountService.changeAccountStatus(req.params.status, req.params.id)
    
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
export const editAccount = async (req: Request, res: Response) => {
  try {
    const result = await accountService.editAccount(req.body, req.params.id)

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
    const { account, roles } = await accountService.accountDetail(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy trang chi tiết tài khoản thành công!',
      account,
      roles
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/accounts/delete/:id
export const deleteAccount = async (req: Request, res: Response) => {
  try {
    await accountService.deleteAccount(req.params.id)

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
