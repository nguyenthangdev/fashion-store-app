import ProductCategoryModel from '~/models/productCategory.model'
import searchHelpers from '~/helpers/search'
import { buildTreeForPagedItems } from '~/helpers/createChildForPagedParents'
import { addLogInfoToTree } from '~/helpers/addLogInfoToChildren'
import AccountModel from '~/models/account.model'
import paginationHelpers from '~/helpers/pagination'
import { updateStatusRecursiveForOneItem } from '~/helpers/updateStatusItem'
import { buildTreeForItems } from '~/helpers/createChildForAllParents'
import { LogNodeInterface, TreeInterface, UpdatedByInterface } from '~/interfaces/admin/general.interface'
import { ProductCategoryInterface } from '~/interfaces/admin/productCategory.interface'
import { productCategoryRepositories } from '~/repositories/admin/productCategory.repository'

const getProductCategories = async (query: any) => {
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
  const countParents = await ProductCategoryModel.countDocuments(parentFind)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 2,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countParents
  )
  // End Pagination

  const { 
    parentCategories, 
    accounts, 
    allCategories 
  } = await productCategoryRepositories.getProductCategories(parentFind, sort, objectPagination)
  
  // Add children vào cha (Đã phân trang giới hạn 2 item)
  const newProductCategories = buildTreeForPagedItems(parentCategories as unknown as TreeInterface[], allCategories as unknown as TreeInterface[])

  // Add children vào cha (Không có phân trang, lấy tất cả item)
  const newAllProductCategories = buildTreeForItems(allCategories as unknown as TreeInterface[])

  // Gắn account info cho tree
  const accountMap = new Map(accounts.map(acc => [acc._id.toString(), acc.fullName]))
  addLogInfoToTree(newProductCategories as LogNodeInterface[], accountMap)
  addLogInfoToTree(newAllProductCategories as LogNodeInterface[], accountMap)
  
  return {
    newProductCategories,
    newAllProductCategories,
    accounts,
    objectSearch,
    objectPagination
  }
}

const changeStatusWithChildren = async (accoutn_id: string, status: string, productCategory_id: string) => {
  const updatedBy: UpdatedByInterface = {
    account_id: accoutn_id,
    updatedAt: new Date()
  }
  await productCategoryRepositories.changeStatusWithChildren(status, productCategory_id, updatedBy)
}

const deleteProductCategory = async (productCategory_id: string, account_id: string) => {
  await productCategoryRepositories.deleteProductCategory(productCategory_id, account_id)
}

const createProductCategory = async (data: ProductCategoryInterface, account_id: string) => {
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    description: data.description,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }
  const productCategory = new ProductCategoryModel(dataTemp)
  await productCategory.save()
  const productCategoryToObject = productCategory.toObject()

  return productCategoryToObject
}

const editProductCategory = async (data: ProductCategoryInterface, productCategory_id: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    parent_id: data.parent_id,
    description: data.description,
    status: data.status,
    thumbnail: data.thumbnail
  }
  await productCategoryRepositories.editProductCategory(productCategory_id, dataTemp, updatedBy)
}

const detailProductCategory = async (productCategory_id: string) => {
  const productCategory = await productCategoryRepositories.findProductCategoryById(productCategory_id)

  return productCategory
}

const productCategoryTrash = async (query: any) => {
  const find: any = { deleted: true }

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
  // const parentFind = { ...find, parent_id: '' }

  const countParents = await ProductCategoryModel.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 2,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countParents
  )
  // End Pagination

  //  Query song song bằng Promise.all (giảm round-trip)
  const { parentCategories, accounts } = await productCategoryRepositories.productCategoryTrash(find, sort, objectPagination)

  return {
    parentCategories,
    accounts,
    objectSearch,
    objectPagination
  }
}

const permanentlyDeleteProductCategory = async (productCategory_id: string) => {
  // Lấy danh mục gốc cần xóa
  const rootCategory = await productCategoryRepositories.findDeletedProductCategoryById(productCategory_id)
  
  if (!rootCategory) {
    return { 
      success: false, 
      code: 404, 
      message: 'Không tìm thấy danh mục!' 
    }
  }
  
  // Lấy tất cả danh mục để tìm con
  const allCategories = await productCategoryRepositories.findAllProductCategories()
  
  // Tạo cây từ danh mục gốc
  const tree = buildTreeForPagedItems(
    [rootCategory as any as TreeInterface], allCategories as any as TreeInterface[]
  )
  
  // Hàm đệ quy lấy tất cả ID từ cây
  const getAllIdsFromTree = (items: TreeInterface[]): string[] => {
    let ids: string[] = []
    
    items.forEach(item => {
      const itemId = item._id?.toString() || item.id?.toString()
      if (itemId) {
        ids.push(itemId)
      }
      
      if (item.children && item.children.length > 0) {
        ids = ids.concat(getAllIdsFromTree(item.children))
      }
    })
    
    return ids
  }
  
  // Lấy tất cả ID cần xóa
  const allIdsToDelete = getAllIdsFromTree(tree)
  
  // Xóa tất cả danh mục
  await productCategoryRepositories.deleteProductCategoriesByIds(allIdsToDelete)

  return { success: true, allIdsToDelete }
}

const recoverProductCategory = async (productCategory_id: string) => {
  await productCategoryRepositories.recoverProductCategory(productCategory_id)
}

export const productCategoryServices = {
  getProductCategories,
  changeStatusWithChildren,
  deleteProductCategory,
  createProductCategory,
  editProductCategory,
  detailProductCategory,
  productCategoryTrash,
  permanentlyDeleteProductCategory,
  recoverProductCategory
}