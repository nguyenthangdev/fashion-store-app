import { Request, Response } from 'express'
import * as myAccountService from '~/services/admin/myAccount.service'

// [GET] /admin/my-account
export const index = async (req: Request, res: Response) => {
  try {
    const { myAccount, role } = await myAccountService.getMyAccount(req['accountAdmin']._id)

    res.json({
      code: 200,
      message: 'Thành công!',
      myAccount: myAccount,
      role: role
    })

  } catch (error) {
    res.json({
      code: 400,
      message: 'Lỗi!',
      error: error
    })
  }
}

// [PATCH] /admin/my-account/edit
export const editMyAccount = async (req: Request, res: Response) => {
  try {
    await myAccountService.editMyAccount( req.body, req['accountAdmin'].id)

    res.json({
      code: 200,
      message: 'Cập nhật thành công tài khoản!'
    })
    
  } catch (error) {
    res.json({
      code: error.statusCode || 400,
      message: error.message || 'Lỗi',
      error: error
    })
  }
}
