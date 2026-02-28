import * as productsHelper from '~/helpers/product'
import { OneProduct } from '~/helpers/product'
import { convertToSlug } from '~/helpers/convertToSlug'
import { searchRepositories } from '~/repositories/client/search.repository'

interface ObjectSearch {
  keyword: string
  regex?: RegExp
}

const getSearch = async (keyword: any) => {
  const objectSearch: ObjectSearch = {
    keyword: ''
  }
  let newProducts = []
  if (keyword) {
    objectSearch.keyword = keyword as string | never
    const stringSlug = convertToSlug(String(keyword))
    const stringSlugRegex = new RegExp(stringSlug, 'i')
    const regex = new RegExp(objectSearch.keyword, 'i')
    const products = await searchRepositories.getProductsBySlug(regex, stringSlugRegex)
  
    newProducts = productsHelper.priceNewProducts(products as OneProduct[])
  }
  return {
    objectSearch,
    newProducts
  }
}

export const searchServices = {
  getSearch
}