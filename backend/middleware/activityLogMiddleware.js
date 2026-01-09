import { logActivity, logAdminActivity } from "../utils/activityLogger.js";

/**
 * Middleware to log user activity
 * @param {String} action - Action name (e.g., 'product.created')
 * @param {String} resource - Resource type (e.g., 'Product')
 * @param {Function} getResourceId - Function to extract resource ID from request (optional)
 * @param {Function} getMetadata - Function to extract metadata from request (optional)
 */
export const logActivityMiddleware = (
  action,
  resource,
  getResourceId = null,
  getMetadata = null
) => {
  return async (req, res, next) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to log after response
    res.json = function (data) {
      // Log activity after response is sent
      setImmediate(async () => {
        try {
          if (req.user) {
            const resourceId = getResourceId
              ? getResourceId(req, data)
              : req.params.id || null;
            const metadata = getMetadata ? getMetadata(req, data) : {};

            // Check if user is admin
            if (req.user.role && req.user.role.level <= 2) {
              await logAdminActivity(
                req.user,
                action,
                resource,
                resourceId,
                metadata,
                req
              );
            } else {
              await logActivity(
                req.user,
                action,
                resource,
                resourceId,
                metadata,
                req
              );
            }
          }
        } catch (error) {
          console.error("Error in activity log middleware:", error);
        }
      });

      return originalJson(data);
    };

    next();
  };
};

/**
 * Simple activity logger for specific actions
 */
export const logAction = (action, resource) => {
  return logActivityMiddleware(action, resource);
};
