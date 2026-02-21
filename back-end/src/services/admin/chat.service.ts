import { chatRepositories } from '~/repositories/admin/chat.repository'

const getAdminChatRooms = async () => {
  const chatRooms = await chatRepositories.getAdminChatRooms()

  return chatRooms
}

const getAdminChatHistory = async (userId: string) => {
  const chat = await chatRepositories.getAdminChatHistory(userId)

  return chat
}

export const chatServices = {
  getAdminChatRooms,
  getAdminChatHistory
}
