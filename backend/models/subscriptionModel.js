import mongoose from "mongoose";

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },
    frequency: {
      type: String,
      enum: ["weekly", "bi-weekly", "monthly", "quarterly"],
      required: true,
      default: "monthly",
    },
    nextDeliveryDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
    },
    totalDeliveries: {
      type: Number,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
subscriptionSchema.index({ user: 1 });
subscriptionSchema.index({ isActive: 1 });
subscriptionSchema.index({ nextDeliveryDate: 1 });

const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;
