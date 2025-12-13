import { API_ROOT } from '~/utils/constants'
import type { AdminChatRoomsResponse, AdminChatHistoryResponse } from '~/types/chat.type'
import authorizedAxiosInstance from '~/utils/authorizedAxios'

export const fetchAdminChatRoomsAPI = async (): Promise<AdminChatRoomsResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/chats`,
    { withCredentials: true }
  )
  return response.data
}

export const fetchAdminChatHistoryAPI = async (userId: string): Promise<AdminChatHistoryResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/admin/chats/${userId}`,
    { withCredentials: true }
  )
  return response.data
}
