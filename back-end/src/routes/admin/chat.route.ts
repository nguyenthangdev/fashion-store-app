import { Router } from 'express'
import * as controller from '~/controllers/admin/chat.controller'
import * as authMiddleware from '~/middlewares/admin/auth.middleware'

const router: Router = Router()

// Admin: Lấy danh sách tất cả các phòng chat
router.get(
  '/',
  authMiddleware.requireAuth,
  controller.getChatRooms
)
// Admin: Lấy lịch sử của 1 phòng chat
router.get(
  '/:userId',
  authMiddleware.requireAuth,
  controller.getChatHistory
)

export const chatRoutes: Router = router
