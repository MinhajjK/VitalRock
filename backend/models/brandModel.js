import mongoose from "mongoose";

const brandSchema = mongoose.Schema(
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
    logo: {
      type: String,
      default: "",
    },
    website: {
      type: String,
      default: "",
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      street: { type: String, default: "" },
      city: { type: String, default: "" },
      state: { type: String, default: "" },
      country: { type: String, default: "" },
      zip: { type: String, default: "" },
    },
    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certification",
      },
    ],
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    totalProducts: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
brandSchema.index({ slug: 1 });
brandSchema.index({ isVerified: 1 });

const Brand = mongoose.model("Brand", brandSchema);

export default Brand;
