import { PaginationInterface } from '~/interfaces/admin/general.interface'
import ArticleModel from '~/models/article.model'
import ArticleCategoryModel from '~/models/articleCategory.model'

export interface Find {
  deleted: boolean
  status?: string
  title?: RegExp
}

const countProduct = async (find: Find) => {
  const countProducts = await ArticleModel.countDocuments(find)

  return countProducts
}

const getArticles = async (find: Find, objectPagination: PaginationInterface) => {
  const [articles, allArticles] = await Promise.all([
    ArticleModel
      .find(find)
      .sort({ createdAt: -1 })
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .lean(),
    ArticleModel
      .find(find)
      .sort({ createdAt: -1 })
      .lean()
  ])

  return { articles, allArticles }
}

const findCategoryBySlug = async (slugCategory: string) => {
  const category = await ArticleCategoryModel.findOne({
    slug: slugCategory,
    status: 'ACTIVE',
    deleted: false
  })

  return category
}

const findArticleByParentId = async (parentId: string) => {
  const subs = await ArticleCategoryModel.find({
    parent_id: parentId,
    deleted: false,
    status: 'ACTIVE'
  })

  return subs
}


export const articleRepositories = {
  countProduct,
  getArticles,
  findCategoryBySlug,
  findArticleByParentId
}