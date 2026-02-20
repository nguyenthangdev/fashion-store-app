import { Request, Response } from 'express'
import ArticleModel from '~/models/article.model'
import filterStatusHelpers from '~/helpers/filterStatus'
import { StatusCodes } from 'http-status-codes'
import { articleServices } from '~/services/admin/article.service'

// [GET] /admin/articles
export const getAllArticles = async (req: Request, res: Response) => {
  try {
    const {
      articles,
      objectSearch,
      objectPagination,
      allArticles
    } = await articleServices.getAllArticles(req.query)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy trang danh sách bài viết thành công!',
      articles,
      filterStatus: filterStatusHelpers(req.query),
      keyword: objectSearch.keyword,
      pagination: objectPagination,
      allArticles
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /admin/articles/create
export const createArticle = async (req: Request, res: Response) => {
  try {
    const articleToObject = await articleServices.createArticle(req.body, req['accountAdmin']._id)

    res.status(StatusCodes.CREATED).json({
      code: 201,
      message: 'Thêm bài viết thành công!',
      createdArticle: articleToObject,
    })
  } catch (error) {
   res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/articles/detail/:id
export const articleDetail = async (req: Request, res: Response) => {
  try {
    const article = await articleServices.articleDetail(req.params.id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy trang chi tiết bài viết thành công!',
      article
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles/edit/:id
export const editArticle = async (req: Request, res: Response) => {
  try {
    await articleServices.editArticle(req.body, req.params.id, req['accountAdmin']._id)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật bài viết thành công!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles/change-status/:status/:id
export const changeArticleStatus = async (req: Request, res: Response) => {
  try {
    const updater = await articleServices.changeArticleStatus(
      req.params.status.toUpperCase(), 
      req.params.id, 
      req['accountAdmin']._id
    )

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Cập nhật trạng thái bài viết thành công!',
      updater
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [PATCH] /admin/articles/change-multi
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
        await ArticleModel.updateMany(
          { _id: { $in: ids } },
          { status: Key.ACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật trạng thái ${ids.length} bài viết thành công!`
        })
        break
      case Key.INACTIVE:
        await ArticleModel.updateMany(
          { _id: { $in: ids } },
          { status: Key.INACTIVE, $push: { updatedBy: updatedBy } }
        )
        res.status(StatusCodes.OK).json({
          code: 200,
          message: `Cập nhật thành công trạng thái ${ids.length} bài viết!`
        })
        break
      case Key.DELETEALL:
        await ArticleModel.updateMany(
          { _id: { $in: ids } },
          { deleted: 'true', deletedAt: new Date() }
        )
        res.json({
          code: 204,
          message: `Xóa thành công ${ids.length} bài viết!`
        })
        break
      default:
        res.status(StatusCodes.NOT_FOUND).json({
          code: 404,
          message: 'Không tồn tại bài viết!'
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

// [DELETE] /admin/articles/delete/:id
export const deleteArticle = async (req: Request, res: Response) => {
  try {
    await articleServices.deleteArticle(req.params.id, req['accountAdmin']._id)
    
    res.json({
      code: 204,
      message: 'Xóa thành công bài viết!'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
