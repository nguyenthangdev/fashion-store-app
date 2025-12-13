import type { ArticleAllResponseInterface } from '~/types/article.type'
import type { ArticleDetailInterface } from '~/types/article.type'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchAllArticlesAPI = async (
  status: string,
  page: number,
  currentKeyword: string,
  currentSortKey: string,
  currentSortValue: string
): Promise<ArticleAllResponseInterface> => {
  const queryParams = new URLSearchParams()
  if (status) queryParams.set('status', status)
  if (page) queryParams.set('page', page.toString())
  if (currentKeyword) queryParams.set('keyword', currentKeyword)
  if (currentSortKey) queryParams.set('sortKey', currentSortKey)
  if (currentSortValue) queryParams.set('sortValue', currentSortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/articles?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles/change-status/${status}/${id}`,
    { status },
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailArticleAPI = async (id: string): Promise<ArticleDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/articles/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditArticleAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDeleteArticleAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/articles/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/articles/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateArticleAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/articles/create`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

