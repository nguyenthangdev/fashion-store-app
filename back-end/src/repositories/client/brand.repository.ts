import BrandModel from '~/models/brand.model'

const getAllBrands = async (find: any) => {
  const brands = await BrandModel
    .find(find)
    .sort({ createdAt: -1 })
    .lean()

  return brands
}

export const brandRepositories = {
  getAllBrands
}
