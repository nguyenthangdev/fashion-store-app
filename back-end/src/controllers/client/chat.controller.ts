import { Request, Response } from 'express'
import * as chatService from '~/services/client/chat.service'

// Lấy hoặc tạo phòng chat cho client đang đăng nhập
// [GET] /chats
export const getChat = async (req: Request, res: Response) => {
  try {
    const chat = await chatService.getChat(req['accountUser']._id)
    
    res.json({ code: 200, chat })
  } catch (error) {
    console.error('Lỗi khi lấy client chat:', error)
    res.json({ code: 400, message: 'Lỗi!', error: error.message })
  }
}
