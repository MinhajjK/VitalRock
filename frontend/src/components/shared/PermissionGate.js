import React from 'react'
import { useSelector } from 'react-redux'

const PermissionGate = ({
  children,
  permission = null,
  role = null,
  minRoleLevel = null,
  fallback = null,
  adminOnly = false,
}) => {
  const userLogin = useSelector((state) => state.userLogin)
  const { userInfo } = userLogin

  // If no user, show fallback
  if (!userInfo) {
    return fallback || null
  }

  // Check admin only
  if (adminOnly) {
    const isAdmin =
      userInfo.isAdmin || (userInfo.role && userInfo.role.level <= 2)
    if (!isAdmin) {
      return fallback || null
    }
  }

  // Check specific role
  if (role) {
    if (!userInfo.role || userInfo.role.slug !== role) {
      return fallback || null
    }
  }

  // Check minimum role level
  if (minRoleLevel !== null) {
    if (!userInfo.role || userInfo.role.level > minRoleLevel) {
      return fallback || null
    }
  }

  // Check specific permission
  if (permission) {
    const userPermissions = userInfo.permissions || []
    const rolePermissions = userInfo.role?.permissions || []

    const allPermissions = [
      ...userPermissions.map((p) => p.slug || p),
      ...rolePermissions.map((p) => p.slug || p),
    ]

    // Super Admin (level 1) has all permissions
    const isSuperAdmin = userInfo.role?.level === 1

    if (!isSuperAdmin && !allPermissions.includes(permission)) {
      return fallback || null
    }
  }

  return <>{children}</>
}

export default PermissionGate
