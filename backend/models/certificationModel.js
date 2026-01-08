import mongoose from "mongoose";

const certificationSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      required: true,
      enum: [
        "Organic",
        "Fair Trade",
        "Non-GMO",
        "Vegan",
        "Gluten-Free",
        "Other",
      ],
    },
    description: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      default: "",
    },
    issuingAuthority: {
      type: String,
      required: true,
    },
    validityPeriod: {
      type: Number, // in years
      default: 1,
    },
    isActive: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
certificationSchema.index({ type: 1 });
certificationSchema.index({ isActive: 1 });

const Certification = mongoose.model("Certification", certificationSchema);

export default Certification;
