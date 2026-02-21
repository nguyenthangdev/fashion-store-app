import ArticleModel from '~/models/article.model'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import { ArticleInterface } from '~/interfaces/admin/article.interface'
import { FindInterface, QueryInterface } from '~/interfaces/admin/general.interface'
import { articleRepositories } from '~/repositories/admin/article.repository'

export const getAllArticles = async (query: QueryInterface) => {
  const find: FindInterface = { deleted: false }

  if (query.status) {
    find.status = query.status.toString()
  }

  const objectSearch = searchHelpers(query)
  if (objectSearch.regex || objectSearch.slug) {
    find.$or = [
      { title: objectSearch.regex },
      { slug: objectSearch.slug }
    ]
  }

  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
    sort[key] = dir
  }
  if (!sort.createdAt) {
    sort.createdAt = -1
  }

  const countArticles = await ArticleModel.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 5,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countArticles
  )

  const { articles, allArticles } = await articleRepositories.getAllArticles(find, sort, objectPagination)

  return {
    articles,
    objectSearch,
    objectPagination,
    allArticles
  }
}

export const createArticle = async (data: ArticleInterface, account_id: string) => {
  const dataTemp = {
    title: data.title,
    article_category_id: data.article_category_id,
    featured: data.featured,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }
  const article = new ArticleModel(dataTemp)
  await article.save()
  const articleToObject = article.toObject()
  return articleToObject
}

export const articleDetail = async (article_id: string) => {
  const article = await articleRepositories.findArticleById(article_id)
    
  return article
}

export const editArticle = async (data: ArticleInterface, article_id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    article_category_id: data.article_category_id,
    featured: data.featured,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail,
  }
  await articleRepositories.editArticle(article_id, dataTemp, updatedBy)
}

export const changeArticleStatus = async (status: string, article_id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  const updater = await articleRepositories.changeArticleStatus(status, article_id, updatedBy)

  return updater
}

export const deleteArticle = async (article_id: string, account_id: string) => {
  await articleRepositories.deleteArticle(article_id, account_id)
}

export const articleServices = {
  getAllArticles,
  createArticle,
  articleDetail,
  editArticle,
  changeArticleStatus,
  deleteArticle
}
