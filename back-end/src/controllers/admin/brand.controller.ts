import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { brandServices } from '~/services/admin/brand.service'

// [GET] /admin/brands
export const getBrands = async (req: Request, res: Response) => {
  try {
    const { brands, objectPagination } = await brandServices.getBrands(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy thành công danh sách thương hiệu!',
      brands,
      pagination: objectPagination
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/brands/create
export const createBrand = async (req: Request, res: Response) => {
  try {
    const brandToObject = await brandServices.createBrand(
        req.body, 
        req['accountAdmin']._id
    )

    res.status(StatusCodes.CREATED).json({ 
        code: 201, 
        message: 'Tạo mới thành công thương hiệu !', 
        data: brandToObject 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/brands/detail/:id
export const detailBrand = async (req: Request, res: Response) => {
  try {
    const brand = await brandServices.detailBrand(req.params.id)

    res.status(StatusCodes.OK).json({ 
        code: 200, 
        message: 'Lấy thành công thông tin thương hiệu!', 
        brand 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/brands/edit/:id
export const editBrand = async (req: Request, res: Response) => {
  try {
    await brandServices.editBrand(req.body, req.params.id, req['accountAdmin']._id)

    res.status(StatusCodes.OK).json({ 
        code: 200, 
        message: 'Cập nhật thành công thương hiệu!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/brands/delete/:id
export const deleteBrand = async (req: Request, res: Response) => {
  try {
    await brandServices.deleteBrand(req.params.id, req['accountAdmin']._id)

    res.json({ 
        code: 204, 
        message: 'Xóa thành công thương hiệu!' 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
