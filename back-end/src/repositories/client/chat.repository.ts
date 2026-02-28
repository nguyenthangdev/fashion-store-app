import ChatModel from '~/models/chat.model'

const findChatByUserId = async (userId: string) => {
  let chat = await ChatModel.findOne({ user_id: userId })

  return chat
}

export const chatRepositories = {
  findChatByUserId
}