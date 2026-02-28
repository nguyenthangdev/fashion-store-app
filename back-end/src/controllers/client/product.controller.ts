import { Request, Response } from 'express'
import { productServices } from '~/services/client/product.service'
import { StatusCodes } from 'http-status-codes'

// [GET] /products
export const getProducts = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getProducts(req.query)

    if (!result.success) {
      return res.status(StatusCodes.NOT_FOUND).json({
        code: result.code,
        message: result.message,
        products: result.products,
        pagination: result.pagination
      })
    }

    const {
      newProducts,
      objectPagination,
      objectSearch
    } = result
    console.log('newProducts: ', newProducts)
    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      products: newProducts,
      pagination: objectPagination,
      allProducts: [],
      keyword: objectSearch.keyword,
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /products/filters
export const getFilters = async (req: Request, res: Response) => {
  try {
    const { categories, productAggregations } = await productServices.getFilters()
    // 4. XỬ LÝ KẾT QUẢ TỪ $facet
    const filterData = productAggregations[0]
    if (!filterData) {
      // Trả về dữ liệu rỗng nếu không có sản phẩm nào trong DB
      return res.status(StatusCodes.OK).json({
        code: 200,
        message: 'Lấy dữ liệu filter thành công!',
        filters: {
          categories: categories || [],
          colors: [],
          sizes: [],
          maxPrice: 5000000 
        }
      })
    }
    const colors = filterData.allColors
    const sizes = filterData.allSizes.map(s => s.name) // Lấy tên từ object
    const maxPrice = filterData.maxPrice[0]?.max || 5000000 // Lấy giá trị, hoặc 5 triệu nếu không có sản phẩm nào

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy dữ liệu filter thành công!',
      filters: {
        categories: categories || [],
        colors: colors || [],
        sizes: sizes || [],
        maxPrice: maxPrice
      }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /products/:slugCategory
export const category = async (req: Request, res: Response) => {
  try {
    const { newProducts, category } = await productServices.category(req.params.slugCategory)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      products: newProducts,
      pageTitle: category.title
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /products/detail/:slugProduct
export const detail = async (req: Request, res: Response) => {
  try {
    const product = await productServices.detail(req.params.slugProduct)

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      product: product
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /products/suggestions
export const getSearchSuggestions = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getSearchSuggestions(req.query)
    if (!result.success) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: result.code,
        message: result.message,
        products: result.products
      })
      return
    }
    const { newProducts } = result

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      products: newProducts
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /products/related/:productId
export const getRelatedProducts = async (req: Request, res: Response) => {
  try {
    const result = await productServices.getRelatedProducts(req.params.productId)
    if (!result.success) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: result.code,
        message: result.message,
        products: result.products
      })
      return
    }
    const { newProducts } = result

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Thành công!',
      products: newProducts
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [POST] /products/:productId/reviews
export const createReview = async (req: Request, res: Response) => {
  try {
    const result = await productServices.createReview(req.body, req.params.productId, req['fileUrls'], req["accountUser"]._id)
    if (!result.success) {
      res.status(StatusCodes.NOT_FOUND).json({
        code: result.code,
        message: result.message
      })
      return
    }
    res.status(StatusCodes.CREATED).json({ 
      code: 201, 
      message: 'Gửi đánh giá thành công!' 
    })

  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /products/reviews/top-rated
export const getTopRatedReviews = async (req: Request, res: Response) => {
  try {
    const formattedReviews = await productServices.getTopRatedReviews()

    res.status(StatusCodes.OK).json({
      code: 200,
      message: 'Lấy đánh giá thành công!',
      reviews: formattedReviews
    })
    } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
