import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { homeRepositories } from '~/repositories/client/home.repository'

const getHome = async () => {
  // Lấy ra sản phẩm nổi bật
  const productsFeatured = await homeRepositories.findProductsFeatured()

  const newProductsFeatured = productsHelper.priceNewProducts(
    productsFeatured as OneProduct[]
  )

  // Lấy ra sản phẩm mới nhất
  const productsNew = await homeRepositories.findProductsNew()

  const newProductsNew = productsHelper.priceNewProducts(
    productsNew as OneProduct[]
  )

  // Lấy ra bài viết nổi bật
  const articlesFeatured = await homeRepositories.findArticlesFeatured()

  // Lấy ra bài viết mới nhất
  const articlesNew = await homeRepositories.findArticlesNew()
    
  return {
    newProductsFeatured,
    newProductsNew,
    articlesFeatured,
    articlesNew
  }
}

export const homeServices = {
  getHome
}