import express from 'express'
const router = express.Router()
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  blockUser,
  deleteUser,
  getUserOrders,
  getUserActivity,
  createSubAdmin,
  getSubAdmins,
  updateSubAdminPermissions,
} from '../../controllers/admin/adminUserController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'
import { checkPermission } from '../../middleware/authorizationMiddleware.js'

router
  .route('/')
  .get(protect, admin, checkPermission('users.read'), getAllUsers)
  .post(protect, admin, checkPermission('users.create'), createUser)

router
  .route('/:id')
  .get(protect, admin, checkPermission('users.read'), getUserById)
  .put(protect, admin, checkPermission('users.update'), updateUser)
  .delete(protect, admin, checkPermission('users.delete'), deleteUser)

router.put('/:id/block', protect, admin, checkPermission('users.block'), blockUser)
router.get('/:id/orders', protect, admin, checkPermission('users.read'), getUserOrders)
router.get('/:id/activity', protect, admin, checkPermission('users.read'), getUserActivity)

router
  .route('/sub-admins')
  .get(protect, admin, checkPermission('users.sub-admins.manage'), getSubAdmins)
  .post(protect, admin, checkPermission('users.sub-admins.create'), createSubAdmin)

router.put(
  '/sub-admins/:id/permissions',
  protect,
  admin,
  checkPermission('users.sub-admins.manage'),
  updateSubAdminPermissions
)

export default router
