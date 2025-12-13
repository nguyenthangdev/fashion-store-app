import type { DashboardInterface } from '~/types/dashboard.type'
import { API_ROOT } from '~/utils/constants'
import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const fetchDashboardAPI = async (): Promise<DashboardInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/dashboard`
  )
  return response.data
}