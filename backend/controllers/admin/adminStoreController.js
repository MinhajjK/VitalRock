import asyncHandler from 'express-async-handler'
import StoreSettings from '../../models/storeSettingsModel.js'
import Product from '../../models/productModel.js'
import { logAdminActivity } from '../../utils/activityLogger.js'

// @desc    Get store profile
// @route   GET /api/admin/store/profile
// @access  Private/Admin
const getStoreProfile = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  res.json({
    storeName: settings.storeName,
    storeLogo: settings.storeLogo,
    storeDescription: settings.storeDescription,
    contactEmail: settings.contactEmail,
    contactPhone: settings.contactPhone,
    address: settings.address,
    organicCertifications: settings.organicCertifications,
  })
})

// @desc    Update store profile
// @route   PUT /api/admin/store/profile
// @access  Private/Admin
const updateStoreProfile = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  const {
    storeName,
    storeLogo,
    storeDescription,
    contactEmail,
    contactPhone,
    address,
    organicCertifications,
  } = req.body

  if (storeName) settings.storeName = storeName
  if (storeLogo !== undefined) settings.storeLogo = storeLogo
  if (storeDescription !== undefined) settings.storeDescription = storeDescription
  if (contactEmail) settings.contactEmail = contactEmail
  if (contactPhone !== undefined) settings.contactPhone = contactPhone
  if (address) settings.address = address
  if (organicCertifications) settings.organicCertifications = organicCertifications

  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.profile.updated',
    'StoreSettings',
    updatedSettings._id,
    { updatedFields: Object.keys(req.body) },
    req
  )

  res.json({
    storeName: updatedSettings.storeName,
    storeLogo: updatedSettings.storeLogo,
    storeDescription: updatedSettings.storeDescription,
    contactEmail: updatedSettings.contactEmail,
    contactPhone: updatedSettings.contactPhone,
    address: updatedSettings.address,
    organicCertifications: updatedSettings.organicCertifications,
  })
})

// @desc    Get store settings
// @route   GET /api/admin/store/settings
// @access  Private/Admin
const getStoreSettings = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  res.json({
    currency: settings.currency,
    taxRate: settings.taxRate,
    shippingZones: settings.shippingZones,
    paymentMethods: settings.paymentMethods,
    allowRegistration: settings.allowRegistration,
    requireEmailVerification: settings.requireEmailVerification,
    minOrderAmount: settings.minOrderAmount,
    freeShippingThreshold: settings.freeShippingThreshold,
    lowStockThreshold: settings.lowStockThreshold,
    expiryAlertDays: settings.expiryAlertDays,
  })
})

// @desc    Update store settings
// @route   PUT /api/admin/store/settings
// @access  Private/Admin
const updateStoreSettings = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  const {
    currency,
    taxRate,
    shippingZones,
    paymentMethods,
    allowRegistration,
    requireEmailVerification,
    minOrderAmount,
    freeShippingThreshold,
    lowStockThreshold,
    expiryAlertDays,
  } = req.body

  if (currency) settings.currency = currency
  if (taxRate !== undefined) settings.taxRate = taxRate
  if (shippingZones) settings.shippingZones = shippingZones
  if (paymentMethods) settings.paymentMethods = paymentMethods
  if (allowRegistration !== undefined) settings.allowRegistration = allowRegistration
  if (requireEmailVerification !== undefined)
    settings.requireEmailVerification = requireEmailVerification
  if (minOrderAmount !== undefined) settings.minOrderAmount = minOrderAmount
  if (freeShippingThreshold !== undefined)
    settings.freeShippingThreshold = freeShippingThreshold
  if (lowStockThreshold !== undefined) settings.lowStockThreshold = lowStockThreshold
  if (expiryAlertDays !== undefined) settings.expiryAlertDays = expiryAlertDays

  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.settings.updated',
    'StoreSettings',
    updatedSettings._id,
    { updatedFields: Object.keys(req.body) },
    req
  )

  res.json({
    currency: updatedSettings.currency,
    taxRate: updatedSettings.taxRate,
    shippingZones: updatedSettings.shippingZones,
    paymentMethods: updatedSettings.paymentMethods,
    allowRegistration: updatedSettings.allowRegistration,
    requireEmailVerification: updatedSettings.requireEmailVerification,
    minOrderAmount: updatedSettings.minOrderAmount,
    freeShippingThreshold: updatedSettings.freeShippingThreshold,
    lowStockThreshold: updatedSettings.lowStockThreshold,
    expiryAlertDays: updatedSettings.expiryAlertDays,
  })
})

// @desc    Get payment methods
// @route   GET /api/admin/store/payment-methods
// @access  Private/Admin
const getPaymentMethods = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  res.json(settings.paymentMethods)
})

// @desc    Update payment methods
// @route   PUT /api/admin/store/payment-methods
// @access  Private/Admin
const updatePaymentMethods = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  if (req.body.paymentMethods) {
    settings.paymentMethods = { ...settings.paymentMethods, ...req.body.paymentMethods }
  }

  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.payment-methods.updated',
    'StoreSettings',
    updatedSettings._id,
    {},
    req
  )

  res.json(updatedSettings.paymentMethods)
})

// @desc    Get shipping zones
// @route   GET /api/admin/store/shipping-zones
// @access  Private/Admin
const getShippingZones = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  res.json(settings.shippingZones)
})

// @desc    Update shipping zones
// @route   PUT /api/admin/store/shipping-zones
// @access  Private/Admin
const updateShippingZones = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  if (req.body.shippingZones) {
    settings.shippingZones = req.body.shippingZones
  }

  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.shipping-zones.updated',
    'StoreSettings',
    updatedSettings._id,
    { zoneCount: updatedSettings.shippingZones.length },
    req
  )

  res.json(updatedSettings.shippingZones)
})

// @desc    Get banners
// @route   GET /api/admin/store/banners
// @access  Private/Admin
const getBanners = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  res.json(settings.banners)
})

// @desc    Create banner
// @route   POST /api/admin/store/banners
// @access  Private/Admin
const createBanner = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  const newBanner = {
    title: req.body.title,
    image: req.body.image,
    link: req.body.link,
    position: req.body.position || 'top',
    isActive: req.body.isActive !== undefined ? req.body.isActive : true,
    displayOrder: req.body.displayOrder || 0,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
  }

  settings.banners.push(newBanner)
  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.banner.created',
    'Banner',
    null,
    { bannerTitle: newBanner.title },
    req
  )

  const createdBanner = updatedSettings.banners[updatedSettings.banners.length - 1]
  res.status(201).json(createdBanner)
})

// @desc    Update banner
// @route   PUT /api/admin/store/banners/:id
// @access  Private/Admin
const updateBanner = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  const banner = settings.banners.id(req.params.id)

  if (!banner) {
    res.status(404)
    throw new Error('Banner not found')
  }

  Object.assign(banner, req.body)
  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.banner.updated',
    'Banner',
    banner._id,
    { bannerTitle: banner.title },
    req
  )

  res.json(banner)
})

// @desc    Delete banner
// @route   DELETE /api/admin/store/banners/:id
// @access  Private/Admin
const deleteBanner = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  const banner = settings.banners.id(req.params.id)

  if (!banner) {
    res.status(404)
    throw new Error('Banner not found')
  }

  await logAdminActivity(
    req.user,
    'store.banner.deleted',
    'Banner',
    banner._id,
    { bannerTitle: banner.title },
    req
  )

  banner.remove()
  await settings.save()

  res.json({ message: 'Banner deleted successfully' })
})

// @desc    Get homepage sections
// @route   GET /api/admin/store/homepage-sections
// @access  Private/Admin
const getHomepageSections = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  res.json(settings.homepageSections)
})

// @desc    Update homepage sections
// @route   PUT /api/admin/store/homepage-sections
// @access  Private/Admin
const updateHomepageSections = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  if (req.body.homepageSections) {
    settings.homepageSections = req.body.homepageSections
  }

  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.homepage-sections.updated',
    'StoreSettings',
    updatedSettings._id,
    { sectionCount: updatedSettings.homepageSections.length },
    req
  )

  res.json(updatedSettings.homepageSections)
})

// @desc    Get featured products
// @route   GET /api/admin/store/featured-products
// @access  Private/Admin
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  const featuredProducts = await Product.find({
    _id: { $in: settings.featuredProducts },
  }).select('name image price')

  res.json(featuredProducts)
})

// @desc    Update featured products
// @route   PUT /api/admin/store/featured-products
// @access  Private/Admin
const updateFeaturedProducts = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()

  if (req.body.featuredProducts) {
    settings.featuredProducts = req.body.featuredProducts
  }

  const updatedSettings = await settings.save()

  await logAdminActivity(
    req.user,
    'store.featured-products.updated',
    'StoreSettings',
    updatedSettings._id,
    { productCount: updatedSettings.featuredProducts.length },
    req
  )

  const featuredProducts = await Product.find({
    _id: { $in: updatedSettings.featuredProducts },
  }).select('name image price')

  res.json(featuredProducts)
})

export {
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
}
