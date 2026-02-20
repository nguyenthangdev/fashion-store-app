import { Router } from 'express'
const router: Router = Router()

import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
import * as validate from '~/validations/admin/article.validation'
import * as controller from '~/controllers/admin/article.controller'

router.get('/', controller.getAllArticles)

router.patch('/change-multi', controller.changeMulti)

router.post(
  '/create',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.createArticle,
  controller.createArticle
)

router.delete('/delete/:id', controller.deleteArticle)

router.patch('/change-status/:status/:id', controller.changeArticleStatus)

router.get('/detail/:id', controller.articleDetail)

router.patch(
  '/edit/:id',
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.editArticle,
  controller.editArticle
)

export const articleRoutes: Router = router
