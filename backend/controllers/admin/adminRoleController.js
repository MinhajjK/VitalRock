import asyncHandler from 'express-async-handler'
import Role from '../../models/roleModel.js'
import Permission from '../../models/permissionModel.js'
import { logAdminActivity } from '../../utils/activityLogger.js'

// @desc    Get all roles
// @route   GET /api/admin/roles
// @access  Private/Admin
const getRoles = asyncHandler(async (req, res) => {
  const roles = await Role.find({})
    .populate('permissions', 'name slug category resource action')
    .sort({ level: 1 })

  res.json(roles)
})

// @desc    Get role by ID
// @route   GET /api/admin/roles/:id
// @access  Private/Admin
const getRoleById = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id).populate(
    'permissions',
    'name slug category resource action'
  )

  if (!role) {
    res.status(404)
    throw new Error('Role not found')
  }

  res.json(role)
})

// @desc    Create new role
// @route   POST /api/admin/roles
// @access  Private/Admin (requires settings.roles.manage permission)
const createRole = asyncHandler(async (req, res) => {
  const { name, slug, description, level, permissions } = req.body

  // Check if role with same slug exists
  const existingRole = await Role.findOne({ slug })
  if (existingRole) {
    res.status(400)
    throw new Error('Role with this slug already exists')
  }

  const role = await Role.create({
    name,
    slug,
    description,
    level,
    permissions: permissions || [],
    isSystemRole: false,
    isActive: true,
  })

  await role.populate('permissions', 'name slug category resource action')

  await logAdminActivity(
    req.user,
    'role.created',
    'Role',
    role._id,
    { roleName: role.name },
    req
  )

  res.status(201).json(role)
})

// @desc    Update role
// @route   PUT /api/admin/roles/:id
// @access  Private/Admin (requires settings.roles.manage permission)
const updateRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id)

  if (!role) {
    res.status(404)
    throw new Error('Role not found')
  }

  // Prevent modification of system roles (except permissions)
  if (role.isSystemRole) {
    const { name, slug, level, description, ...updateData } = req.body
    if (name || slug || level || description) {
      res.status(400)
      throw new Error('Cannot modify system role properties')
    }
  }

  // Update role
  Object.assign(role, req.body)
  const updatedRole = await role.save()
  await updatedRole.populate('permissions', 'name slug category resource action')

  await logAdminActivity(
    req.user,
    'role.updated',
    'Role',
    role._id,
    { roleName: role.name },
    req
  )

  res.json(updatedRole)
})

// @desc    Delete role
// @route   DELETE /api/admin/roles/:id
// @access  Private/Admin (requires settings.roles.manage permission)
const deleteRole = asyncHandler(async (req, res) => {
  const role = await Role.findById(req.params.id)

  if (!role) {
    res.status(404)
    throw new Error('Role not found')
  }

  // Prevent deletion of system roles
  if (role.isSystemRole) {
    res.status(400)
    throw new Error('Cannot delete system role')
  }

  // Check if role is assigned to any users
  const User = (await import('../../models/userModel.js')).default
  const usersWithRole = await User.countDocuments({ role: role._id })
  if (usersWithRole > 0) {
    res.status(400)
    throw new Error(`Cannot delete role. It is assigned to ${usersWithRole} user(s).`)
  }

  await role.remove()

  await logAdminActivity(
    req.user,
    'role.deleted',
    'Role',
    role._id,
    { roleName: role.name },
    req
  )

  res.json({ message: 'Role deleted successfully' })
})

// @desc    Get all permissions
// @route   GET /api/admin/permissions
// @access  Private/Admin
const getPermissions = asyncHandler(async (req, res) => {
  const permissions = await Permission.find({ isActive: true }).sort({
    category: 1,
    resource: 1,
    action: 1,
  })

  res.json(permissions)
})

// @desc    Get permissions by category
// @route   GET /api/admin/permissions/categories
// @access  Private/Admin
const getPermissionsByCategory = asyncHandler(async (req, res) => {
  const permissions = await Permission.find({ isActive: true })

  const grouped = permissions.reduce((acc, perm) => {
    if (!acc[perm.category]) {
      acc[perm.category] = []
    }
    acc[perm.category].push(perm)
    return acc
  }, {})

  res.json(grouped)
})

// @desc    Assign permissions to role
// @route   PUT /api/admin/roles/:id/permissions
// @access  Private/Admin (requires settings.roles.manage permission)
const assignPermissionsToRole = asyncHandler(async (req, res) => {
  const { permissions } = req.body

  const role = await Role.findById(req.params.id)

  if (!role) {
    res.status(404)
    throw new Error('Role not found')
  }

  // Validate permission IDs
  const validPermissions = await Permission.find({
    _id: { $in: permissions },
    isActive: true,
  })

  if (validPermissions.length !== permissions.length) {
    res.status(400)
    throw new Error('One or more invalid permissions')
  }

  role.permissions = permissions
  const updatedRole = await role.save()
  await updatedRole.populate('permissions', 'name slug category resource action')

  await logAdminActivity(
    req.user,
    'role.permissions.updated',
    'Role',
    role._id,
    { roleName: role.name, permissionCount: permissions.length },
    req
  )

  res.json(updatedRole)
})

export {
  getRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getPermissions,
  getPermissionsByCategory,
  assignPermissionsToRole,
}
