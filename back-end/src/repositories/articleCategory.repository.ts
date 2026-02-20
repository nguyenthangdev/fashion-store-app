import { PaginationInterface } from "~/interfaces/admin/general.interface"
import AccountModel from "~/models/account.model"
import ArticleCategoryModel from "~/models/articleCategory.model"

const getArticleCategories = async (parentFind: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const [parentCategories, accounts, allCategories] = await Promise.all([
    ArticleCategoryModel.find(parentFind)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .lean(),
    AccountModel
      .find({ deleted: false })
      .lean(),
    ArticleCategoryModel
      .find({ deleted: false })
      .sort(sort)
      .lean()
  ])

  return { parentCategories, accounts, allCategories }
}

const deleteArticleCategory = async (id: string, account_id: string) => {
  await ArticleCategoryModel.updateOne(
    { _id: id },
    {
      $set: {
        deleted: true,
        deletedBy: {
          account_id: account_id,
          deletedAt: new Date()
        }
      }
    }
  )
}

const editArticleCategory = async (id: string, dataTemp: any, updatedBy: any) => {
  await ArticleCategoryModel.updateOne(
    { _id: id },
    {
      $set: dataTemp,
      $push: {
        updatedBy
      }
    }
  )
}

const detailArticleCategory = async (id: string) => {
  const articleCategory = await ArticleCategoryModel
    .findOne({ _id: id, deleted: false })
    .lean()
    
  return articleCategory
}

export const articleCategoryRepositories = {
  getArticleCategories,
  deleteArticleCategory,
  editArticleCategory,
  detailArticleCategory
}