import mongoose from "mongoose";

const permissionSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "authentication",
        "store",
        "products",
        "inventory",
        "orders",
        "users",
        "reviews",
        "content",
        "promotions",
        "analytics",
        "settings",
      ],
    },
    description: {
      type: String,
      default: "",
    },
    resource: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
      enum: ["create", "read", "update", "delete", "manage"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
permissionSchema.index({ slug: 1 });
permissionSchema.index({ category: 1 });
permissionSchema.index({ resource: 1, action: 1 });
permissionSchema.index({ isActive: 1 });

const Permission = mongoose.model("Permission", permissionSchema);

export default Permission;
