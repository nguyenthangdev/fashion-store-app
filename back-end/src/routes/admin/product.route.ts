import { Router } from 'express'
const router: Router = Router()
// Upload ảnh
import multer from 'multer'
import { uploadCloudWithManyImagesToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as controller from '~/controllers/admin/product.controller'
import * as validate from '~/validations/admin/product.validation'
import { parseProductData } from '~/middlewares/admin/parseProductData.middleware'; 

router.get('/', controller.index)
router.patch('/change-multi', controller.changeMulti)
router.post(
  '/create',
  multer().array('files', 15), // Nhận tối đa 15 files với tên trường là 'files'
  uploadCloudWithManyImagesToCloud,
  parseProductData,
  validate.createProduct, // middleware
  controller.createProduct
)
router.patch('/change-status/:status/:id', controller.changeStatusProduct)
router.delete('/delete/:id', controller.deleteProduct)
router.patch(
  '/edit/:id',
  multer().array('files', 15), // Nhận tối đa 15 files với tên trường là 'files'
  uploadCloudWithManyImagesToCloud,
  parseProductData,
  validate.editProduct, // middleware
  controller.editProduct
)
router.get('/detail/:id', controller.detaiProduct)

router.get('/trash', controller.productTrash)
router.patch('/trash/form-change-multi-trash', controller.changeMultiTrash)
router.delete('/trash/permanentlyDelete/:id', controller.permanentlyDeleteProduct)
router.patch('/trash/recover/:id', controller.recoverProduct)

export const productRoutes: Router = router
