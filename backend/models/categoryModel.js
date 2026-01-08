import mongoose from "mongoose";

const categorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    parentCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
categorySchema.index({ slug: 1 });
categorySchema.index({ parentCategory: 1 });

const Category = mongoose.model("Category", categorySchema);

export default Category;
