import ProductModel from '~/models/product.model'

const getProductsBySlug = async (regex: RegExp, stringSlugRegex: RegExp) => {
  const products = await ProductModel.find({
    $or: [
      { title: regex },
      { slug: stringSlugRegex }
    ],
    deleted: false,
    status: 'ACTIVE'
  })

  return products
}

export const searchRepositories = {
  getProductsBySlug
}