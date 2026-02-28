import ChatModel from '~/models/chat.model'
import { chatRepositories } from '~/repositories/client/chat.repository'

const getChat = async (userId: string) => {
  let chat = await chatRepositories.findChatByUserId(userId)

  if (!chat) {
    chat = new ChatModel({ user_id: userId, messages: [] })
    await chat.save()
  }
  return chat
}

export const chatServices = {
  getChat
}