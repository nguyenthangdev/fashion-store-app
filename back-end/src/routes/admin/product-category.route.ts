import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as controller from '~/controllers/admin/product-category.controller'
import * as validate from '~/validates/admin/products-category.validate'
import { requirePermission } from '~/middlewares/admin/role.middleware'

router.get('/', requirePermission("products-category_view"),  controller.index)
// router.patch('/change-status/:status/:id', controller.changeStatus)
router.patch('/change-multi', requirePermission("products-category_edit"),  controller.changeMulti)
router.post(
  '/create',
  requirePermission("products-category_create"),
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.createPost, // middleware
  controller.createPost
)
router.delete('/delete/:id', requirePermission("products-category_delete"), controller.deleteItem)
router.patch(
  '/edit/:id',
  requirePermission("products-category_edit"),
  multer().single('thumbnail'),
  uploadWithOneImageToCloud,
  validate.createPost, // middleware
  controller.editPatch
)
router.get('/detail/:id', requirePermission("products-category_view"), controller.detail)
router.patch('/change-status-with-children/:status/:id', requirePermission("products-category_edit"), controller.changeStatusWithChildren)

export const productCategoryRoutes: Router = router
