import { Request, Response, NextFunction } from 'express'

export const requirePermission = (roleName: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const accountRole = req['accountAdmin.roleName']

    if (!accountRole) {
      return res.json({ 
        code: 401, 
        message: "Vui lòng đăng nhập!" 
      })
    }

    if (accountRole === 'Admin') return next()

    if (!roleName.includes(accountRole)) {
      return res.json({ 
        code: 403,
        message: "Bạn không có quyền truy cập vào trang này!" 
      })
    }

    next()  
  }
}
