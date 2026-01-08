# Database Schema for Organic Store

## Overview

This document describes all database models and their relationships for the organic store application.

---

## Models

### 1. User Model (`userModel.js`)

**Purpose:** Store user account information with organic store specific features

**Fields:**

- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed)
- `phone` (String)
- `address` (Object: street, city, state, country, zip)
- `dateOfBirth` (Date)
- `preferences` (Object: dietaryRestrictions, allergies, favoriteCategories)
- `subscriptionStatus` (Object: newsletter, productUpdates, promotions)
- `loyaltyPoints` (Number, default: 0)
- `totalOrders` (Number, default: 0)
- `totalSpent` (Number, default: 0)
- `isAdmin` (Boolean, default: false)
- `timestamps` (createdAt, updatedAt)

**Relationships:**

- Has many Orders
- Has many Subscriptions
- Has many Product Reviews

---

### 2. Product Model (`productModel.js`)

**Purpose:** Store product information with extensive organic product details

**Fields:**

- `user` (ObjectId, ref: User) - Admin who created the product
- `name` (String, required)
- `image` (String, required) - Main product image
- `images` (Array of Strings) - Additional product images
- `brand` (String, required) - Legacy field for backward compatibility
- `brandRef` (ObjectId, ref: Brand) - Reference to Brand model
- `category` (String, required) - Legacy field for backward compatibility
- `categoryRef` (ObjectId, ref: Category) - Reference to Category model
- `description` (String, required)
- `productType` (Enum: Shilajit, Dry Fruits, Herbs, Supplements, Teas, Oils, Other)
- `weight` (Number) - Product weight
- `unit` (Enum: g, kg, ml, l, pieces, oz, lb)
- `origin` (String) - Origin location (e.g., "Himalayan")
- `countryOfOrigin` (String)
- `certifications` (Array of ObjectIds, ref: Certification)
- `ingredients` (Array of Strings)
- `nutritionalInfo` (Object: calories, protein, carbs, fats, fiber, sugar, sodium, servingSize)
- `healthBenefits` (Array of Strings)
- `storageInstructions` (String)
- `expiryDate` (Date)
- `shelfLife` (Number) - Days
- `isOrganic` (Boolean)
- `isFairTrade` (Boolean)
- `isVegan` (Boolean)
- `isGlutenFree` (Boolean)
- `sku` (String, unique)
- `barcode` (String, unique)
- `reviews` (Array of reviewSchema)
- `rating` (Number, default: 0)
- `numReviews` (Number, default: 0)
- `price` (Number, required)
- `pricePerUnit` (Number) - Price per unit for comparison
- `countInStock` (Number, required)
- `isFeatured` (Boolean)
- `isNewArrival` (Boolean)
- `tags` (Array of Strings)
- `timestamps` (createdAt, updatedAt)

**Relationships:**

- Belongs to User (creator)
- Belongs to Brand (via brandRef)
- Belongs to Category (via categoryRef)
- Has many Certifications
- Has many Reviews
- Has many OrderItems

**Indexes:**

- productType
- isOrganic
- categoryRef
- brandRef
- sku
- isFeatured
- isNewArrival
- certifications

---

### 3. Category Model (`categoryModel.js`)

**Purpose:** Organize products into hierarchical categories

**Fields:**

- `name` (String, required, unique)
- `slug` (String, required, unique, lowercase)
- `description` (String, required)
- `image` (String)
- `parentCategory` (ObjectId, ref: Category) - For subcategories
- `isActive` (Boolean, default: true)
- `displayOrder` (Number, default: 0)
- `timestamps` (createdAt, updatedAt)

**Relationships:**

- Has many Products (via categoryRef)
- Can have parent Category (for subcategories)
- Can have many child Categories

**Indexes:**

- slug
- parentCategory

**Example Categories:**

- Shilajit
- Dry Fruits
- Herbs
- Supplements
- Teas
- Oils

---

### 4. Brand Model (`brandModel.js`)

**Purpose:** Store brand/supplier information

**Fields:**

- `name` (String, required, unique)
- `slug` (String, required, unique, lowercase)
- `description` (String, required)
- `logo` (String)
- `website` (String)
- `email` (String)
- `phone` (String)
- `address` (Object: street, city, state, country, zip)
- `certifications` (Array of ObjectIds, ref: Certification)
- `isVerified` (Boolean, default: false)
- `rating` (Number, default: 0)
- `totalProducts` (Number, default: 0)
- `timestamps` (createdAt, updatedAt)

**Relationships:**

- Has many Products (via brandRef)
- Has many Certifications

**Indexes:**

- slug
- isVerified

---

### 5. Certification Model (`certificationModel.js`)

**Purpose:** Store organic and other certifications

**Fields:**

- `name` (String, required, unique) - e.g., "USDA Organic"
- `type` (Enum: Organic, Fair Trade, Non-GMO, Vegan, Gluten-Free, Other)
- `description` (String, required)
- `logo` (String)
- `issuingAuthority` (String, required)
- `validityPeriod` (Number) - Years
- `isActive` (Boolean, default: true)
- `timestamps` (createdAt, updatedAt)

**Relationships:**

- Belongs to many Products
- Belongs to many Brands

**Indexes:**

- type
- isActive

**Example Certifications:**

- USDA Organic
- EU Organic
- Fair Trade
- Non-GMO Project Verified
- Certified Vegan
- Gluten-Free Certification

---

### 6. Order Model (`orderModel.js`)

**Purpose:** Store order information with organic store enhancements

**Fields:**

- `user` (ObjectId, ref: User, required)
- `orderItems` (Array of Objects):
  - `name` (String, required)
  - `qty` (Number, required)
  - `image` (String, required)
  - `price` (Number, required)
  - `product` (ObjectId, ref: Product, required)
  - `isOrganic` (Boolean)
  - `certifications` (Array of ObjectIds, ref: Certification)
- `shippingAddress` (Object: address, city, postalCode, country)
- `paymentMethod` (String, required)
- `paymentResult` (Object: id, status, update_time, email_address)
- `taxPrice` (Number, default: 0)
- `shippingPrice` (Number, default: 0)
- `totalPrice` (Number, required)
- `orderType` (Enum: one-time, subscription, default: one-time)
- `subscriptionId` (ObjectId, ref: Subscription)
- `giftMessage` (String)
- `giftWrap` (Boolean)
- `organicCertification` (Boolean) - True if order contains certified organic items
- `estimatedDeliveryDate` (Date)
- `isPaid` (Boolean, default: false)
- `paidAt` (Date)
- `isDelivered` (Boolean, default: false)
- `deliveredAt` (Date)
- `timestamps` (createdAt, updatedAt)

**Relationships:**

- Belongs to User
- Has many OrderItems (embedded)
- Can belong to Subscription

---

### 7. Subscription Model (`subscriptionModel.js`)

**Purpose:** Store recurring order subscriptions

**Fields:**

- `user` (ObjectId, ref: User, required)
- `product` (ObjectId, ref: Product, required)
- `quantity` (Number, default: 1)
- `frequency` (Enum: weekly, bi-weekly, monthly, quarterly, default: monthly)
- `nextDeliveryDate` (Date, required)
- `isActive` (Boolean, default: true)
- `startDate` (Date, default: now)
- `endDate` (Date)
- `totalDeliveries` (Number, default: 0)
- `completedDeliveries` (Number, default: 0)
- `timestamps` (createdAt, updatedAt)

**Relationships:**

- Belongs to User
- Belongs to Product
- Has many Orders (via subscriptionId)

**Indexes:**

- user
- isActive
- nextDeliveryDate

---

## Entity Relationship Diagram (ERD)

```
User
  ├── has many Orders
  ├── has many Subscriptions
  └── has many Reviews (embedded in Product)

Product
  ├── belongs to User (creator)
  ├── belongs to Brand (via brandRef)
  ├── belongs to Category (via categoryRef)
  ├── has many Certifications
  ├── has many Reviews (embedded)
  └── has many OrderItems (embedded in Order)

Category
  ├── has many Products
  ├── can have parent Category
  └── can have many child Categories

Brand
  ├── has many Products
  └── has many Certifications

Certification
  ├── belongs to many Products
  └── belongs to many Brands

Order
  ├── belongs to User
  ├── has many OrderItems (embedded)
  └── can belong to Subscription

Subscription
  ├── belongs to User
  ├── belongs to Product
  └── has many Orders
```

---

## Migration Notes

### Backward Compatibility

- Product model maintains `brand` and `category` as String fields for backward compatibility
- New `brandRef` and `categoryRef` fields reference the new Brand and Category models
- Existing products will continue to work with String-based brand/category
- Migration script can be created to populate `brandRef` and `categoryRef` from existing data

### Data Migration Steps

1. Create Brand records from existing product brands
2. Create Category records from existing product categories
3. Update products to reference Brand and Category models
4. Create Certification records
5. Link products to certifications based on product data
6. Update existing orders with organic certification flags

---

## Sample Data Structure

### Example Product (Shilajit Paste)

```json
{
  "name": "Premium Himalayan Shilajit Resin",
  "productType": "Shilajit",
  "weight": 50,
  "unit": "g",
  "origin": "Himalayan Mountains",
  "countryOfOrigin": "Nepal",
  "isOrganic": true,
  "isVegan": true,
  "certifications": ["certification_id_1", "certification_id_2"],
  "ingredients": ["Pure Shilajit Resin"],
  "healthBenefits": [
    "Boosts energy and stamina",
    "Supports immune system",
    "Enhances cognitive function"
  ],
  "storageInstructions": "Store in a cool, dry place away from direct sunlight",
  "shelfLife": 730,
  "price": 45.0,
  "pricePerUnit": 0.9
}
```

### Example Product (Dry Fruits)

```json
{
  "name": "Luxury Mixed Dry Fruits Jar",
  "productType": "Dry Fruits",
  "weight": 500,
  "unit": "g",
  "origin": "Organic Farm",
  "countryOfOrigin": "USA",
  "isOrganic": true,
  "isFairTrade": true,
  "isVegan": true,
  "isGlutenFree": true,
  "ingredients": ["Almonds", "Cashews", "Pistachios", "Dried Cranberries"],
  "nutritionalInfo": {
    "calories": 600,
    "protein": 20,
    "carbohydrates": 30,
    "fats": 45,
    "fiber": 10,
    "servingSize": "100g"
  },
  "price": 35.0,
  "pricePerUnit": 7.0
}
```

---

## Indexes Summary

### Product Indexes

- `productType` - For filtering by product type
- `isOrganic` - For organic product queries
- `categoryRef` - For category-based queries
- `brandRef` - For brand-based queries
- `sku` - For product lookup
- `isFeatured` - For featured products
- `isNewArrival` - For new arrivals
- `certifications` - For certification filtering

### Category Indexes

- `slug` - For URL-based queries
- `parentCategory` - For hierarchical queries

### Brand Indexes

- `slug` - For URL-based queries
- `isVerified` - For verified brand queries

### Certification Indexes

- `type` - For certification type filtering
- `isActive` - For active certification queries

### Subscription Indexes

- `user` - For user subscription queries
- `isActive` - For active subscription queries
- `nextDeliveryDate` - For delivery scheduling

---

## Query Examples

### Get all organic products

```javascript
Product.find({ isOrganic: true });
```

### Get products by category

```javascript
Product.find({ categoryRef: categoryId });
```

### Get products with specific certification

```javascript
Product.find({ certifications: certificationId });
```

### Get featured organic products

```javascript
Product.find({ isFeatured: true, isOrganic: true });
```

### Get products by type (Shilajit)

```javascript
Product.find({ productType: "Shilajit" });
```

### Get active subscriptions for user

```javascript
Subscription.find({ user: userId, isActive: true });
```
