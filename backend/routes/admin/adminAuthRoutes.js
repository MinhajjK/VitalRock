import express from 'express'
const router = express.Router()
import {
  adminLogin,
  adminLogout,
  getAdminProfile,
} from '../../controllers/admin/adminAuthController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'

router.post('/login', adminLogin)
router.post('/logout', protect, admin, adminLogout)
router.get('/profile', protect, admin, getAdminProfile)

export default router
