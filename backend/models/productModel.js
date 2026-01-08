import mongoose from "mongoose";

const reviewSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    rating: { type: Number, required: true },
    comment: { type: String, required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const nutritionalInfoSchema = mongoose.Schema({
  calories: { type: Number, default: 0 },
  protein: { type: Number, default: 0 }, // in grams
  carbohydrates: { type: Number, default: 0 }, // in grams
  fats: { type: Number, default: 0 }, // in grams
  fiber: { type: Number, default: 0 }, // in grams
  sugar: { type: Number, default: 0 }, // in grams
  sodium: { type: Number, default: 0 }, // in mg
  servingSize: { type: String, default: "" }, // e.g., "100g", "1 piece"
});

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    // Multiple images support
    image: {
      type: String,
      required: true,
    },
    images: [
      {
        type: String,
      },
    ],
    // Brand as reference to Brand model (keeping old brand field for backward compatibility)
    brand: {
      type: String,
      required: true,
    },
    brandRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    // Category as reference to Category model (keeping old category field for backward compatibility)
    category: {
      type: String,
      required: true,
    },
    categoryRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    description: {
      type: String,
      required: true,
    },
    // Organic store specific fields
    productType: {
      type: String,
      enum: [
        "Shilajit",
        "Dry Fruits",
        "Herbs",
        "Supplements",
        "Teas",
        "Oils",
        "Other",
      ],
      default: "Other",
    },
    weight: {
      type: Number,
      default: 0,
    },
    unit: {
      type: String,
      enum: ["g", "kg", "ml", "l", "pieces", "oz", "lb"],
      default: "g",
    },
    origin: {
      type: String,
      default: "",
    },
    countryOfOrigin: {
      type: String,
      default: "",
    },
    certifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Certification",
      },
    ],
    ingredients: [
      {
        type: String,
      },
    ],
    nutritionalInfo: nutritionalInfoSchema,
    healthBenefits: [
      {
        type: String,
      },
    ],
    storageInstructions: {
      type: String,
      default: "",
    },
    expiryDate: {
      type: Date,
    },
    shelfLife: {
      type: Number, // in days
      default: 365,
    },
    isOrganic: {
      type: Boolean,
      default: false,
    },
    isFairTrade: {
      type: Boolean,
      default: false,
    },
    isVegan: {
      type: Boolean,
      default: false,
    },
    isGlutenFree: {
      type: Boolean,
      default: false,
    },
    sku: {
      type: String,
      unique: true,
      sparse: true,
    },
    barcode: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Existing fields
    reviews: [reviewSchema],
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerUnit: {
      type: Number, // price per unit (e.g., per 100g)
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    // Additional fields for organic store
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isNewArrival: {
      type: Boolean,
      default: false,
    },
    tags: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
productSchema.index({ productType: 1 });
productSchema.index({ isOrganic: 1 });
productSchema.index({ categoryRef: 1 });
productSchema.index({ brandRef: 1 });
productSchema.index({ sku: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isNewArrival: 1 });
productSchema.index({ certifications: 1 });

const Product = mongoose.model("Product", productSchema);

export default Product;
