import express from 'express'
const router = express.Router()
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductCategories,
  getProductInventory,
  updateInventory,
  getLowStockAlerts,
  getExpiredProducts,
  getProductAnalytics,
} from '../../controllers/admin/adminProductController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'
import { checkPermission } from '../../middleware/authorizationMiddleware.js'

router
  .route('/')
  .get(protect, admin, checkPermission('products.read'), getAllProducts)
  .post(protect, admin, checkPermission('products.create'), createProduct)

router
  .route('/:id')
  .get(protect, admin, checkPermission('products.read'), getProductById)
  .put(protect, admin, checkPermission('products.update'), updateProduct)
  .delete(protect, admin, checkPermission('products.delete'), deleteProduct)

router.get('/categories', protect, admin, checkPermission('products.categories.manage'), getProductCategories)
router.get('/inventory', protect, admin, checkPermission('inventory.read'), getProductInventory)
router.put('/inventory/:id', protect, admin, checkPermission('inventory.update'), updateInventory)
router.get('/alerts/low-stock', protect, admin, checkPermission('inventory.alerts.read'), getLowStockAlerts)
router.get('/alerts/expired', protect, admin, checkPermission('inventory.alerts.read'), getExpiredProducts)
router.get('/analytics', protect, admin, checkPermission('analytics.products.read'), getProductAnalytics)

export default router
