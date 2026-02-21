import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { chatServices } from '~/services/admin/chat.service'

// [GET] /admin/chats
export const getChatRooms = async (req: Request, res: Response) => {
  try {
    const chatRooms = await chatServices.getAdminChatRooms()

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      chatRooms 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}

// [GET] /admin/chats/:userId
export const getChatHistory = async (req: Request, res: Response) => {
  try {
    const chat = await chatServices.getAdminChatHistory(req.params.userId)

    if (!chat) {
      return res.status(StatusCodes.NOT_FOUND).json({ 
        code: 404, 
        message: 'Không tìm thấy cuộc trò chuyện!' 
      })
    }

    res.status(StatusCodes.OK).json({ 
      code: 200, 
      chat 
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      code: 500,
      message: 'Đã xảy ra lỗi hệ thống!'
    })
  }
}
