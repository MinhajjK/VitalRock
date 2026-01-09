import express from 'express'
const router = express.Router()
import {
  getInventoryOverview,
  getStockLevels,
  updateStock,
  getLowStockAlerts,
  getExpiredProductAlerts,
} from '../../controllers/admin/adminInventoryController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'
import { checkPermission } from '../../middleware/authorizationMiddleware.js'

router.get('/overview', protect, admin, checkPermission('inventory.read'), getInventoryOverview)
router.get('/stock-levels', protect, admin, checkPermission('inventory.read'), getStockLevels)
router.put('/stock/:id', protect, admin, checkPermission('inventory.update'), updateStock)
router.get('/alerts/low-stock', protect, admin, checkPermission('inventory.alerts.read'), getLowStockAlerts)
router.get('/alerts/expired', protect, admin, checkPermission('inventory.alerts.read'), getExpiredProductAlerts)

export default router
