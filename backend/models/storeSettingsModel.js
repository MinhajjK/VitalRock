import mongoose from 'mongoose'

const addressSchema = mongoose.Schema({
  street: { type: String, default: '' },
  city: { type: String, default: '' },
  state: { type: String, default: '' },
  country: { type: String, default: '' },
  zip: { type: String, default: '' },
})

const shippingZoneSchema = mongoose.Schema({
  name: { type: String, required: true },
  countries: [{ type: String }],
  states: [{ type: String }],
  cities: [{ type: String }],
  shippingRate: { type: Number, required: true },
  freeShippingThreshold: { type: Number },
  estimatedDays: { type: Number },
  isActive: { type: Boolean, default: true },
})

const bannerSchema = mongoose.Schema({
  title: { type: String, required: true },
  image: { type: String, required: true },
  link: { type: String },
  position: { type: String, enum: ['top', 'middle', 'bottom'], default: 'top' },
  isActive: { type: Boolean, default: true },
  displayOrder: { type: Number, default: 0 },
  startDate: { type: Date },
  endDate: { type: Date },
})

const homepageSectionSchema = mongoose.Schema({
  title: { type: String, required: true },
  type: {
    type: String,
    enum: ['featured', 'categories', 'new-arrivals', 'organic', 'custom'],
    required: true,
  },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  config: { type: mongoose.Schema.Types.Mixed, default: {} },
})

const storeSettingsSchema = mongoose.Schema(
  {
    // Store Profile
    storeName: {
      type: String,
      required: true,
      default: 'VitalRock Organic Store',
    },
    storeLogo: { type: String, default: '' },
    storeDescription: { type: String, default: '' },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, default: '' },
    address: addressSchema,

    // Certifications
    organicCertifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Certification',
      },
    ],

    // Configuration
    currency: { type: String, default: 'USD' },
    taxRate: { type: Number, default: 0 },
    shippingZones: [shippingZoneSchema],

    // Payment Methods
    paymentMethods: {
      cod: {
        enabled: { type: Boolean, default: true },
        label: { type: String, default: 'Cash on Delivery' },
      },
      stripe: {
        enabled: { type: Boolean, default: false },
        apiKey: { type: String, default: '' },
        publishableKey: { type: String, default: '' },
      },
      paypal: {
        enabled: { type: Boolean, default: false },
        clientId: { type: String, default: '' },
        clientSecret: { type: String, default: '' },
      },
    },

    // Homepage
    banners: [bannerSchema],
    featuredProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    homepageSections: [homepageSectionSchema],

    // Settings
    allowRegistration: { type: Boolean, default: true },
    requireEmailVerification: { type: Boolean, default: false },
    minOrderAmount: { type: Number, default: 0 },
    freeShippingThreshold: { type: Number },
    lowStockThreshold: { type: Number, default: 10 },
    expiryAlertDays: { type: Number, default: 30 },
  },
  {
    timestamps: true,
  }
)

// Ensure only one store settings document exists
storeSettingsSchema.statics.getStoreSettings = async function () {
  let settings = await this.findOne()
  if (!settings) {
    settings = await this.create({
      storeName: 'VitalRock Organic Store',
      contactEmail: 'contact@vitalrock.com',
    })
  }
  return settings
}

const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema)

export default StoreSettings
