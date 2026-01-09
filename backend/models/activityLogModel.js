import mongoose from 'mongoose'

const activityLogSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
    resource: {
      type: String,
      required: true,
    },
    resourceId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    description: {
      type: String,
      default: '',
    },
    ipAddress: {
      type: String,
    },
    userAgent: {
      type: String,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
)

// Indexes for efficient querying
activityLogSchema.index({ user: 1, createdAt: -1 })
activityLogSchema.index({ action: 1, createdAt: -1 })
activityLogSchema.index({ resource: 1, resourceId: 1 })
activityLogSchema.index({ createdAt: -1 })

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema)

export default ActivityLog
