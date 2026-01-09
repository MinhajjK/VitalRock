import ActivityLog from '../models/activityLogModel.js'

/**
 * Log user activity
 * @param {Object} user - User object
 * @param {String} action - Action performed (e.g., 'product.created', 'order.updated')
 * @param {String} resource - Resource type (e.g., 'Product', 'Order')
 * @param {ObjectId} resourceId - Resource ID
 * @param {Object} metadata - Additional metadata
 * @param {Object} req - Express request object (optional, for IP and user agent)
 */
export const logActivity = async (
  user,
  action,
  resource,
  resourceId = null,
  metadata = {},
  req = null
) => {
  try {
    const logData = {
      user: user._id,
      action,
      resource,
      resourceId,
      description: metadata.description || '',
      metadata: {
        ...metadata,
        userName: user.name,
        userEmail: user.email,
      },
    }

    // Add IP and user agent if request is provided
    if (req) {
      logData.ipAddress = req.ip || req.connection.remoteAddress
      logData.userAgent = req.get('user-agent') || ''
    }

    await ActivityLog.create(logData)
  } catch (error) {
    console.error('Error logging activity:', error)
    // Don't throw error - logging should not break the main flow
  }
}

/**
 * Log admin activity (same as logActivity but with admin context)
 */
export const logAdminActivity = async (
  user,
  action,
  resource,
  resourceId = null,
  metadata = {},
  req = null
) => {
  const adminMetadata = {
    ...metadata,
    isAdminAction: true,
    adminRole: user.role?.name || 'Unknown',
  }

  return logActivity(user, action, resource, resourceId, adminMetadata, req)
}

/**
 * Get activity logs with filters
 * @param {Object} filters - Filter options
 * @param {Number} limit - Number of logs to return
 * @param {Number} skip - Number of logs to skip
 * @returns {Array} Array of activity logs
 */
export const getActivityLogs = async (filters = {}, limit = 50, skip = 0) => {
  try {
    const query = {}

    if (filters.user) {
      query.user = filters.user
    }

    if (filters.action) {
      query.action = filters.action
    }

    if (filters.resource) {
      query.resource = filters.resource
    }

    if (filters.resourceId) {
      query.resourceId = filters.resourceId
    }

    if (filters.startDate || filters.endDate) {
      query.createdAt = {}
      if (filters.startDate) {
        query.createdAt.$gte = new Date(filters.startDate)
      }
      if (filters.endDate) {
        query.createdAt.$lte = new Date(filters.endDate)
      }
    }

    const logs = await ActivityLog.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)

    return logs
  } catch (error) {
    console.error('Error getting activity logs:', error)
    throw error
  }
}

/**
 * Format activity log for display
 * @param {Object} log - Activity log object
 * @returns {String} Formatted log message
 */
export const formatActivityLog = (log) => {
  const user = log.user?.name || 'Unknown User'
  const action = log.action.replace('.', ' ')
  const resource = log.resource

  return `${user} ${action} ${resource}${log.resourceId ? ` (${log.resourceId})` : ''}`
}
