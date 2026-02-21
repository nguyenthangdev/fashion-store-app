import BrandModel from '~/models/brand.model'
import paginationHelpers from '~/helpers/pagination'
import searchHelpers from '~/helpers/search'
import { BrandInterface } from '~/interfaces/admin/brand.interface'
import { brandRepositories } from '~/repositories/admin/brand.repository'

const getBrands = async (query: any) => {
  const find: any = { deleted: false }
    
  // Search
  const objectSearch = searchHelpers(query)
  if (objectSearch.regex) {
    find.title = objectSearch.regex
  }
  // End search

  // Pagination
  const countBrands = await BrandModel.countDocuments(find)
  const objectPagination = paginationHelpers(
    {
      currentPage: 1, limitItems: 10,
      skip: 0,
      totalPage: 0,
      totalItems: 0
    },
    query,
    countBrands
  )
  // End Pagination

  const brands = await brandRepositories.getBrands(find, objectPagination)

  return {
    brands,
    objectPagination
  }
}

const createBrand = async (data: BrandInterface, account_id: string) => {
  const dataTemp = {
    title: data.title,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: {
      account_id
    }
  }

  const brand = new BrandModel(dataTemp)
  await brand.save()
  const brandToObject = brand.toObject()
  return brandToObject
}

const detailBrand = async (brand_id: string) => {
  const brand = await brandRepositories.detailBrand(brand_id)

  return brand
}

const editBrand = async (data: BrandInterface, brand_id: string, account_id: string) => {
  const updatedBy = {
    account_id: account_id,
    updatedAt: new Date()
  }
  const dataTemp = {
    title: data.title,
    status: data.status,
    thumbnail: data.thumbnail,
    createdBy: account_id
  }
  await brandRepositories.editBrand(brand_id, dataTemp, updatedBy)
}

const deleteBrand = async (brand_id: string, account_id: string) => {
  const deletedBy = {
    account_id: account_id,
    deletedAt: new Date()
  }
  await brandRepositories.deleteBrand(brand_id, deletedBy)
}

export const brandServices = {
  getBrands,
  createBrand,
  editBrand,
  detailBrand,
  deleteBrand
}
