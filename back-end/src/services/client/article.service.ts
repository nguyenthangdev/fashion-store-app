import ArticleModel from '~/models/article.model'
import ArticleCategoryModel from '~/models/articleCategory.model'
import paginationHelpers from '~/helpers/pagination'

export const getArticles = async (query: any) => {
  interface Find {
      deleted: boolean
      status?: string
      title?: RegExp
  }
  const find: Find = { deleted: false }

  // Pagination
  const countProducts = await ArticleModel.countDocuments(find)
  const objectPagination = paginationHelpers(
  {
    currentPage: 1, limitItems: 20,
    skip: 0,
    totalPage: 0,
    totalItems: 0
  },
  query,
  countProducts
  )
  // End Pagination

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

  return {
    articles,
    objectPagination,
    allArticles
  }
}

export const category = async (slugCategory: string) => {
  const category = await ArticleCategoryModel.findOne({
    slug: slugCategory,
    status: 'ACTIVE',
    deleted: false
  })
  const getSubArticle = async (parentId) => {
    const subs = await ArticleCategoryModel.find({
      deleted: false,
      status: 'ACTIVE',
      parent_id: parentId
    })
    let allSub = [...subs] // Cú pháp trải ra (spread syntax)

    for (const sub of subs) {
      const childs = await getSubArticle(sub.id) // Gọi đệ quy để lấy tất cả các danh mục con
      allSub = allSub.concat(childs) // Nối mảng con vào mảng cha
    }
    return allSub
  }
  const listSubCategory = await getSubArticle(category.id)
  const listSubCategoryId = listSubCategory.map((item) => item.id)

  const articles = await ArticleModel
    .find({
      deleted: false,
      article_category_id: { $in: [category.id, ...listSubCategoryId] }
    })
    .sort({ createdAt: -1 })
    .lean()

  return { articles, category }
}

export const detailArticle = async (slugArticle: string) => {
  const find = {
    deleted: false,
    slug: slugArticle,
    status: 'ACTIVE'
  }
  const article = await ArticleModel.findOne(find)
  if (article.article_category_id) {
    const category = await ArticleCategoryModel.findOne({
      _id: article.article_category_id,
      deleted: false,
      status: 'ACTIVE'
    })
    article['category'] = category
  }
  return article
}