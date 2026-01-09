import express from 'express'
const router = express.Router()
import {
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  assignDeliveryPartner,
  cancelOrder,
  processRefund,
  generateInvoice,
  getOrderAnalytics,
} from '../../controllers/admin/adminOrderController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'
import { checkPermission } from '../../middleware/authorizationMiddleware.js'

router.get('/', protect, admin, checkPermission('orders.read'), getAllOrders)
router.get('/analytics', protect, admin, checkPermission('analytics.sales.read'), getOrderAnalytics)
router.get('/:id', protect, admin, checkPermission('orders.read'), getOrderById)
router.put('/:id/status', protect, admin, checkPermission('orders.update'), updateOrderStatus)
router.put('/:id/assign-delivery', protect, admin, checkPermission('orders.assign-delivery'), assignDeliveryPartner)
router.post('/:id/cancel', protect, admin, checkPermission('orders.cancel'), cancelOrder)
router.post('/:id/refund', protect, admin, checkPermission('orders.refund'), processRefund)
router.get('/:id/invoice', protect, admin, checkPermission('orders.invoice'), generateInvoice)

export default router
