import express from 'express'
const router = express.Router()
import {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getPermissionsByCategory,
  assignPermissionsToRole,
} from '../../controllers/admin/adminRoleController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'
import { checkPermission } from '../../middleware/authorizationMiddleware.js'

router
  .route('/')
  .get(protect, admin, getRoles)
  .post(protect, admin, checkPermission('settings.roles.manage'), createRole)

router
  .route('/:id')
  .get(protect, admin, getRoleById)
  .put(protect, admin, checkPermission('settings.roles.manage'), updateRole)
  .delete(protect, admin, checkPermission('settings.roles.manage'), deleteRole)

router.get('/permissions/list', protect, admin, getPermissions)
router.get('/permissions/categories', protect, admin, getPermissionsByCategory)
router.put(
  '/:id/permissions',
  protect,
  admin,
  checkPermission('settings.roles.manage'),
  assignPermissionsToRole
)

export default router
