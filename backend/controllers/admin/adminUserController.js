import asyncHandler from 'express-async-handler'
import User from '../../models/userModel.js'
import Role from '../../models/roleModel.js'
import Order from '../../models/orderModel.js'
import { logAdminActivity } from '../../utils/activityLogger.js'

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const pageSize = 20
  const page = Number(req.query.pageNumber) || 1

  const filter = {}

  // Role filter
  if (req.query.role) {
    const role = await Role.findOne({ slug: req.query.role })
    if (role) {
      filter.role = role._id
    }
  }

  // Status filter
  if (req.query.isActive !== undefined) {
    filter.isActive = req.query.isActive === 'true'
  }

  // Search filter
  if (req.query.keyword) {
    filter.$or = [
      { name: { $regex: req.query.keyword, $options: 'i' } },
      { email: { $regex: req.query.keyword, $options: 'i' } },
    ]
  }

  const count = await User.countDocuments(filter)
  const users = await User.find(filter)
    .select('-password -twoFactorSecret')
    .populate('role', 'name slug level')
    .sort({ createdAt: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1))

  res.json({
    users,
    page,
    pages: Math.ceil(count / pageSize),
    total: count,
  })
})

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-password -twoFactorSecret')
    .populate('role', 'name slug level permissions')
    .populate('permissions', 'name slug category')

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  res.json(user)
})

// @desc    Create user (admin)
// @route   POST /api/admin/users
// @access  Private/Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, isAdmin } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Get role if provided
  let userRole = null
  if (role) {
    userRole = await Role.findOne({ slug: role })
    if (!userRole) {
      res.status(400)
      throw new Error('Invalid role')
    }
  } else {
    // Default to Customer role
    userRole = await Role.findOne({ slug: 'customer' })
  }

  const user = await User.create({
    name,
    email,
    password,
    role: userRole._id,
    isAdmin: isAdmin || false,
    createdBy: req.user._id,
  })

  const userWithRole = await User.findById(user._id)
    .select('-password')
    .populate('role', 'name slug level')

  await logAdminActivity(
    req.user,
    'user.created',
    'User',
    user._id,
    {
      userName: user.name,
      userEmail: user.email,
      role: userRole.name,
    },
    req
  )

  res.status(201).json(userWithRole)
})

// @desc    Update user
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const { name, email, role, isAdmin, isActive, permissions } = req.body

  if (name) user.name = name
  if (email) user.email = email
  if (isAdmin !== undefined) user.isAdmin = isAdmin
  if (isActive !== undefined) user.isActive = isActive

  // Update role
  if (role) {
    const newRole = await Role.findOne({ slug: role })
    if (newRole) {
      user.role = newRole._id
    }
  }

  // Update permissions
  if (permissions) {
    user.permissions = permissions
  }

  // Update password if provided
  if (req.body.password) {
    user.password = req.body.password
  }

  const updatedUser = await user.save()

  const userWithRole = await User.findById(updatedUser._id)
    .select('-password -twoFactorSecret')
    .populate('role', 'name slug level')
    .populate('permissions', 'name slug')

  await logAdminActivity(
    req.user,
    'user.updated',
    'User',
    user._id,
    {
      userName: user.name,
      updatedFields: Object.keys(req.body),
    },
    req
  )

  res.json(userWithRole)
})

// @desc    Block/Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const blockUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const { isActive, reason } = req.body

  user.isActive = isActive !== undefined ? isActive : !user.isActive

  const updatedUser = await user.save()

  await logAdminActivity(
    req.user,
    user.isActive ? 'user.unblocked' : 'user.blocked',
    'User',
    user._id,
    {
      userName: user.name,
      isActive: user.isActive,
      reason,
    },
    req
  )

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    isActive: updatedUser.isActive,
  })
})

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  // Prevent deletion of super admin
  if (user.role && user.role.level === 1) {
    res.status(400)
    throw new Error('Cannot delete super admin')
  }

  await logAdminActivity(
    req.user,
    'user.deleted',
    'User',
    user._id,
    {
      userName: user.name,
      userEmail: user.email,
    },
    req
  )

  await user.remove()
  res.json({ message: 'User removed' })
})

// @desc    Get user orders
// @route   GET /api/admin/users/:id/orders
// @access  Private/Admin
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .limit(50)

  res.json(orders)
})

// @desc    Get user activity
// @route   GET /api/admin/users/:id/activity
// @access  Private/Admin
const getUserActivity = asyncHandler(async (req, res) => {
  const ActivityLog = (await import('../../models/activityLogModel.js')).default

  const logs = await ActivityLog.find({ user: req.params.id })
    .sort({ createdAt: -1 })
    .limit(100)

  res.json(logs)
})

// @desc    Create sub-admin
// @route   POST /api/admin/users/sub-admins
// @access  Private/Admin (Super Admin only)
const createSubAdmin = asyncHandler(async (req, res) => {
  // Check if user is super admin
  if (req.user.role.level !== 1) {
    res.status(403)
    throw new Error('Only super admin can create sub-admins')
  }

  const { name, email, password, role, permissions } = req.body

  const userExists = await User.findOne({ email })

  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }

  // Get Store Manager role or specified role
  let userRole = null
  if (role) {
    userRole = await Role.findOne({ slug: role })
    if (!userRole || userRole.level === 1) {
      res.status(400)
      throw new Error('Invalid role for sub-admin')
    }
  } else {
    userRole = await Role.findOne({ slug: 'store-manager' })
  }

  const user = await User.create({
    name,
    email,
    password,
    role: userRole._id,
    permissions: permissions || [],
    isAdmin: true,
    createdBy: req.user._id,
  })

  const userWithRole = await User.findById(user._id)
    .select('-password')
    .populate('role', 'name slug level')
    .populate('permissions', 'name slug')

  await logAdminActivity(
    req.user,
    'user.sub-admin.created',
    'User',
    user._id,
    {
      userName: user.name,
      role: userRole.name,
    },
    req
  )

  res.status(201).json(userWithRole)
})

// @desc    Get all sub-admins
// @route   GET /api/admin/users/sub-admins
// @access  Private/Admin
const getSubAdmins = asyncHandler(async (req, res) => {
  const storeManagerRole = await Role.findOne({ slug: 'store-manager' })

  const filter = {
    role: storeManagerRole?._id,
    isAdmin: true,
  }

  const subAdmins = await User.find(filter)
    .select('-password -twoFactorSecret')
    .populate('role', 'name slug level')
    .populate('permissions', 'name slug')
    .sort({ createdAt: -1 })

  res.json(subAdmins)
})

// @desc    Update sub-admin permissions
// @route   PUT /api/admin/users/sub-admins/:id/permissions
// @access  Private/Admin (Super Admin only)
const updateSubAdminPermissions = asyncHandler(async (req, res) => {
  // Check if user is super admin
  if (req.user.role.level !== 1) {
    res.status(403)
    throw new Error('Only super admin can update sub-admin permissions')
  }

  const user = await User.findById(req.params.id)

  if (!user) {
    res.status(404)
    throw new Error('User not found')
  }

  const { permissions } = req.body

  user.permissions = permissions || []
  const updatedUser = await user.save()

  const userWithRole = await User.findById(updatedUser._id)
    .select('-password')
    .populate('role', 'name slug level')
    .populate('permissions', 'name slug')

  await logAdminActivity(
    req.user,
    'user.sub-admin.permissions.updated',
    'User',
    user._id,
    {
      userName: user.name,
      permissionCount: permissions.length,
    },
    req
  )

  res.json(userWithRole)
})

export {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  blockUser,
  deleteUser,
  getUserOrders,
  getUserActivity,
  createSubAdmin,
  getSubAdmins,
  updateSubAdminPermissions,
}
