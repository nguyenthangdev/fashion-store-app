import searchHelpers from '~/helpers/search'
import { buildTreeForItems } from '~/helpers/createChildForAllParents'
import { addLogInfoToTree } from '~/helpers/addLogInfoToChildren'
import paginationHelpers from '~/helpers/pagination'
import { buildTreeForPagedItems } from '~/helpers/createChildForPagedParents'
import ArticleCategoryModel from '~/models/articleCategory.model'
import { updateStatusRecursiveForOneItem } from '~/helpers/updateStatusItem'
import { LogNodeInterface, TreeInterface } from '~/interfaces/admin/general.interface'
import { ArticleCategoryInterface } from '~/interfaces/admin/articleCategory.interface'
import { articleCategoryRepositories } from '~/repositories/articleCategory.repository'

const getArticleCategories = async (query: any) => {
  const find: any = { deleted: false }
  if (query.status) {
    find.status = query.status.toString()
  }

  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex || objectSearch.slug) {
    find.$or = [
      { title: objectSearch.regex },
      { slug: objectSearch.slug }
    ]
  }
  // End search

  // Sort
  let sort: Record<string, 1 | -1> = { }
  if (query.sortKey) {
    const key = query.sortKey.toString()
    const dir = query.sortValue === 'asc' ? 1 : -1
    sort[key] = dir
  }
  // luôn sort phụ theo createdAt
  if (!sort.createdAt) {
    sort.createdAt = -1
  }
  // End Sort

  // Pagination
  const parentFind = { ...find, parent_id: '' }
  const countParents = await ArticleCategoryModel.countDocuments(parentFind)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 3,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countParents
  )
  // End Pagination
  
  //  Query song song bằng Promise.all (giảm round-trip)
  // parentCategories: Các danh mục bài viết cấp cao nhất (Cấp 1) (đã được phân trang)
  // allCategories: Tất cả các danh mục bài viết cấp cao nhất (Cấp 1)
  const { parentCategories, accounts, allCategories } = await articleCategoryRepositories.getArticleCategories(
    parentFind, sort, objectPagination
  )

  // Tạo cây phân cấp (Mỗi cha sẽ được gán thêm trường children)
  const articleCategories = buildTreeForPagedItems(
    parentCategories as unknown as TreeInterface[], 
    allCategories as unknown as TreeInterface[]
  )

  // Tạo cây phân cấp (Mỗi cha sẽ được gán thêm trường children)
  const allArticleCategories = buildTreeForItems(allCategories as unknown as TreeInterface[])

  // Gán account info cho tree
  const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
  addLogInfoToTree(articleCategories as LogNodeInterface[], accountMap)
  addLogInfoToTree(allArticleCategories as LogNodeInterface[], accountMap)

  return {
    articleCategories,
    allArticleCategories,
    accounts,
    objectSearch,
    objectPagination
  }
}

const changeStatusWithChildren = async (status: string, category_id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  
  await updateStatusRecursiveForOneItem(ArticleCategoryModel, status, category_id, updatedBy)
}

const deleteArticleCategory = async (id: string, account_id: string) => {
  await articleCategoryRepositories.deleteArticleCategory(id, account_id)
}

const createArticleCategory = async (data: ArticleCategoryInterface, account_id: string) => {
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }
  const articleCategory = new ArticleCategoryModel(dataTemp)
  await articleCategory.save()
  const articleCategoryToObject = articleCategory.toObject()

  return articleCategoryToObject
}

const editArticleCategory = async (data: any, id: string, account_id: string) => {
  const updatedBy = {
    account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    descriptionShort: data.descriptionShort,
    descriptionDetail: data.descriptionDetail,
    status: data.status,
    thumbnail: data.thumbnail
  }
  await articleCategoryRepositories.editArticleCategory(id, dataTemp, updatedBy)
}

const detailArticleCategory = async (id: string) => {
  const articleCategory = await articleCategoryRepositories.detailArticleCategory(id)

  return articleCategory
}

export const articleCategoryServices = {
  getArticleCategories,
  changeStatusWithChildren,
  deleteArticleCategory,
  createArticleCategory,
  editArticleCategory,
  detailArticleCategory
}