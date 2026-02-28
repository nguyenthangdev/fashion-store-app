import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'
import { productRepositories } from '~/repositories/client/product.repository'

const getSubCategory = async (parentId: string) => {
  const subs = await productRepositories.findProductCategoryByParentId(parentId)

  let allSub = [...subs]

  for (const sub of subs) {
    const childs = await getSubCategory(sub._id.toString())
    allSub = allSub.concat(childs)
  }

  return allSub
}

const getProducts = async (query: any) => {
  const find: any = { deleted: false }
  // console.log('Query received in service:', query) // Debug log
  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex || objectSearch.slug) {
    find.$or = [
      { title: objectSearch.regex },
      { slug: objectSearch.slug }
    ]
  }
  // End search
  
  if (query.category) {
    const categorySlug = query.category.toString()
    const category = await productRepositories.findProductCategoryBySlug(categorySlug)
    // console.log('Category found:', category) // Debug log
    if (category) {
      // SỬ DỤNG HÀM ĐỆ QUY `getSubCategory`
      // Lấy tất cả ID của danh mục con (Cấp 2, 3, 4...)
      const listSubCategory = await getSubCategory(category._id.toString())
      // console.log('Subcategories found:', listSubCategory) // Debug log
      const listSubCategoryId = listSubCategory.map((item) => item._id.toString())
      // Tìm sản phẩm có product_category_id nằm trong đây
      // console.log('list id: ', [category._id.toString(), ...listSubCategoryId]) // Debug log
      find.product_category_id = { $in: [category._id.toString(), ...listSubCategoryId] }
      // console.log('find: ', find)
    } else {
      return { 
        success: false, 
        code: 404, 
        message: 'Danh mục không tồn tại!', 
        products: [], 
        pagination: {} 
      }
    }
  }

  if (query.maxPrice) {
    find.price = { $lte: parseInt(query.maxPrice.toString()) }
  }

  if (query.color) {
    find['colors.name'] = query.color.toString()
  }

  if (query.size) {
    find.sizes = query.size.toString()
  }

  const currentPage = parseInt(query.page as string) || 1
  const limitItems = 18 // Số sản phẩm mỗi trang
  const skip = (currentPage - 1) * limitItems
  const sort: any = {}
  const sortKey = query.sortKey as string
  const sortValue = query.sortValue === 'asc' ? 1 : -1 // Chuyển 'asc'/'desc' thành 1/-1
  if (sortKey) {
    sort[sortKey] = sortValue
  } else {
    sort.createdAt = -1
  }
  
  // XÂY DỰNG AGGREGATION PIPELINE
  const pipeline: any[] = [
    // Lọc sản phẩm
    { $match: find },
    // Tạo trường 'discountedPrice' (giá khuyến mãi)
    {
      $addFields: {
        discountedPrice: {
          $floor: { // Giống Math.floor
            $multiply: [
              '$price',
              { $divide: [{ $subtract: [100, '$discountPercentage'] }, 100] }
            ]
          }
        }
      }
    }
  ]

  // CHẠY PIPELINE ĐỂ LẤY DỮ LIỆU VÀ TỔNG SỐ LƯỢNG
  // Dùng $facet để chạy 2 truy vấn con song song: 1. đếm, 2. lấy dữ liệu đã phân trang
  const aggregationResult = await productRepositories.getProducts(pipeline, sort, skip, limitItems)
  // console.log('aggregationResult: ', aggregationResult)
  // console.log('Aggregation result:', JSON.stringify(aggregationResult, null, 2)) // Debug log
  const products = aggregationResult[0].data
  const countProducts = aggregationResult[0].count[0]?.total || 0

  const objectPagination = paginationHelpers(
    {
      currentPage, limitItems,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countProducts
  )

  const newProducts = productsHelper.priceNewProducts(
    products as OneProduct[]
  )

  return {
    success: true,
    newProducts,
    objectPagination,
    objectSearch
  }
}

const getFilters = async () => {
  // Chạy 2 tác vụ lấy dữ liệu song song, thay vì nối tiếp
  const { categories, productAggregations } = await productRepositories.getFilters()

  return {
    categories,
    productAggregations
  }
}

const category = async (slugCategory: string) => {
  const category = await productRepositories.findProductCategoryBySlug(slugCategory)

  const listSubCategory = await getSubCategory(category._id.toString())

  const listSubCategoryId = listSubCategory.map((item) => item._id.toString())

  const products = await productRepositories.findProducts(category, listSubCategoryId)

  const newProducts = productsHelper.priceNewProducts(
    products as OneProduct[]
  )
  return {
    newProducts,
    category
  }
}

const detail = async (slugProduct: string) => {
  const product = await productRepositories.findProductBySlugAndPopulateComments(slugProduct)
    
  if (product.comments && product.comments.length > 0) {
    product.comments.sort((a: any, b: any) => {
      // Sắp xếp giảm dần (descending) theo thời gian
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
  }

  if (product.product_category_id) {
    const category = await productRepositories.findProductCategoryById(product.product_category_id.toString())

    product['category'] = category
  }

  product['priceNew'] = productsHelper.priceNewProduct(product as OneProduct)

  return product
}

const getSearchSuggestions = async (query: any) => {
  const find: any = { deleted: false, status: 'ACTIVE' }

  if (!query.keyword || !query.keyword.trim()) {
    return { 
      success: false, 
      code: 404, 
      message: 'Không tồn tại keyword!', 
      products: [] 
    }
  }

  const objectSearch = searchHelpers(query)
  if (objectSearch.regex || objectSearch.slug) {
    find.$or = [
      { title: objectSearch.regex },
      { slug: objectSearch.slug }
    ]
  }

  const products = await productRepositories.getSearchSuggestions(find)

  const newProducts = productsHelper.priceNewProducts(
    products as OneProduct[]
  )

  return {
    success: true,
    newProducts
  }
}

const getRelatedProducts = async (productId: string) => {
  // Tìm sản phẩm hiện tại để lấy category_id
  const currentProduct = await productRepositories.findProductById(productId)

  if (!currentProduct || !currentProduct.product_category_id) {
    return { 
      success: false, 
      code: 404, 
      message: 'Không tồn tại product_category_id!', 
      products: [] 
    }
  }

  // Tìm các sản phẩm khác có cùng category_id
  const relatedProducts = await productRepositories.findRelatedProducts(currentProduct, productId)

  const newProducts = productsHelper.priceNewProducts(
    relatedProducts as OneProduct[]
  )
  return {
    success: true,
    newProducts
  } 
}

const createReview = async (data: any, productId: string, fileUrls: any, account_id: string) => {
  const userId = account_id // Lấy từ middleware xác thực
  const { rating, content, color, size } = data
  const images = fileUrls || [] // Lấy URL ảnh từ middleware uploadCloud

  const product = await productRepositories.findProductById(productId)

  if (!product) {
    return { 
      success: false, 
      code: 404, 
      message: 'Không tìm thấy sản phẩm!' 
    }
  }

  const newReview = {
    user_id: userId,
    rating: Number(rating),
    content: content,
    images: images,
    color: color,
    size: size,
    status: 'APPROVED'
  }

  // Thêm đánh giá mới vào sản phẩm
  product.comments.push(newReview)

  // Tính toán lại điểm sao trung bình
  let totalRating = 0
  const approvedComments = product.comments.filter(c => c.status === 'APPROVED')
  
  approvedComments.forEach(comment => {
    totalRating += comment.rating
  })

  product.stars.count = approvedComments.length
  product.stars.average = approvedComments.length > 0 ? totalRating / approvedComments.length : 0

  await product.save()
  return { success: true }
}

const getTopRatedReviews = async () => {
  const topReviews = await productRepositories.getTopRatedReviews()

  // Xử lý trường hợp không tìm thấy tên
  const formattedReviews = topReviews.map((review) => ({
    ...review,
    name: review.name || 'Người dùng ẩn danh'
  }))

  return formattedReviews
}

export const productServices = {
  getSubCategory,
  getProducts,
  getFilters,
  category,
  detail,
  getSearchSuggestions,
  getRelatedProducts,
  createReview,
  getTopRatedReviews
}