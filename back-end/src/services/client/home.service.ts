import ProductModel from '~/models/product.model'
import ArticleModel from '~/models/article.model'
import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'

export const home = async () => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await ProductModel.find({
    featured: '1',
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(6)

  const newProductsFeatured = productsHelper.priceNewProducts(
    productsFeatured as OneProduct[]
  )

  // Lấy ra sản phẩm mới nhất
  const productsNew = await ProductModel.find({
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(6)

  const newProductsNew = productsHelper.priceNewProducts(
    productsNew as OneProduct[]
  )

  // Lấy ra bài viết nổi bật
  const articlesFeatured = await ArticleModel.find({
    featured: '1',
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(5)

  // Lấy ra bài viết mới nhất
  const articlesNew = await ArticleModel.find({
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(5)
    
  return {
    newProductsFeatured,
    newProductsNew,
    articlesFeatured,
    articlesNew
  }
}