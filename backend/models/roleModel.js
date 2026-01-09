import mongoose from "mongoose";

const roleSchema = mongoose.Schema(
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
    description: {
      type: String,
      default: "",
    },
    level: {
      type: Number,
      required: true,
      min: 1,
      max: 10,
    },
    permissions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Permission",
      },
    ],
    isSystemRole: {
      type: Boolean,
      default: false,
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
roleSchema.index({ slug: 1 });
roleSchema.index({ level: 1 });
roleSchema.index({ isActive: 1 });

const Role = mongoose.model("Role", roleSchema);

export default Role;
