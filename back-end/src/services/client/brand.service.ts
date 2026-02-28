import { brandRepositories } from '~/repositories/client/brand.repository'

const getAllBrands = async () => {
  const find: any = { deleted: false }
 
  const brands = await brandRepositories.getAllBrands(find)

  return brands
}

export const brandServices = {
  getAllBrands
}