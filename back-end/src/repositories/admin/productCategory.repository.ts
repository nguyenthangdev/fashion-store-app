import ProductCategoryModel from '~/models/productCategory.model'
import AccountModel from '~/models/account.model'
import { PaginationInterface } from '~/interfaces/admin/general.interface'
import { updateStatusRecursiveForOneItem } from '~/helpers/updateStatusItem'

const getProductCategories = async (parentFind: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  //  Query song song bằng Promise.all (giảm round-trip)
  const [parentCategories, accounts, allCategories] = await Promise.all([
    ProductCategoryModel
      .find(parentFind)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip) // chỉ parent
      .lean(),
    AccountModel
      .find({ deleted: false }) // account info
      .lean(),
    ProductCategoryModel
      .find({ deleted: false })
      .sort(sort) 
      .lean()
  ])

  return { parentCategories, accounts, allCategories }
}

const changeStatusWithChildren = async (status: string, productCategory_id: string, updatedBy: any) => {
  await updateStatusRecursiveForOneItem(ProductCategoryModel, status, productCategory_id, updatedBy)
}

const deleteProductCategory = async (productCategory_id: string, account_id: string) => {
  await ProductCategoryModel.updateOne(
    { _id: productCategory_id },
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

const editProductCategory = async (productCategory_id: string, dataTemp: any, updatedBy: any) => {
  await ProductCategoryModel.updateOne(
    { _id: productCategory_id },
    {
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

const findProductCategoryById = async (productCategory_id: string) => {
  const productCategory = await ProductCategoryModel
    .findOne({ 
      _id: productCategory_id, 
      deleted: false 
    })
    .lean()

  return productCategory
}

const findDeletedProductCategoryById = async (productCategory_id: string) => {
  const productCategory = await ProductCategoryModel
    .findOne({ 
      _id: productCategory_id, 
      deleted: true 
    })
    .lean()

  return productCategory
}

const productCategoryTrash = async (find: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const [parentCategories, accounts] = await Promise.all([
    ProductCategoryModel
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip) // chỉ parent
      .lean(),
    AccountModel
      .find({ deleted: false }) // account info
      .lean()
  ])

  return { parentCategories, accounts }
}

const findAllProductCategories = async () => {
  const allCategories = await ProductCategoryModel.find({}).lean()

  return allCategories
}
const permanentlyDeleteProductCategory = async () => {

}

const deleteProductCategoriesByIds = async (allIdsToDelete: string[]) => {
  await ProductCategoryModel.deleteMany({
    _id: { $in: allIdsToDelete }
  })
}

const recoverProductCategory = async (productCategory_id: string) => {
  await ProductCategoryModel.updateOne(
    { _id: productCategory_id },
    { $set: { deleted: false, recoveredAt: new Date() }}
  )
}

export const productCategoryRepositories = {
  getProductCategories,
  changeStatusWithChildren,
  deleteProductCategory,
  editProductCategory,
  findProductCategoryById,
  productCategoryTrash,
  permanentlyDeleteProductCategory,
  findAllProductCategories,
  deleteProductCategoriesByIds,
  recoverProductCategory,
  findDeletedProductCategoryById
}