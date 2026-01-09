import asyncHandler from 'express-async-handler'
import Product from '../../models/productModel.js'
import StoreSettings from '../../models/storeSettingsModel.js'
import { logAdminActivity } from '../../utils/activityLogger.js'

// @desc    Get inventory overview
// @route   GET /api/admin/inventory/overview
// @access  Private/Admin
const getInventoryOverview = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  const lowStockThreshold = settings.lowStockThreshold || 10

  const totalProducts = await Product.countDocuments()
  const totalStockValue = await Product.aggregate([
    {
      $project: {
        stockValue: { $multiply: ['$countInStock', '$price'] },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: '$stockValue' },
      },
    },
  ])

  const lowStockProducts = await Product.countDocuments({
    countInStock: { $lte: lowStockThreshold, $gt: 0 },
  })

  const outOfStockProducts = await Product.countDocuments({
    countInStock: { $lte: 0 },
  })

  const inStockProducts = totalProducts - lowStockProducts - outOfStockProducts

  res.json({
    totalProducts,
    totalStockValue: totalStockValue[0]?.total || 0,
    lowStockProducts,
    outOfStockProducts,
    inStockProducts,
    lowStockThreshold,
  })
})

// @desc    Get stock levels
// @route   GET /api/admin/inventory/stock-levels
// @access  Private/Admin
const getStockLevels = asyncHandler(async (req, res) => {
  const pageSize = 20
  const page = Number(req.query.pageNumber) || 1

  const filter = {}

  if (req.query.lowStock === 'true') {
    const settings = await StoreSettings.getStoreSettings()
    const threshold = settings.lowStockThreshold || 10
    filter.countInStock = { $lte: threshold, $gt: 0 }
  }

  if (req.query.outOfStock === 'true') {
    filter.countInStock = { $lte: 0 }
  }

  if (req.query.category) {
    filter.$or = [
      { category: req.query.category },
      { categoryRef: req.query.category },
    ]
  }

  const count = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .select('name image sku countInStock price categoryRef brandRef')
    .populate('categoryRef', 'name')
    .populate('brandRef', 'name')
    .sort({ countInStock: 1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

// @desc    Update stock
// @route   PUT /api/admin/inventory/stock/:id
// @access  Private/Admin
const updateStock = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const { countInStock, action, quantity, reason } = req.body

  const oldStock = product.countInStock

  if (action === 'add') {
    product.countInStock += quantity || 0
  } else if (action === 'subtract') {
    product.countInStock = Math.max(0, product.countInStock - (quantity || 0))
  } else if (countInStock !== undefined) {
    product.countInStock = countInStock
  }

  const updatedProduct = await product.save()

  await logAdminActivity(
    req.user,
    'inventory.stock.updated',
    'Product',
    updatedProduct._id,
    {
      productName: updatedProduct.name,
      oldStock,
      newStock: updatedProduct.countInStock,
      action,
      quantity,
      reason,
    },
    req
  )

  res.json(updatedProduct)
})

// @desc    Get low stock alerts
// @route   GET /api/admin/inventory/alerts/low-stock
// @access  Private/Admin
const getLowStockAlerts = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  const threshold = Number(req.query.threshold) || settings.lowStockThreshold || 10

  const products = await Product.find({
    countInStock: { $lte: threshold, $gt: 0 },
  })
    .select('name image countInStock price sku categoryRef')
    .populate('categoryRef', 'name')
    .sort({ countInStock: 1 })
    .limit(100)

  res.json({
    products,
    threshold,
    count: products.length,
  })
})

// @desc    Get expired product alerts
// @route   GET /api/admin/inventory/alerts/expired
// @access  Private/Admin
const getExpiredProductAlerts = asyncHandler(async (req, res) => {
  const settings = await StoreSettings.getStoreSettings()
  const alertDays = settings.expiryAlertDays || 30

  const today = new Date()
  const alertDate = new Date()
  alertDate.setDate(today.getDate() + alertDays)

  const expiredProducts = await Product.find({
    expiryDate: { $lte: today },
    countInStock: { $gt: 0 },
  })
    .select('name image expiryDate countInStock sku')
    .sort({ expiryDate: 1 })

  const expiringSoonProducts = await Product.find({
    expiryDate: { $gte: today, $lte: alertDate },
    countInStock: { $gt: 0 },
  })
    .select('name image expiryDate countInStock sku')
    .sort({ expiryDate: 1 })

  res.json({
    expired: expiredProducts,
    expiringSoon: expiringSoonProducts,
    alertDays,
  })
})

export {
  getInventoryOverview,
  getStockLevels,
  updateStock,
  getLowStockAlerts,
  getExpiredProductAlerts,
}
