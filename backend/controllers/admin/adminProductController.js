import asyncHandler from 'express-async-handler'
import Product from '../../models/productModel.js'
import Category from '../../models/categoryModel.js'
import { logAdminActivity } from '../../utils/activityLogger.js'

// @desc    Get all products (admin view with filters)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = asyncHandler(async (req, res) => {
  const pageSize = 12
  const page = Number(req.query.pageNumber) || 1

  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  const filter = { ...keyword }

  // Additional admin filters
  if (req.query.category) {
    filter.$or = [
      { category: req.query.category },
      { categoryRef: req.query.category },
    ]
  }

  if (req.query.brand) {
    filter.$or = [
      { brand: req.query.brand },
      { brandRef: req.query.brand },
    ]
  }

  if (req.query.isOrganic !== undefined) {
    filter.isOrganic = req.query.isOrganic === 'true'
  }

  if (req.query.lowStock === 'true') {
    filter.countInStock = { $lte: 10 }
  }

  if (req.query.outOfStock === 'true') {
    filter.countInStock = { $lte: 0 }
  }

  const count = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .populate('categoryRef', 'name slug')
    .populate('brandRef', 'name slug')
    .populate('certifications', 'name type logo')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    products,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

// @desc    Get product by ID (admin)
// @route   GET /api/admin/products/:id
// @access  Private/Admin
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('categoryRef', 'name slug')
    .populate('brandRef', 'name slug')
    .populate('certifications', 'name type logo description')

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create product
// @route   POST /api/admin/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    ...req.body,
    user: req.user._id,
  })

  const createdProduct = await product.save()

  await logAdminActivity(
    req.user,
    'product.created',
    'Product',
    createdProduct._id,
    { productName: createdProduct.name },
    req
  )

  res.status(201).json(createdProduct)
})

// @desc    Update product
// @route   PUT /api/admin/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  Object.assign(product, req.body)
  const updatedProduct = await product.save()

  await logAdminActivity(
    req.user,
    'product.updated',
    'Product',
    updatedProduct._id,
    { productName: updatedProduct.name, updatedFields: Object.keys(req.body) },
    req
  )

  res.json(updatedProduct)
})

// @desc    Delete product
// @route   DELETE /api/admin/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  await logAdminActivity(
    req.user,
    'product.deleted',
    'Product',
    product._id,
    { productName: product.name },
    req
  )

  await product.remove()
  res.json({ message: 'Product removed' })
})

// @desc    Get product categories
// @route   GET /api/admin/products/categories
// @access  Private/Admin
const getProductCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort({
    displayOrder: 1,
    name: 1,
  })
  res.json(categories)
})

// @desc    Get inventory status
// @route   GET /api/admin/products/inventory
// @access  Private/Admin
const getProductInventory = asyncHandler(async (req, res) => {
  const lowStockThreshold = 10 // Can be fetched from store settings

  const totalProducts = await Product.countDocuments()
  const lowStockProducts = await Product.countDocuments({
    countInStock: { $lte: lowStockThreshold, $gt: 0 },
  })
  const outOfStockProducts = await Product.countDocuments({
    countInStock: { $lte: 0 },
  })
  const inStockProducts = await Product.countDocuments({
    countInStock: { $gt: lowStockThreshold },
  })

  res.json({
    totalProducts,
    lowStockProducts,
    outOfStockProducts,
    inStockProducts,
    lowStockThreshold,
  })
})

// @desc    Update inventory
// @route   PUT /api/admin/products/inventory/:id
// @access  Private/Admin
const updateInventory = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (!product) {
    res.status(404)
    throw new Error('Product not found')
  }

  const { countInStock, action, quantity } = req.body

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
    'inventory.updated',
    'Product',
    updatedProduct._id,
    {
      productName: updatedProduct.name,
      newStock: updatedProduct.countInStock,
      action,
      quantity,
    },
    req
  )

  res.json(updatedProduct)
})

// @desc    Get low stock alerts
// @route   GET /api/admin/products/alerts/low-stock
// @access  Private/Admin
const getLowStockAlerts = asyncHandler(async (req, res) => {
  const threshold = Number(req.query.threshold) || 10

  const products = await Product.find({
    countInStock: { $lte: threshold, $gt: 0 },
  })
    .select('name image countInStock price sku')
    .sort({ countInStock: 1 })
    .limit(50)

  res.json(products)
})

// @desc    Get expired products
// @route   GET /api/admin/products/alerts/expired
// @access  Private/Admin
const getExpiredProducts = asyncHandler(async (req, res) => {
  const today = new Date()

  const products = await Product.find({
    expiryDate: { $lte: today },
  })
    .select('name image expiryDate countInStock sku')
    .sort({ expiryDate: 1 })

  res.json(products)
})

// @desc    Get product analytics
// @route   GET /api/admin/products/analytics
// @access  Private/Admin
const getProductAnalytics = asyncHandler(async (req, res) => {
  const totalProducts = await Product.countDocuments()
  const organicProducts = await Product.countDocuments({ isOrganic: true })
  const featuredProducts = await Product.countDocuments({ isFeatured: true })
  const newArrivals = await Product.countDocuments({ isNewArrival: true })
  const outOfStock = await Product.countDocuments({ countInStock: { $lte: 0 } })

  // Top selling products (would need order data)
  // For now, return basic stats
  res.json({
    totalProducts,
    organicProducts,
    featuredProducts,
    newArrivals,
    outOfStock,
    inStock: totalProducts - outOfStock,
  })
})

export {
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
}
