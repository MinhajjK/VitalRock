import asyncHandler from 'express-async-handler'
import Category from '../models/categoryModel.js'

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .populate('parentCategory', 'name slug')

  res.json(categories)
})

// @desc    Get single category
// @route   GET /api/categories/:id
// @access  Public
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id).populate(
    'parentCategory',
    'name slug'
  )

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Get category by slug
// @route   GET /api/categories/slug/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug }).populate(
    'parentCategory',
    'name slug'
  )

  if (category) {
    res.json(category)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Create category
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const { name, slug, description, image, parentCategory, displayOrder } =
    req.body

  const category = new Category({
    name,
    slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
    description,
    image: image || '',
    parentCategory: parentCategory || null,
    displayOrder: displayOrder || 0,
  })

  const createdCategory = await category.save()
  res.status(201).json(createdCategory)
})

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    category.name = req.body.name || category.name
    category.slug = req.body.slug || category.slug
    category.description = req.body.description || category.description
    category.image = req.body.image !== undefined ? req.body.image : category.image
    category.parentCategory = req.body.parentCategory !== undefined
      ? req.body.parentCategory
      : category.parentCategory
    category.isActive =
      req.body.isActive !== undefined ? req.body.isActive : category.isActive
    category.displayOrder =
      req.body.displayOrder !== undefined
        ? req.body.displayOrder
        : category.displayOrder

    const updatedCategory = await category.save()
    res.json(updatedCategory)
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id)

  if (category) {
    await category.remove()
    res.json({ message: 'Category removed' })
  } else {
    res.status(404)
    throw new Error('Category not found')
  }
})

// @desc    Get category tree (with subcategories)
// @route   GET /api/categories/tree
// @access  Public
const getCategoryTree = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true })
    .sort({ displayOrder: 1 })
    .populate('parentCategory', 'name slug')

  // Build tree structure
  const categoryMap = {}
  const rootCategories = []

  categories.forEach((category) => {
    categoryMap[category._id] = { ...category.toObject(), children: [] }
  })

  categories.forEach((category) => {
    if (category.parentCategory) {
      const parentId = category.parentCategory._id || category.parentCategory
      if (categoryMap[parentId]) {
        categoryMap[parentId].children.push(categoryMap[category._id])
      }
    } else {
      rootCategories.push(categoryMap[category._id])
    }
  })

  res.json(rootCategories)
})

export {
  getCategories,
  getCategoryById,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryTree,
}
