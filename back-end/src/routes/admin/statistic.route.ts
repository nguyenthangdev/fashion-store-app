import { Router } from 'express'
const router: Router = Router()
import * as controller from '~/controllers/admin/statistic.controller'

router.get('/', controller.getStatistic)

export const statisticRoutes: Router = router
