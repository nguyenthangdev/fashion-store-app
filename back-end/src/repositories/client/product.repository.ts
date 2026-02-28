import ProductCategoryModel from '~/models/productCategory.model'
import ProductModel from '~/models/product.model'

const findProductCategoryByParentId = async (parentId: string) => {
  const subs = await ProductCategoryModel.find({
    deleted: false,
    status: 'ACTIVE',
    parent_id: parentId
  }).lean()

  return subs
}

const findProductCategoryById = async (id: string) => {
  const category = await ProductCategoryModel.findOne({
    _id: id,
    deleted: false,
    status: 'ACTIVE'
  })

  return category
}

const findProductCategoryBySlug = async (categorySlug: string) => {
  const category = await ProductCategoryModel.findOne({
    slug: categorySlug,
    status: 'ACTIVE',
    deleted: false
  }).lean()

  return category
}

const getProducts = async (pipeline: any[], sort: any, skip: number, limitItems: number) => {
  const aggregationResult = await ProductModel.aggregate([
    ...pipeline,
    {
      $facet: {
        // Pipeline con 1: Lấy tổng số sản phẩm (sau khi lọc)
        count: [
          { $count: 'total' }
        ],
        // Pipeline con 2: Sắp xếp, bỏ qua và giới hạn để lấy đúng trang
        data: [
          { $sort: sort },
          { $skip: skip },
          { $limit: limitItems }
        ]
      }
    }
  ])

  return aggregationResult
}

const getFilters = async () => {
  const [categories, productAggregations] = await Promise.all([
    // Tác vụ 1: Lấy danh mục Cấp 1
    ProductCategoryModel
      .find({
        deleted: false,
        status: 'ACTIVE',
        $or: [{ parent_id: null }, { parent_id: '' }] // Chỉ lấy danh mục gốc
      })
      .select('title slug _id')
      .sort({ title: 1 })
      .lean(),

    // Tác vụ 2: Chạy aggregation trên sản phẩm
    ProductModel.aggregate([
      { $match: { deleted: false, status: 'ACTIVE' } },
      // Dùng $facet để chạy 3 pipeline con song song
      {
        $facet: {
          // Pipeline con 1: Lấy tất cả màu sắc
          'allColors': [
            { $unwind: '$colors' },
            // Nhóm theo mã màu để đảm bảo tính duy nhất, Lấy giá trị đầu tiên trong nhóm
            { $group: { _id: '$colors.code', name: { $first: '$colors.name' } } },
            // Loại bỏ _id, giữ name, Đổi _id gán vào code
            { $project: { _id: 0, name: '$name', code: '$_id' } },
            { $sort: { name: 1 } } // Sắp xếp theo tên
          ],
          // Pipeline con 2: Lấy tất cả kích cỡ
          'allSizes': [
            { $unwind: '$sizes' },
            { $match: { sizes: { $nin: ['', null] } } }, 
            { $group: { _id: '$sizes' } },
            { $sort: { _id: 1 } }, // Sắp xếp A-Z
            // Loại bỏ _id, Đổi _id gán vào name
            { $project: { _id: 0, name: '$_id' } }
          ],
          // Pipeline con 3: Lấy giá cao nhất
          'maxPrice': [
            { $group: { _id: null, max: { $max: '$price' } } }
          ]
        }
      }
    ])
  ])

  return { categories, productAggregations }
}

const findProducts = async (category: any, listSubCategoryId: any[]) => {
  const products = await ProductModel
    .find({
      deleted: false,
      product_category_id: { $in: [category._id.toString(), ...listSubCategoryId] }
    })
    .sort({ createdAt: -1 })
    .lean()
  
  return products
}

const findProductBySlugAndPopulateComments = async (slugProduct: string) => {
  const find = {
    deleted: false,
    slug: slugProduct,
    status: 'ACTIVE'
  }
  const product = await ProductModel
    .findOne(find)
    .populate('comments.user_id')
    .lean()
  
  return product
}

const getSearchSuggestions = async (find: any) => {
  const products = await ProductModel
    .find(find)
    .select('title thumbnail price discountPercentage slug')
    .limit(10)
  
  return products
}

const findProductById = async (productId: string) => {
  const currentProduct = await ProductModel.findById(productId)

  return currentProduct
}

const findRelatedProducts = async (currentProduct: any, productId: string) => {
  const relatedProducts = await ProductModel.find({
    product_category_id: currentProduct.product_category_id,
    _id: { $ne: productId } // $ne: loại trừ chính sản phẩm đang xem
  }).limit(8)
  return relatedProducts
}

const getTopRatedReviews = async () => {
  const topReviews = await ProductModel.aggregate([
    // Chỉ lấy sản phẩm có bình luận
    { $match: { 'comments.0': { $exists: true } } },
    // Tách mảng comments thành các document riêng lẻ
    { $unwind: '$comments' },
    // Lọc lấy comment 5 sao và đã được duyệt
    {
      $match: {
      'comments.rating': 5,
      'comments.status': 'APPROVED'
      }
    },
    // Sắp xếp (ví dụ: mới nhất)
    { $sort: { 'comments.createdAt': -1 } },
    // Giới hạn số lượng
    { $limit: 10 },
    // Thay thế "root" (sản phẩm) bằng (comment)
    { $replaceRoot: { newRoot: '$comments' } },
    // Lấy thông tin người dùng (tên)
    {
      $lookup: {
        from: 'users', // Tên collection của UserModel model
        localField: 'user_id',
        foreignField: '_id',
        as: 'commentUser'
      }
    },
    // Định dạng lại output
    {
    $project: {
      _id: 0,
      name: { $arrayElemAt: ['$commentUser.fullName', 0] },
      quote: '$content',
      rating: '$rating',
      verified: { $literal: true } // Mặc định là đã xác minh (vì đã mua)
      }
    }
  ])

  return topReviews
}

export const productRepositories = {
  findProductCategoryByParentId,
  findProductCategoryBySlug,
  getProducts,
  getFilters,
  findProducts,
  findProductCategoryById,
  findProductBySlugAndPopulateComments,
  getSearchSuggestions,
  findProductById,
  findRelatedProducts,
  getTopRatedReviews
}