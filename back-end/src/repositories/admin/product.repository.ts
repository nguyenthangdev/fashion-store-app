import { PaginationInterface } from '~/interfaces/admin/general.interface'
import ProductModel from '~/models/product.model'

const getProducts = async (find: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const [products, allProducts] = await Promise.all([
    ProductModel
      .find(find)
      .sort(sort)
      .limit(objectPagination.limitItems)
      .skip(objectPagination.skip)
      .populate('createdBy.account_id', 'fullName email')
      .populate('updatedBy.account_id', 'fullName email')
      .lean(),
    ProductModel
      .find({ deleted: false })
      .lean()
  ])

  return { products, allProducts }
}

const changeStatusProduct = async (product_id: string, status: string, updatedBy: any) => {
  const updater = await ProductModel
    .findByIdAndUpdate(
      { _id: product_id },
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

const deleteProduct = async (product_id: string, account_id: string) => {
  await ProductModel.updateOne(
    { _id: product_id },
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

const editProduct = async (product_id: string, dataTemp: any, updatedBy: any) => {
  await ProductModel.updateOne(
    { _id: product_id },
    {
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

const findProductById = async (product_id: string) => {
  const product = await ProductModel
    .findOne({ _id: product_id, deleted: false })
    .lean()

  return product
}

const productTrash = async (find: any, sort: Record<string, 1 | -1>, objectPagination: PaginationInterface) => {
  const products = await ProductModel
    .find(find)
    .sort(sort)
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)
    .lean()
    .populate('createdBy.account_id', 'fullName email')
    .populate('deletedBy.account_id', 'fullName email') // Lấy thông tin người tạo
    .lean()
  
  return products
}

const permanentlyDeleteProduct = async (product_id: string) => {
  await ProductModel.deleteOne({ _id: product_id })
}

const recoverProduct = async (product_id: string) => {
  await ProductModel.updateOne(
    { _id: product_id },
    { $set: { deleted: false, recoveredAt: new Date() }}
  )
}

export const productRepositories = {
  getProducts,
  changeStatusProduct,
  deleteProduct,
  editProduct,
  findProductById,
  productTrash,
  permanentlyDeleteProduct,
  recoverProduct
}