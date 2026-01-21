import { convertToSlug } from "./convertToSlug"
import { SearchInterface, QueryInterface } from "~/interfaces/admin/general.interface"

const searchHelpers = (query: QueryInterface): SearchInterface => {
  const objectSearch: SearchInterface = {
    keyword: ''
  }

  if (query.keyword) {
    if (typeof query.keyword === 'string') {  
      objectSearch.keyword = query.keyword.trim()
      const stringSlug = convertToSlug(String(query.keyword))
      const stringSlugRegex = new RegExp(stringSlug, 'i')
      const regex = new RegExp(objectSearch.keyword, 'i') // Lưu ý: không sử dụng global(g) do sẽ có sự luân phiên true/false khi hàm test chạy.

      objectSearch.regex = regex
      objectSearch.slug = stringSlugRegex
    }
  }

  return objectSearch
}

export default searchHelpers
