import asyncHandler from 'express-async-handler'
import Brand from '../models/brandModel.js'

// @desc    Get all brands
// @route   GET /api/brands
// @access  Public
const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find()
    .sort({ name: 1 })
    .populate('certifications', 'name type logo')

  res.json(brands)
})

// @desc    Get single brand
// @route   GET /api/brands/:id
// @access  Public
const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id).populate(
    'certifications',
    'name type logo description'
  )

  if (brand) {
    res.json(brand)
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Get brand by slug
// @route   GET /api/brands/slug/:slug
// @access  Public
const getBrandBySlug = asyncHandler(async (req, res) => {
  const brand = await Brand.findOne({ slug: req.params.slug }).populate(
    'certifications',
    'name type logo description'
  )

  if (brand) {
    res.json(brand)
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Create brand
// @route   POST /api/brands
// @access  Private/Admin
const createBrand = asyncHandler(async (req, res) => {
  const {
    name,
    slug,
    description,
    logo,
    website,
    email,
    phone,
    address,
    certifications,
    isVerified,
  } = req.body

  const brand = new Brand({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    description,
    logo: logo || '',
    website: website || '',
    email: email || '',
    phone: phone || '',
    address: address || {},
    certifications: certifications || [],
    isVerified: isVerified || false,
  })

  const createdBrand = await brand.save()
  res.status(201).json(createdBrand)
})

// @desc    Update brand
// @route   PUT /api/brands/:id
// @access  Private/Admin
const updateBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if (brand) {
    brand.name = req.body.name || brand.name
    brand.slug = req.body.slug || brand.slug
    brand.description = req.body.description || brand.description
    brand.logo = req.body.logo !== undefined ? req.body.logo : brand.logo
    brand.website = req.body.website !== undefined ? req.body.website : brand.website
    brand.email = req.body.email !== undefined ? req.body.email : brand.email
    brand.phone = req.body.phone !== undefined ? req.body.phone : brand.phone
    brand.address = req.body.address || brand.address
    brand.certifications =
      req.body.certifications !== undefined
        ? req.body.certifications
        : brand.certifications
    brand.isVerified =
      req.body.isVerified !== undefined ? req.body.isVerified : brand.isVerified
    brand.rating = req.body.rating !== undefined ? req.body.rating : brand.rating

    const updatedBrand = await brand.save()
    res.json(updatedBrand)
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Delete brand
// @route   DELETE /api/brands/:id
// @access  Private/Admin
const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id)

  if (brand) {
    await brand.remove()
    res.json({ message: 'Brand removed' })
  } else {
    res.status(404)
    throw new Error('Brand not found')
  }
})

// @desc    Get verified brands
// @route   GET /api/brands/verified
// @access  Public
const getVerifiedBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({ isVerified: true })
    .sort({ name: 1 })
    .populate('certifications', 'name type logo')

  res.json(brands)
})

export {
  getBrands,
  getBrandById,
  getBrandBySlug,
  createBrand,
  updateBrand,
  deleteBrand,
  getVerifiedBrands,
}
