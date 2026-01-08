import asyncHandler from 'express-async-handler'
import Product from '../models/productModel.js'

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  // Build keyword search
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {}

  // Build filter object
  const filter = { ...keyword }

  // Organic filters
  if (req.query.isOrganic === 'true') {
    filter.isOrganic = true
  }

  if (req.query.isVegan === 'true') {
    filter.isVegan = true
  }

  if (req.query.isGlutenFree === 'true') {
    filter.isGlutenFree = true
  }

  if (req.query.isFairTrade === 'true') {
    filter.isFairTrade = true
  }

  // Product type filter
  if (req.query.productType) {
    filter.productType = req.query.productType
  }

  // Category filter
  if (req.query.category) {
    filter.$or = [
      { category: req.query.category },
      { categoryRef: req.query.category },
    ]
  }

  // Brand filter
  if (req.query.brand) {
    filter.$or = [
      { brand: req.query.brand },
      { brandRef: req.query.brand },
    ]
  }

  // Certification filter
  if (req.query.certification) {
    filter.certifications = req.query.certification
  }

  // Origin filter
  if (req.query.origin) {
    filter.origin = { $regex: req.query.origin, $options: 'i' }
  }

  // Price range filter
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {}
    if (req.query.minPrice) {
      filter.price.$gte = Number(req.query.minPrice)
    }
    if (req.query.maxPrice) {
      filter.price.$lte = Number(req.query.maxPrice)
    }
  }

  // Featured products
  if (req.query.featured === 'true') {
    filter.isFeatured = true
  }

  // New arrivals
  if (req.query.newArrival === 'true') {
    filter.isNewArrival = true
  }

  // Build sort object
  let sort = {}
  if (req.query.sortBy) {
    switch (req.query.sortBy) {
      case 'priceAsc':
        sort = { price: 1 }
        break
      case 'priceDesc':
        sort = { price: -1 }
        break
      case 'rating':
        sort = { rating: -1 }
        break
      case 'newest':
        sort = { createdAt: -1 }
        break
      case 'name':
        sort = { name: 1 }
        break
      default:
        sort = { createdAt: -1 }
    }
  } else {
    sort = { createdAt: -1 }
  }

  const count = await Product.countDocuments(filter)
  const products = await Product.find(filter)
    .populate('categoryRef', 'name slug')
    .populate('brandRef', 'name slug logo')
    .populate('certifications', 'name type logo')
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('categoryRef', 'name slug description image')
    .populate('brandRef', 'name slug logo description website')
    .populate('certifications', 'name type logo description issuingAuthority')

  if (product) {
    res.json(product)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id)

  if (product) {
    await product.remove()
    res.json({ message: 'Product removed' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    images,
    brand,
    brandRef,
    category,
    categoryRef,
    countInStock,
    productType,
    weight,
    unit,
    origin,
    countryOfOrigin,
    certifications,
    ingredients,
    nutritionalInfo,
    healthBenefits,
    storageInstructions,
    expiryDate,
    shelfLife,
    isOrganic,
    isFairTrade,
    isVegan,
    isGlutenFree,
    sku,
    barcode,
    pricePerUnit,
    isFeatured,
    isNewArrival,
    tags,
  } = req.body

  const product = new Product({
    name: name || 'Sample name',
    price: price || 0,
    user: req.user._id,
    image: image || '/images/sample.jpg',
    images: images || [],
    brand: brand || 'Sample brand',
    brandRef: brandRef || null,
    category: category || 'Sample category',
    categoryRef: categoryRef || null,
    countInStock: countInStock || 0,
    numReviews: 0,
    description: description || 'Sample description',
    productType: productType || 'Other',
    weight: weight || 0,
    unit: unit || 'g',
    origin: origin || '',
    countryOfOrigin: countryOfOrigin || '',
    certifications: certifications || [],
    ingredients: ingredients || [],
    nutritionalInfo: nutritionalInfo || {},
    healthBenefits: healthBenefits || [],
    storageInstructions: storageInstructions || '',
    expiryDate: expiryDate || null,
    shelfLife: shelfLife || 365,
    isOrganic: isOrganic || false,
    isFairTrade: isFairTrade || false,
    isVegan: isVegan || false,
    isGlutenFree: isGlutenFree || false,
    sku: sku || '',
    barcode: barcode || '',
    pricePerUnit: pricePerUnit || 0,
    isFeatured: isFeatured || false,
    isNewArrival: isNewArrival || false,
    tags: tags || [],
  })

  const createdProduct = await product.save()
  res.status(201).json(createdProduct)
})

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    images,
    brand,
    brandRef,
    category,
    categoryRef,
    countInStock,
    productType,
    weight,
    unit,
    origin,
    countryOfOrigin,
    certifications,
    ingredients,
    nutritionalInfo,
    healthBenefits,
    storageInstructions,
    expiryDate,
    shelfLife,
    isOrganic,
    isFairTrade,
    isVegan,
    isGlutenFree,
    sku,
    barcode,
    pricePerUnit,
    isFeatured,
    isNewArrival,
    tags,
  } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    // Update basic fields
    product.name = name || product.name
    product.price = price !== undefined ? price : product.price
    product.description = description || product.description
    product.image = image || product.image
    product.images = images !== undefined ? images : product.images
    product.brand = brand || product.brand
    product.brandRef = brandRef || product.brandRef
    product.category = category || product.category
    product.categoryRef = categoryRef || product.categoryRef
    product.countInStock =
      countInStock !== undefined ? countInStock : product.countInStock

    // Update organic store fields
    if (productType !== undefined) product.productType = productType
    if (weight !== undefined) product.weight = weight
    if (unit !== undefined) product.unit = unit
    if (origin !== undefined) product.origin = origin
    if (countryOfOrigin !== undefined)
      product.countryOfOrigin = countryOfOrigin
    if (certifications !== undefined) product.certifications = certifications
    if (ingredients !== undefined) product.ingredients = ingredients
    if (nutritionalInfo !== undefined)
      product.nutritionalInfo = nutritionalInfo
    if (healthBenefits !== undefined) product.healthBenefits = healthBenefits
    if (storageInstructions !== undefined)
      product.storageInstructions = storageInstructions
    if (expiryDate !== undefined) product.expiryDate = expiryDate
    if (shelfLife !== undefined) product.shelfLife = shelfLife
    if (isOrganic !== undefined) product.isOrganic = isOrganic
    if (isFairTrade !== undefined) product.isFairTrade = isFairTrade
    if (isVegan !== undefined) product.isVegan = isVegan
    if (isGlutenFree !== undefined) product.isGlutenFree = isGlutenFree
    if (sku !== undefined) product.sku = sku
    if (barcode !== undefined) product.barcode = barcode
    if (pricePerUnit !== undefined) product.pricePerUnit = pricePerUnit
    if (isFeatured !== undefined) product.isFeatured = isFeatured
    if (isNewArrival !== undefined) product.isNewArrival = isNewArrival
    if (tags !== undefined) product.tags = tags

    const updatedProduct = await product.save()
    res.json(updatedProduct)
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body

  const product = await Product.findById(req.params.id)

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
      res.status(400)
      throw new Error('Product already reviewed')
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    }

    product.reviews.push(review)

    product.numReviews = product.reviews.length

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length

    await product.save()
    res.status(201).json({ message: 'Review added' })
  } else {
    res.status(404)
    throw new Error('Product not found')
  }
})

// @desc    Get top rated products
// @route   GET /api/products/top
// @access  Public
const getTopProducts = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 3
  const products = await Product.find({})
    .populate('categoryRef', 'name slug')
    .populate('brandRef', 'name slug logo')
    .populate('certifications', 'name type logo')
    .sort({ rating: -1 })
    .limit(limit)

  res.json(products)
})

// @desc    Get organic products
// @route   GET /api/products/organic
// @access  Public
const getOrganicProducts = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Product.countDocuments({ isOrganic: true })
  const products = await Product.find({ isOrganic: true })
    .populate('categoryRef', 'name slug')
    .populate('brandRef', 'name slug logo')
    .populate('certifications', 'name type logo')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get products by type
// @route   GET /api/products/type/:type
// @access  Public
const getProductsByType = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Product.countDocuments({
    productType: req.params.type,
  })
  const products = await Product.find({ productType: req.params.type })
    .populate('categoryRef', 'name slug')
    .populate('brandRef', 'name slug logo')
    .populate('certifications', 'name type logo')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

// @desc    Get products by certification
// @route   GET /api/products/certification/:certId
// @access  Public
const getProductsByCertification = asyncHandler(async (req, res) => {
  const pageSize = 10
  const page = Number(req.query.pageNumber) || 1

  const count = await Product.countDocuments({
    certifications: req.params.certId,
  })
  const products = await Product.find({ certifications: req.params.certId })
    .populate('categoryRef', 'name slug')
    .populate('brandRef', 'name slug logo')
    .populate('certifications', 'name type logo')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({ products, page, pages: Math.ceil(count / pageSize) })
})

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
  getTopProducts,
  getOrganicProducts,
  getProductsByType,
  getProductsByCertification,
}
