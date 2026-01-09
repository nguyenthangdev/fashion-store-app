import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/client/product.controller'
// Upload ảnh
import multer from 'multer'
import { uploadCloudWithManyImagesToCloud } from '~/middlewares/admin/uploadCloud.middleware'
// Upload ảnh
import * as authMiddleware from '~/middlewares/client/auth.middleware'

router.get('/', controller.index)
router.get('/suggestions', controller.getSearchSuggestions)
router.get('/filters', controller.getFilters)
router.get('/:slugCategory', controller.category)
router.get('/detail/:slugProduct', controller.detail)
router.get('/related/:productId', controller.getRelatedProducts)
router.post(
  '/:productId/reviews',
  authMiddleware.requireAuth,
  multer().array('images', 5), // Cho phép upload tối đa 5 ảnh
  uploadCloudWithManyImagesToCloud,
  controller.createReview 
)
router.get('/reviews/top-rated', controller.getTopRatedReviews)
export const productRoutes: Router = router
