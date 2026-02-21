import { PaginationInterface } from '~/interfaces/admin/general.interface'
import BrandModel from '~/models/brand.model'

const getBrands = async (find: any, objectPagination: PaginationInterface) => {
  const brands = await BrandModel
    .find(find)
    .sort({ createdAt: -1 })
    .limit(objectPagination.limitItems)
    .skip(objectPagination.skip)

  return brands
}

const editBrand = async (brand_id: string, dataTemp: any, updatedBy: any) => {
  await BrandModel.updateOne(
    { _id: brand_id },
    { 
      $set: dataTemp,
      $push: { updatedBy }
    }
  )
}

const deleteBrand = async (brand_id: string, deletedBy: any) => {
  await BrandModel.updateOne(
    { _id: brand_id },
    { $set: { deleted: true, deletedBy }}
  )
}

const detailBrand = async (brand_id: string) => {
  const brand = await BrandModel.findById(brand_id)
  
  return brand
}

export const brandRepositories = {
  getBrands,
  editBrand,
  deleteBrand,
  detailBrand
}
