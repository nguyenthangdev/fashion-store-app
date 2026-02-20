import { Request, Response } from 'express'
import ArticleCategoryModel from '~/models/articleCategory.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import { deleteManyStatusFast, updateManyStatusFast } from '~/helpers/updateStatusItem'
import { articleCategoryServices }  from '~/services/admin/articleCategory.service'
import { StatusCodes } from 'http-status-codes'

// [GET] /admin/articles-category
export const getArticleCategories = async (req: Request, res: Response) => {
  try {
    const { 
      articleCategories,
      allArticleCategories,
      accounts,
      objectSearch,
      objectPagination 
    } = await articleCategoryServices.getArticleCategories(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      articleCategories,
      allArticleCategories,
      accounts,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

export const changeStatusWithChildren = async (req: Request, res: Response) => {
   try {
    await articleCategoryServices.changeStatusWithChildren(
      req.params.status.toUpperCase(), 
      req.params.id, 
      req['accountAdmin']._id
    )

    return res.status(StatusCodes.OK).json({ 
      code: 200, 
      message: "Cập nhật thành công trạng thái danh mục bài viết!" 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles-category/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  try {
    const body = req.body as { type: string; ids: string[] }
    const type = body.type
    const ids = body.ids
    const updatedBy = {
      account_id: req['accountAdmin']._id,
      updatedAt: new Date()
    }
    enum Key {
      ACTIVE = 'ACTIVE',
      INACTIVE = 'INACTIVE',
      DELETEALL = 'DELETEALL',
    }
    switch (type) {
      case Key.ACTIVE:
        await updateManyStatusFast(ArticleCategoryModel, Key.ACTIVE, ids, updatedBy)
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục bài viết!`
        })
        break
      case Key.INACTIVE:
        await updateManyStatusFast(ArticleCategoryModel, Key.INACTIVE, ids, updatedBy)
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} danh mục bài viết!`
        })
        break
      case Key.DELETEALL:
        await deleteManyStatusFast(ArticleCategoryModel, ids)
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} danh mục bài viết!`
        })
        break
      default:
        res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'Không tồn tại danh mục bài viết!'
        })
        break
    }
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [DELETE] /admin/articles-category/delete/:id
export const deleteArticleCategory = async (req: Request, res: Response) => {
  try {
    await articleCategoryServices.deleteArticleCategory(req.params.id, req['accountAdmin']._id)

    res.json({
      code: 204,
      message: 'Xóa thành công danh mục bài viết!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/articles-category/create
export const createArticleCategory = async (req: Request, res: Response) => {
  try {
    const articleCategoryToObject = await articleCategoryServices.createArticleCategory(req.body, req['accountAdmin']._id)

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Thêm thành công danh mục bài viết!',
      createdArticleCategory: articleCategoryToObject
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles-category/edit/:id
export const editArticleCategory = async (req: Request, res: Response) => {
  try {
    await articleCategoryServices.editArticleCategory(req.body, req.params.id, req['accountAdmin']._id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật thành công danh mục bài viết!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/articles-category/detail/:id
export const detailArticleCategory = async (req: Request, res: Response) => {
  try {
    const articleCategory = await articleCategoryServices.detailArticleCategory(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy Thành công chi tiết danh mục bài viết!',
      articleCategory
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
