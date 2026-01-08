import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const addressSchema = mongoose.Schema({
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  country: { type: String, default: "" },
  zip: { type: String, default: "" },
});

const preferencesSchema = mongoose.Schema({
  dietaryRestrictions: [{ type: String }], // e.g., ['vegan', 'gluten-free']
  allergies: [{ type: String }],
  favoriteCategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
});

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      default: "",
    },
    address: addressSchema,
    dateOfBirth: {
      type: Date,
    },
    preferences: preferencesSchema,
    subscriptionStatus: {
      newsletter: { type: Boolean, default: false },
      productUpdates: { type: Boolean, default: false },
      promotions: { type: Boolean, default: false },
    },
    loyaltyPoints: {
      type: Number,
      required: true,
      default: 0,
    },
    totalOrders: {
      type: Number,
      required: true,
      default: 0,
    },
    totalSpent: {
      type: Number,
      required: true,
      default: 0,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model("User", userSchema);

export default User;
