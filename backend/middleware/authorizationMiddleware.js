import asyncHandler from "express-async-handler";
import {
  hasAllPermissions,
  hasAnyPermission,
  hasMinimumRoleLevel,
  hasPermission,
} from "../utils/permissionUtils.js";

/**
 * Check if user has a specific permission
 * @param {String} permissionSlug - Permission slug to check
 */
export const checkPermission = (permissionSlug) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const hasAccess = await hasPermission(req.user, permissionSlug);

    if (!hasAccess) {
      res.status(403);
      throw new Error(`Access denied. Required permission: ${permissionSlug}`);
    }

    next();
  });
};

/**
 * Check if user has any of the specified permissions (OR)
 * @param {Array} permissionSlugs - Array of permission slugs
 */
export const checkAnyPermission = (permissionSlugs) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const hasAccess = await hasAnyPermission(req.user, permissionSlugs);

    if (!hasAccess) {
      res.status(403);
      throw new Error("Access denied. Insufficient permissions.");
    }

    next();
  });
};

/**
 * Check if user has all of the specified permissions (AND)
 * @param {Array} permissionSlugs - Array of permission slugs
 */
export const checkPermissions = (permissionSlugs) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const hasAccess = await hasAllPermissions(req.user, permissionSlugs);

    if (!hasAccess) {
      res.status(403);
      throw new Error("Access denied. Insufficient permissions.");
    }

    next();
  });
};

/**
 * Check if user has a specific role
 * @param {String} roleSlug - Role slug to check
 */
export const checkRole = (roleSlug) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    if (!req.user.role || req.user.role.slug !== roleSlug) {
      res.status(403);
      throw new Error(`Access denied. Required role: ${roleSlug}`);
    }

    next();
  });
};

/**
 * Check if user has minimum role level
 * @param {Number} minLevel - Minimum role level required
 */
export const checkRoleLevel = (minLevel) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    const hasAccess = hasMinimumRoleLevel(req.user, minLevel);

    if (!hasAccess) {
      res.status(403);
      throw new Error(
        `Access denied. Minimum role level ${minLevel} required.`
      );
    }

    next();
  });
};

/**
 * Check if user owns the resource or is admin
 * @param {Object} resourceModel - Mongoose model
 * @param {String} paramName - Route parameter name (default: 'id')
 * @param {String} userIdField - Field name in resource that contains user ID (default: 'user')
 */
export const checkResourceOwnership = (
  resourceModel,
  paramName = "id",
  userIdField = "user"
) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      res.status(401);
      throw new Error("Not authenticated");
    }

    // Admins can access all resources
    if (req.user.role && req.user.role.level <= 2) {
      return next();
    }

    const resourceId = req.params[paramName];
    const resource = await resourceModel.findById(resourceId);

    if (!resource) {
      res.status(404);
      throw new Error("Resource not found");
    }

    const resourceUserId =
      resource[userIdField]?.toString() || resource[userIdField];

    if (resourceUserId !== req.user._id.toString()) {
      res.status(403);
      throw new Error("Access denied. You do not own this resource.");
    }

    next();
  });
};
