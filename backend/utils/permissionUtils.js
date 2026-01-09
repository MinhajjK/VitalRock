/**
 * Check if user has a specific permission
 * @param {Object} user - User object with populated role and permissions
 * @param {String} permissionSlug - Permission slug to check
 * @returns {Boolean}
 */
export const hasPermission = async (user, permissionSlug) => {
  if (!user || !user.isActive) {
    return false;
  }

  // Super Admin (level 1) has all permissions
  if (user.role && user.role.level === 1) {
    return true;
  }

  // Check direct permissions first (override role permissions)
  if (user.permissions && user.permissions.length > 0) {
    const directPermission = user.permissions.find(
      (p) => p.slug === permissionSlug && p.isActive
    );
    if (directPermission) {
      return true;
    }
  }

  // Check role permissions
  if (user.role && user.role.permissions) {
    const rolePermission = user.role.permissions.find(
      (p) => p.slug === permissionSlug && p.isActive
    );
    if (rolePermission) {
      return true;
    }
  }

  return false;
};

/**
 * Check if user has any of the specified permissions (OR)
 * @param {Object} user - User object
 * @param {Array} permissionSlugs - Array of permission slugs
 * @returns {Boolean}
 */
export const hasAnyPermission = async (user, permissionSlugs) => {
  if (!permissionSlugs || permissionSlugs.length === 0) {
    return true;
  }

  for (const slug of permissionSlugs) {
    if (await hasPermission(user, slug)) {
      return true;
    }
  }

  return false;
};

/**
 * Check if user has all of the specified permissions (AND)
 * @param {Object} user - User object
 * @param {Array} permissionSlugs - Array of permission slugs
 * @returns {Boolean}
 */
export const hasAllPermissions = async (user, permissionSlugs) => {
  if (!permissionSlugs || permissionSlugs.length === 0) {
    return true;
  }

  for (const slug of permissionSlugs) {
    if (!(await hasPermission(user, slug))) {
      return false;
    }
  }

  return true;
};

/**
 * Get all permissions for a user (role + direct)
 * @param {Object} user - User object with populated role and permissions
 * @returns {Array} Array of permission objects
 */
export const getUserPermissions = (user) => {
  if (!user || !user.isActive) {
    return [];
  }

  const permissions = new Map();

  // Add role permissions
  if (user.role && user.role.permissions) {
    user.role.permissions.forEach((perm) => {
      if (perm.isActive) {
        permissions.set(perm.slug, perm);
      }
    });
  }

  // Add direct permissions (override role permissions)
  if (user.permissions && user.permissions.length > 0) {
    user.permissions.forEach((perm) => {
      if (perm.isActive) {
        permissions.set(perm.slug, perm);
      }
    });
  }

  return Array.from(permissions.values());
};

/**
 * Check if user owns a resource
 * @param {Object} user - User object
 * @param {Object} resource - Resource object
 * @param {String} userIdField - Field name that contains user ID (default: 'user')
 * @returns {Boolean}
 */
export const checkResourceOwnership = (
  user,
  resource,
  userIdField = "user"
) => {
  if (!user || !resource) {
    return false;
  }

  // Admins can access all resources
  if (user.role && user.role.level <= 2) {
    return true;
  }

  // Check ownership
  const resourceUserId =
    resource[userIdField]?.toString() || resource[userIdField];
  return resourceUserId === user._id.toString();
};

/**
 * Check if user has minimum role level
 * @param {Object} user - User object
 * @param {Number} minLevel - Minimum role level required
 * @returns {Boolean}
 */
export const hasMinimumRoleLevel = (user, minLevel) => {
  if (!user || !user.role) {
    return false;
  }

  return user.role.level <= minLevel;
};
