import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as validate from '~/validations/admin/article.validation'
import * as controller from '~/controllers/admin/article.controller'

router.get('/', controller.index)
router.patch('/change-multi', controller.changeMulti)
router.post(
  '/create',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.createArticle, // middleware
  controller.createArticle
)
router.delete('/delete/:id', controller.deleteArticle)
router.patch('/change-status/:status/:id', controller.changeStatusArticle)
router.get('/detail/:id', controller.detailArticle)
router.patch(
  '/edit/:id',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.editArticle, // middleware
  controller.editArticle
)

export const articleRoutes: Router = router
