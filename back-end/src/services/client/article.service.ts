import ArticleModel from '~/models/article.model'
import ArticleCategoryModel from '~/models/articleCategory.model'
import paginationHelpers from '~/helpers/pagination'
import { Find } from '~/repositories/client/article.repository'
import { articleRepositories } from '~/repositories/client/article.repository'

const getArticles = async (query: any) => {
  
  const find: Find = { deleted: false }

  // Pagination
  const countProducts = await articleRepositories.countProduct(find)

  const objectPagination = paginationHelpers(
  {
    currentPage: 1, limitItems: 4,
    skip: 0,
    totalPage: 0,
    totalItems: 0
  },
  query,
  countProducts
  )
  // End Pagination

  const { articles, allArticles } = await articleRepositories.getArticles(find, objectPagination)

  return {
    articles,
    objectPagination,
    allArticles
  }
}

const category = async (slugCategory: string) => {
  const category = await articleRepositories.findCategoryBySlug(slugCategory)

  const getSubArticle = async (parentId: string) => {
    const subs = await articleRepositories.findArticleByParentId(parentId)

    let allSub = [...subs] // Cú pháp trải ra (spread syntax)

    for (const sub of subs) {
      const childs = await getSubArticle(sub.id) // Gọi đệ quy để lấy tất cả các danh mục con của con

      allSub = allSub.concat(childs) // Nối mảng con vào mảng cha
    }
    return allSub
  }

  const listSubCategory = await getSubArticle(category.id)

  const listSubCategoryId = listSubCategory.map(item => item.id)

  const articles = await ArticleModel
    .find({
      deleted: false,
      article_category_id: { $in: [category.id, ...listSubCategoryId] }
    })
    .sort({ createdAt: -1 })
    .lean()

  return { articles, category }
}

const detailArticle = async (slugArticle: string) => {
  const find = {
    deleted: false,
    slug: slugArticle,
    status: 'ACTIVE'
  }

  const article = await ArticleModel.findOne(find).lean()
  if (article.article_category_id) {
    const category = await ArticleCategoryModel.findOne({
      _id: article.article_category_id,
      deleted: false,
      status: 'ACTIVE'
    }).lean()
    article['category'] = category
  }
  return article
}

export const articleServices = {
  getArticles,
  category,
  detailArticle
}