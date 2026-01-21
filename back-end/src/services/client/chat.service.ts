import ChatModel from '~/models/chat.model'

export const getChat = async (userId: string) => {
  let chat = await ChatModel.findOne({ user_id: userId })
  if (!chat) {
    chat = new ChatModel({ user_id: userId, messages: [] })
    await chat.save()
  }
  return chat
}