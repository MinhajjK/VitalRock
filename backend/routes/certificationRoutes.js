import express from 'express'
const router = express.Router()
import {
  getCertifications,
  getCertificationById,
  getCertificationsByType,
  createCertification,
  updateCertification,
  deleteCertification,
} from '../controllers/certificationController.js'
import { protect, admin } from '../middleware/authMiddleware.js'

router.route('/').get(getCertifications).post(protect, admin, createCertification)
router.get('/type/:type', getCertificationsByType)
router
  .route('/:id')
  .get(getCertificationById)
  .put(protect, admin, updateCertification)
  .delete(protect, admin, deleteCertification)

export default router
