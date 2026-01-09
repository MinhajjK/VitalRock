import express from 'express'
const router = express.Router()
import {
  getStoreProfile,
  updateStoreProfile,
  getStoreSettings,
  updateStoreSettings,
  getPaymentMethods,
  updatePaymentMethods,
  getShippingZones,
  updateShippingZones,
  getBanners,
  createBanner,
  updateBanner,
  deleteBanner,
  getHomepageSections,
  updateHomepageSections,
  getFeaturedProducts,
  updateFeaturedProducts,
} from '../../controllers/admin/adminStoreController.js'
import { protect, admin } from '../../middleware/authMiddleware.js'
import { checkPermission } from '../../middleware/authorizationMiddleware.js'

router
  .route('/profile')
  .get(protect, admin, checkPermission('store.profile.read'), getStoreProfile)
  .put(protect, admin, checkPermission('store.profile.update'), updateStoreProfile)

router
  .route('/settings')
  .get(protect, admin, checkPermission('store.settings.read'), getStoreSettings)
  .put(protect, admin, checkPermission('store.settings.update'), updateStoreSettings)

router
  .route('/payment-methods')
  .get(protect, admin, checkPermission('store.payment.manage'), getPaymentMethods)
  .put(protect, admin, checkPermission('store.payment.manage'), updatePaymentMethods)

router
  .route('/shipping-zones')
  .get(protect, admin, checkPermission('store.shipping.manage'), getShippingZones)
  .put(protect, admin, checkPermission('store.shipping.manage'), updateShippingZones)

router
  .route('/banners')
  .get(protect, admin, checkPermission('store.banners.manage'), getBanners)
  .post(protect, admin, checkPermission('store.banners.manage'), createBanner)

router
  .route('/banners/:id')
  .put(protect, admin, checkPermission('store.banners.manage'), updateBanner)
  .delete(protect, admin, checkPermission('store.banners.manage'), deleteBanner)

router
  .route('/homepage-sections')
  .get(protect, admin, checkPermission('store.homepage.manage'), getHomepageSections)
  .put(protect, admin, checkPermission('store.homepage.manage'), updateHomepageSections)

router
  .route('/featured-products')
  .get(protect, admin, checkPermission('store.homepage.manage'), getFeaturedProducts)
  .put(protect, admin, checkPermission('store.homepage.manage'), updateFeaturedProducts)

export default router
