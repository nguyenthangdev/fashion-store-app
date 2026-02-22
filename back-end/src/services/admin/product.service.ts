import ProductModel from '~/models/product.model'
import searchHelpers from '~/helpers/search'
import paginationHelpers from '~/helpers/pagination'
import { ProductInterface } from '~/interfaces/admin/product.interface'
import { productRepositories } from '~/repositories/admin/product.repository'

const getProducts = async (query: any) => {
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
  const countProducts = await ProductModel.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 5,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countProducts
  )
  // End Pagination
  
  const { products, allProducts } = await productRepositories.getProducts(find, sort, objectPagination)

  return {
    products,
    allProducts,
    objectSearch,
    objectPagination
  }
}

const changeStatusProduct = async (product_id: string, status: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }

  const updater = await productRepositories.changeStatusProduct(product_id, status, updatedBy)

  return updater
}

const deleteProduct = async (product_id: string, account_id: string) => {
  await productRepositories.deleteProduct(product_id, account_id)
}

const createProduct = async (data: ProductInterface, account_id: string, fileUrls: any) => {
  const dataTemp = {
    title: data.title,
    product_category_id: data.product_category_id,
    featured: data.featured,
    description: data.description,
    price: data.price,
    discountPercentage: data.discountPercentage,
    stock: data.stock,
    colors: data.colors,
    sizes: data.sizes,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }
  // Lấy mảng URL đã được upload từ middleware
  const uploadedUrls = fileUrls || []
  let urlIndex = 0

  // Xử lý ảnh đại diện (thumbnail)
  if (dataTemp.thumbnail === '__THUMBNAIL_PLACEHOLDER__') {
    dataTemp.thumbnail = uploadedUrls[urlIndex]
    urlIndex++
  }
  
  // Lắp ráp URL vào đúng vị trí trong mảng colors
  for (const color of dataTemp.colors) {
    const imageCount = color.images.length // Số lượng ảnh cần cho màu này
    if (imageCount > 0) {
      // Lấy đúng số lượng URL từ mảng đã upload
      const colorImages = uploadedUrls.slice(urlIndex, urlIndex + imageCount)
      color.images = colorImages
      urlIndex += imageCount
    }
  }

  // dataTemp.price = parseInt(dataTemp.price) || 0
  // dataTemp.discountPercentage = parseInt(dataTemp.discountPercentage) || 0
  // dataTemp.stock = parseInt(dataTemp.stock) || 0

  // productData.createdBy = {
  //   account_id: account_id
  // }

  const product = new ProductModel(dataTemp)
  await product.save()
  const productToObject = product.toObject()
  return productToObject
}

const editProduct = async (data: ProductInterface, account_id: string, product_id: string, fileUrls: any) => {
  const dataTemp = {
    title: data.title,
    product_category_id: data.product_category_id,
    featured: data.featured,
    description: data.description,
    price: data.price,
    discountPercentage: data.discountPercentage,
    stock: data.stock,
    colors: data.colors,
    sizes: data.sizes,
    thumbnail: data.thumbnail,
    status: data.status,
  }
  // Lấy mảng URL của các ảnh MỚI đã được upload
  const uploadedUrls = fileUrls || []
  let urlIndex = 0

  // Xử lý ảnh đại diện (thumbnail)
  if (dataTemp.thumbnail === '__THUMBNAIL_PLACEHOLDER__') {
    dataTemp.thumbnail = uploadedUrls[urlIndex]
    urlIndex++
  }

  // Lắp ráp lại mảng ảnh cho từng màu
  for (const color of dataTemp.colors) {
    // Thay thế các placeholder bằng URL mới
    color.images = color.images.map((image: string) => {
      if (image === '__IMAGE_PLACEHOLDER__') {
        const newUrl = uploadedUrls[urlIndex]
        urlIndex++
        return newUrl
      }
      // Giữ nguyên các URL ảnh cũ
      return image
    })
  }

  // Logic parseInt không đổi
  // productData.price = parseInt(productData.price) || 0
  // productData.discountPercentage = parseInt(productData.discountPercentage) || 0
  // productData.stock = parseInt(productData.stock) || 0
  // productData.position = parseInt(productData.position) || 0

  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  // delete dataTemp.updatedBy

  await productRepositories.editProduct(product_id, dataTemp, updatedBy)
}

const detaiProduct = async (product_id: string) => {
  const product = await productRepositories.findProductById(product_id)

  return product
}

const productTrash = async (query: any) => {
  const find: any = {
    deleted: true
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
  const countOrders = await ProductModel.countDocuments(find)

  const objectPagination = paginationHelpers(
    {
      currentPage: 1,
      limitItems: 10,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countOrders
  )
  // End Pagination

  const products = await productRepositories.productTrash(find, sort, objectPagination)

  return {
    products,
    objectSearch,
    objectPagination
  }
}

const permanentlyDeleteProduct = async (product_id: string) => {
  await productRepositories.permanentlyDeleteProduct(product_id)
}

const recoverProduct = async (product_id: string) => {
  await productRepositories.recoverProduct(product_id)
}

export const productServices ={
  getProducts,
  changeStatusProduct,
  deleteProduct,
  createProduct,
  editProduct,
  detaiProduct,
  productTrash,
  permanentlyDeleteProduct,
  recoverProduct
}