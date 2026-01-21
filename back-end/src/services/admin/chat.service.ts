import ChatModel from "~/models/chat.model"

export const getAdminChatRooms = async () => {
  const chatRooms = await ChatModel
    .find()
    .populate('user_id', 'fullName avatar') // Lấy thông tin user
    .sort({ lastMessageAt: -1 }) // Sắp xếp theo tin nhắn mới nhất
    .lean() // Dùng .lean() để tăng tốc độ
  return chatRooms
}

export const getAdminChatHistory = async (userId: string) => {
  const chat = await ChatModel
    .findOne({ user_id: userId })
    .populate('user_id', 'fullName avatar')
    .lean()
  return chat
}