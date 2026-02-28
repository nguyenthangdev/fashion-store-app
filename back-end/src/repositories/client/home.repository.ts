import ProductModel from '~/models/product.model'
import ArticleModel from '~/models/article.model'

const findProductsFeatured = async () => {
  const productsFeatured = await ProductModel.find({
    featured: '1',
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(6)
  
  return productsFeatured
}

const findProductsNew = async () => {
  const productsNew = await ProductModel.find({
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(6)
  
  return productsNew
}

const findArticlesFeatured = async () => {
  const articlesFeatured = await ArticleModel.find({
    featured: '1',
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(5)
  
  return articlesFeatured
}

const findArticlesNew = async () => {
  const articlesNew = await ArticleModel.find({
    deleted: false,
    status: 'ACTIVE'
  })
    .sort({ createdAt: -1 })
    .limit(5)
  
  return articlesNew
}

export const homeRepositories = {
  findProductsFeatured,
  findProductsNew,
  findArticlesFeatured,
  findArticlesNew
}