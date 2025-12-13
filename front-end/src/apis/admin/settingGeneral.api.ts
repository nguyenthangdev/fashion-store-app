import type { SettingGeneralDetailInterface } from '~/types/setting.type'
import authorizedAxiosInstance from '~/utils/authorizedAxios'
import { API_ROOT } from '~/utils/constants'

export const fetchSettingGeneralAPI = async (): Promise<SettingGeneralDetailInterface> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/settings/general`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchEditSettingGeneralAPI = async (formData: FormData) => {
  const response = await authorizedAxiosInstance.patch(
    `${API_ROOT}/admin/settings/general/edit`,
    formData,
    { withCredentials: true }
  )
  return response.data
}