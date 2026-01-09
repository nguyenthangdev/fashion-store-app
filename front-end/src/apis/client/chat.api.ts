import { API_ROOT } from '~/utils/constants'
import type { ClientChatAPIResponse } from '~/types/chat.type'
import authorizedAxiosInstance from '~/utils/authorizedAxiosClient'

export const fetchClientChatAPI = async (): Promise<ClientChatAPIResponse> => {
  const response = await authorizedAxiosInstance.get(
    `${API_ROOT}/chats`
  )
  return response.data
}

