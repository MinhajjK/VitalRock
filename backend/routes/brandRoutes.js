import express from 'express'
const router = express.Router()
import {
  getBrands,
  getBrandById,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  getVerifiedBrands,
} from '../controllers/brandController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getBrands).post(protect, admin, createBrand)
router.get('/verified', getVerifiedBrands)
router.get('/slug/:slug', getBrandBySlug)
router
  .route('/:id')
  .get(getBrandById)
  .put(protect, admin, updateBrand)
  .delete(protect, admin, deleteBrand)

export default router
