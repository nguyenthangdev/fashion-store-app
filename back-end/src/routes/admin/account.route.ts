import { Router } from 'express'
const router: Router = Router()

import * as controller from '~/controllers/admin/account.controller'
import multer from 'multer'
import { uploadWithOneImageToCloud } from '~/middlewares/admin/uploadCloud.middleware'
import * as validate from '~/validations/admin/account.validation'

router.get('/', controller.getAllAccounts)
router.get('/get-roles', controller.getAllRoles)
router.post(
  '/create',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.createAccount,
  controller.createAccount
)
router.patch('/change-status/:status/:id', controller.changeAccountStatusById)
router.patch(
  '/edit/:id',
  multer().single('avatar'),
  uploadWithOneImageToCloud,
  validate.editAccountById,
  controller.editAccountById
)
router.get('/detail/:id', controller.accountDetail)
router.delete('/delete/:id', controller.deleteAccountById)

export const accountRoutes: Router = router
