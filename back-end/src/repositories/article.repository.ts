import { FindInterface, PaginationInterface } from "~/interfaces/admin/general.interface"
import ArticleModel from "~/models/article.model"

const getAllArticles = async (find: FindInterface, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const [articles, allArticles] = await Promise.all([
    ArticleModel
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .populate('createdBy.account_id', 'fullName email')
      .populate('updatedBy.account_id', 'fullName email')
      .lean(),
    ArticleModel
      .find({ deleted: false })
      .lean()
  ])
  
  return { articles, allArticles } 
}

const findArticleById = async (article_id: string) => {
  const article = await ArticleModel
    .findOne({ _id: article_id, deleted: false })
    .lean()
    
  return article
}

const editArticle = async (article_id: string, dataTemp: any, updatedBy: any) => {
  await ArticleModel.updateOne(
    { _id: article_id },
    { 
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

const changeArticleStatus = async (status: string, article_id: string, updatedBy: any) => {
  const updater = await ArticleModel
    .findByIdAndUpdate(
      { _id: article_id },
      {
        $set: { status },
        $push: { updatedBy }
      },
      { new: true } // Trả về document sau update
    )
    .populate('createdBy.account_id', 'fullName email')
    .populate('updatedBy.account_id', 'fullName email')
    .lean() 

  return updater
}

const deleteArticle = async (article_id: string, account_id: string) => {
  await ArticleModel.updateOne(
    { _id: article_id },
    {
      $set: {
        deleted: true,
        deletedBy: {
          account_id,
          deletedAt: new Date()
        }
      }
    }
  )
}

export const articleRepositories = {
  getAllArticles,
  findArticleById,
  editArticle,
  changeArticleStatus,
  deleteArticle
}