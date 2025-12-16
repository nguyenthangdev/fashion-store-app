import type { AllParams } from '~/types/helper.type'
import type { ProductAPIResponse, ProductDetailInterface } from '~/types/product.type'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchProductAPI = async (
  params: AllParams
): Promise<ProductAPIResponse> => {
  const queryParams = new URLSearchParams()
  if (params.status) queryParams.set('status', params.status)
  if (params.page) queryParams.set('page', params.page.toString())
  if (params.keyword) queryParams.set('keyword', params.keyword)
  if (params.sortKey) queryParams.set('sortKey', params.sortKey)
  if (params.sortValue) queryParams.set('sortValue', params.sortValue)

  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products?${queryParams.toString()}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeStatusAPI = async (status: string, id: string) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/change-status/${status}/${id}`,
    { status },
    { withCredentials: true }
  )
  return response.data
}

export const fetchDetailProductAPI = async (id: string): Promise<ProductDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/products/detail/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditProductAPI = async (id: string, formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/edit/${id}`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

export const fetchDeleteProductAPI = async (id: string) => {
  const response = await authorizedAxiosInstance.delete(
    `${API_ROOT}/admin/products/delete/${id}`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchChangeMultiAPI = async (data: { ids: string[], type: string }) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/products/change-multi`,
    data,
    { withCredentials: true }
  )
  return response.data
}

export const fetchCreateProductAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.post(
    `${API_ROOT}/admin/products/create`,
    formData,
    { withCredentials: true }
  )
  return response.data
}

