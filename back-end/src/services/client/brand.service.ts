import BrandModel from '~/models/brand.model'

export const getAllBrands = async () => {
    const find: any = { deleted: false }
 
    const brands = await BrandModel
      .find(find)
      .sort({ createdAt: -1 })
      .lean()

    return brands
}