import { Request, Response, NextFunction } from 'express'
import ProductCategoryModel from '~/models/productCategory.model'
import ArticleCategoryModel from '~/models/articleCategory.model'
import { buildTreeForItems } from '~/helpers/createChildForAllParents'
import { TreeInterface } from '~/interfaces/admin/general.interface'

export const categoryProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const productsCategory = await ProductCategoryModel.find({
    deleted: false,
    status: 'ACTIVE'
  }).lean()

  const newProductsCategory = buildTreeForItems(productsCategory as unknown as TreeInterface[])
  req['layoutProductsCategory'] = newProductsCategory 
  next()
}

export const categoryArticle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const articlesCategory = await ArticleCategoryModel.find({
    deleted: false,
    status: 'ACTIVE'
  }).lean()

  const newArticlesCategory = buildTreeForItems(articlesCategory as unknown as TreeInterface[])
  req['layoutArticlesCategory'] = newArticlesCategory
  next()
}
