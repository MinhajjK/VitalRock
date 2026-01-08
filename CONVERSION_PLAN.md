# Organic Store Conversion Plan

## Overview

This document outlines the plan to convert the ProShop eCommerce platform into an organic store specializing in products like Shilajit, dry fruits, and other organic health products.

---

## Phase 1: Database Schema Updates

### 1.1 Enhanced Product Model

**New Fields to Add:**

- `productType`: String (Shilajit, Dry Fruits, Herbs, Supplements, etc.)
- `weight`: Number (product weight in grams/kg)
- `unit`: String (g, kg, ml, pieces)
- `origin`: String (Himalayan, Organic Farm, etc.)
- `certifications`: Array of ObjectIds (references to Certification model)
- `ingredients`: Array of Strings
- `nutritionalInfo`: Object (calories, protein, carbs, fats, etc.)
- `healthBenefits`: Array of Strings
- `storageInstructions`: String
- `expiryDate`: Date
- `isOrganic`: Boolean
- `isFairTrade`: Boolean
- `isVegan`: Boolean
- `isGlutenFree`: Boolean
- `images`: Array of Strings (multiple product images)
- `sku`: String (Stock Keeping Unit)
- `barcode`: String
- `shelfLife`: Number (days)
- `countryOfOrigin`: String

**Fields to Modify:**

- `brand`: Change to reference Brand/Supplier model (ObjectId)
- `category`: Change to reference Category model (ObjectId)
- `price`: Keep but add `pricePerUnit` for comparison

### 1.2 New Category Model

**Purpose:** Organize products into organic categories
**Fields:**

- `name`: String (Shilajit, Dry Fruits, Herbs, Supplements, etc.)
- `slug`: String (URL-friendly name)
- `description`: String
- `image`: String
- `parentCategory`: ObjectId (for subcategories)
- `isActive`: Boolean
- `displayOrder`: Number

### 1.3 New Brand/Supplier Model

**Purpose:** Track organic suppliers and brands
**Fields:**

- `name`: String
- `slug`: String
- `description`: String
- `logo`: String
- `website`: String
- `email`: String
- `phone`: String
- `address`: Object (street, city, state, country, zip)
- `certifications`: Array of ObjectIds
- `isVerified`: Boolean
- `rating`: Number
- `totalProducts`: Number

### 1.4 New Certification Model

**Purpose:** Track organic certifications (USDA Organic, EU Organic, etc.)
**Fields:**

- `name`: String (USDA Organic, Fair Trade, etc.)
- `type`: String (Organic, Fair Trade, Non-GMO, etc.)
- `description`: String
- `logo`: String
- `issuingAuthority`: String
- `validityPeriod`: Number (years)
- `isActive`: Boolean

### 1.5 Enhanced User Model

**New Fields:**

- `phone`: String
- `address`: Object (for default shipping)
- `dateOfBirth`: Date
- `preferences`: Object (dietary preferences, allergies)
- `subscriptionStatus`: String (newsletter, product updates)
- `loyaltyPoints`: Number
- `totalOrders`: Number
- `totalSpent`: Number

### 1.6 Enhanced Order Model

**New Fields:**

- `orderType`: String (one-time, subscription)
- `subscriptionId`: ObjectId (if subscription order)
- `giftMessage`: String
- `giftWrap`: Boolean
- `organicCertification`: Boolean (order includes certified organic items)
- `estimatedDeliveryDate`: Date

### 1.7 New Subscription Model (Optional)

**Purpose:** For recurring orders
**Fields:**

- `user`: ObjectId (reference to User)
- `product`: ObjectId (reference to Product)
- `quantity`: Number
- `frequency`: String (weekly, bi-weekly, monthly)
- `nextDeliveryDate`: Date
- `isActive`: Boolean
- `startDate`: Date
- `endDate`: Date

---

## Phase 2: Backend Changes

### 2.1 Controllers Updates

**Product Controller:**

- Add filtering by `productType`, `isOrganic`, `certifications`
- Add search by `origin`, `ingredients`
- Add sorting by `pricePerUnit`, `rating`, `newest`
- Add bulk import for products

**Category Controller:**

- CRUD operations for categories
- Get products by category with filters
- Get category tree (with subcategories)

**Brand Controller:**

- CRUD operations for brands
- Get products by brand
- Brand verification endpoints

**Certification Controller:**

- CRUD operations for certifications
- Get products by certification

### 2.2 Routes Updates

**New Routes:**

- `/api/categories` - Category management
- `/api/brands` - Brand/Supplier management
- `/api/certifications` - Certification management
- `/api/products/organic` - Get all organic products
- `/api/products/by-type/:type` - Get products by type
- `/api/products/by-certification/:certId` - Get products by certification

**Updated Routes:**

- `/api/products` - Add query params for organic filters
- `/api/products/:id` - Include certification and brand details

### 2.3 Middleware Updates

- Add validation for organic product fields
- Add image upload for multiple product images
- Add certification verification middleware

### 2.4 Seeder Updates

- Create seed data for organic products (Shilajit, Dry Fruits)
- Create seed data for categories
- Create seed data for brands/suppliers
- Create seed data for certifications

---

## Phase 3: Frontend Changes

### 3.1 Component Updates

**Product Component:**

- Display organic badges/certifications
- Show origin information
- Display health benefits
- Show multiple product images
- Display nutritional information
- Show storage instructions

**Product Screen (Detail Page):**

- Add tabs: Description, Ingredients, Nutritional Info, Health Benefits, Reviews
- Display certifications prominently
- Show origin story/sourcing information
- Add "Related Products" section
- Add "You May Also Like" section

**Home Screen:**

- Add category carousel/sections
- Feature organic products section
- Add "New Arrivals" section
- Add "Best Sellers" section
- Add "Certified Organic" banner

**Product List Screen:**

- Add filters: Organic, Product Type, Certification, Price Range, Origin
- Add sorting options
- Display certification badges on product cards
- Add quick view modal

### 3.2 New Components

**CategoryCard Component:**

- Display category with image
- Show product count
- Link to category page

**CertificationBadge Component:**

- Display certification logo
- Tooltip with certification details

**ProductFilters Component:**

- Filter by organic status
- Filter by product type
- Filter by certifications
- Filter by price range
- Filter by origin

**NutritionalInfo Component:**

- Display nutritional facts table
- Show per serving information

**OriginStory Component:**

- Display product origin information
- Show sourcing story
- Display supplier information

**HealthBenefits Component:**

- List health benefits
- Display with icons

### 3.3 Screen Updates

**New Screens:**

- `CategoryScreen.js` - Display products by category
- `BrandScreen.js` - Display products by brand
- `CertificationScreen.js` - Display certified products
- `AboutScreen.js` - Origin story page
- `BlogScreen.js` - Health tips and articles (optional)

**Updated Screens:**

- `HomeScreen.js` - Add organic store sections
- `ProductScreen.js` - Enhanced with organic fields
- `ProductListScreen.js` - Add organic filters
- `CartScreen.js` - Show organic certification summary

### 3.4 Styling Updates

- Update color scheme to organic/natural theme (greens, earth tones)
- Add organic certification badges styling
- Update product cards with organic indicators
- Add animations for organic badges
- Update typography for organic feel

---

## Phase 4: Features to Add

### 4.1 Product Features

- **Product Variants:** Different sizes/weights of same product
- **Bulk Pricing:** Discounts for larger quantities
- **Subscription Orders:** Recurring orders for regular customers
- **Gift Options:** Gift wrap and gift messages
- **Product Bundles:** Create bundles of related products

### 4.2 Search & Filter

- Advanced search with multiple criteria
- Filter by dietary restrictions (vegan, gluten-free)
- Filter by certifications
- Filter by origin location
- Price range slider
- Sort by relevance, price, rating, newest

### 4.3 User Features

- **Wishlist:** Save products for later
- **Product Reviews:** Enhanced reviews with photos
- **Loyalty Program:** Points for purchases
- **Subscription Management:** Manage recurring orders
- **Order History:** Enhanced with organic certification info

### 4.4 Admin Features

- **Category Management:** Full CRUD for categories
- **Brand Management:** Manage suppliers/brands
- **Certification Management:** Manage certifications
- **Bulk Product Import:** Import products via CSV
- **Analytics Dashboard:** Organic product sales analytics
- **Inventory Management:** Track expiry dates, low stock alerts

---

## Phase 5: Data Migration

### 5.1 Migration Steps

1. Create new models (Category, Brand, Certification)
2. Migrate existing products to new schema
3. Create default categories (Shilajit, Dry Fruits, etc.)
4. Create default brands/suppliers
5. Create default certifications
6. Update existing product data with organic fields
7. Test data integrity

### 5.2 Seed Data

- **Categories:** Shilajit, Dry Fruits, Herbs, Supplements, Teas, Oils
- **Brands:** Himalayan Organic, Pure Organic, Nature's Best
- **Certifications:** USDA Organic, EU Organic, Fair Trade, Non-GMO
- **Products:** Sample Shilajit products, Dry fruits, etc.

---

## Phase 6: Testing

### 6.1 Backend Testing

- Test all new endpoints
- Test product filtering and search
- Test category/brand/certification CRUD
- Test data validation
- Test image uploads

### 6.2 Frontend Testing

- Test product display with new fields
- Test filtering and sorting
- Test category navigation
- Test certification badges
- Test responsive design

---

## Phase 7: Deployment

### 7.1 Pre-Deployment

- Update environment variables
- Configure image storage (Cloudinary/AWS S3)
- Set up MongoDB indexes for performance
- Configure CORS for production

### 7.2 Deployment Checklist

- [ ] Database migration scripts ready
- [ ] Seed data prepared
- [ ] Environment variables configured
- [ ] Image storage configured
- [ ] SSL certificates installed
- [ ] Domain configured
- [ ] Analytics tracking set up

---

## Timeline Estimate

- **Phase 1 (Database):** 2-3 days
- **Phase 2 (Backend):** 3-4 days
- **Phase 3 (Frontend):** 4-5 days
- **Phase 4 (Features):** 3-4 days
- **Phase 5 (Migration):** 1-2 days
- **Phase 6 (Testing):** 2-3 days
- **Phase 7 (Deployment):** 1 day

**Total Estimated Time:** 16-22 days

---

## Priority Order

1. **High Priority:** Phase 1, Phase 2 (Core), Phase 3 (Core)
2. **Medium Priority:** Phase 2 (Advanced), Phase 3 (Advanced), Phase 4 (Core)
3. **Low Priority:** Phase 4 (Advanced), Phase 5, Phase 6, Phase 7

---

## Notes

- Keep existing authentication and order system
- Maintain backward compatibility where possible
- Use progressive enhancement for new features
- Consider performance optimization for large product catalogs
- Plan for scalability (caching, CDN for images)
