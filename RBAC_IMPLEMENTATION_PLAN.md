# Role-Based Access Control (RBAC) Implementation Plan

## VitalRock Organic Store E-Commerce Platform

---

## 📋 Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [System Architecture](#system-architecture)
4. [Database Schema Design](#database-schema-design)
5. [Backend Implementation](#backend-implementation)
6. [Frontend Implementation](#frontend-implementation)
7. [Security & Authentication](#security--authentication)
8. [Implementation Phases](#implementation-phases)
9. [Testing Strategy](#testing-strategy)
10. [Migration Plan](#migration-plan)

---

## 1. Executive Summary

### 1.1 Objective

Implement a comprehensive Role-Based Access Control (RBAC) system that differentiates between **Admin** (Super Admin/Store Manager) and **User** (Customer) roles with granular permissions and feature access.

### 1.2 Scope

- **Admin Role**: Full store management capabilities including inventory, orders, users, analytics, and content management
- **User Role**: Customer-facing features including browsing, purchasing, order tracking, and account management
- **Sub-Admin Support**: Framework for future sub-admin roles with limited permissions

### 1.3 Key Features

- Role-based authentication and authorization
- Permission-based route protection
- Admin dashboard with comprehensive management tools
- User dashboard with personalized features
- Activity logging and audit trails
- Multi-factor authentication support (2FA)
- Social login integration

---

## 2. Current State Analysis

### 2.1 Existing Implementation

- **User Model**: Basic `isAdmin` boolean flag
- **Authentication**: JWT-based with `protect` and `admin` middleware
- **Routes**: Basic admin/user route separation
- **Frontend**: Basic user authentication, no role-based UI differentiation

### 2.2 Limitations

- Binary admin/user distinction (no granular permissions)
- No permission management system
- No activity logging
- No sub-admin support
- Limited admin dashboard features
- No role-based UI components

### 2.3 Required Enhancements

- Enhanced user model with roles and permissions
- Permission-based middleware system
- Comprehensive admin dashboard
- User dashboard with personalization
- Activity logging system
- Enhanced security features (2FA, password policies)

---

## 3. System Architecture

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
├─────────────────────────────────────────────────────────────┤
│  Admin Dashboard  │  User Dashboard  │  Shared Components   │
│  - Store Mgmt     │  - Profile       │  - Header            │
│  - Products       │  - Orders        │  - Footer            │
│  - Orders         │  - Wishlist      │  - Product Cards     │
│  - Users          │  - Reviews       │  - Cart              │
│  - Analytics      │  - Addresses    │                      │
│  - Settings       │  - Preferences   │                      │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                     │
├─────────────────────────────────────────────────────────────┤
│  Middleware Layer                                            │
│  - Authentication (JWT)                                     │
│  - Authorization (Role & Permission)                        │
│  - Activity Logging                                          │
│  - Rate Limiting                                            │
├─────────────────────────────────────────────────────────────┤
│  Controller Layer                                            │
│  - Admin Controllers                                         │
│  - User Controllers                                         │
│  - Shared Controllers                                       │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    Database (MongoDB)                        │
├─────────────────────────────────────────────────────────────┤
│  - Users (with roles & permissions)                         │
│  - Roles                                                     │
│  - Permissions                                              │
│  - Activity Logs                                            │
│  - Store Settings                                           │
│  - Products, Orders, etc.                                   │
└─────────────────────────────────────────────────────────────┘
```

### 3.2 Role Hierarchy

```
Super Admin (Level 1)
  ├── Full system access
  ├── Can create/manage Store Managers
  └── System configuration

Store Manager (Level 2)
  ├── Store operations
  ├── Product management
  ├── Order management
  ├── User management (limited)
  └── Analytics access

Customer (Level 3)
  ├── Browse products
  ├── Place orders
  ├── Manage profile
  └── View own orders
```

---

## 4. Database Schema Design

### 4.1 Enhanced User Model

```javascript
User Schema {
  // Basic Info
  name: String (required)
  email: String (required, unique)
  password: String (required, hashed)
  phone: String

  // Role & Permissions
  role: ObjectId (ref: Role, required)
  permissions: [ObjectId] (ref: Permission) // Direct permissions override
  isActive: Boolean (default: true)
  isEmailVerified: Boolean (default: false)
  emailVerificationToken: String
  emailVerificationExpires: Date

  // Security
  twoFactorEnabled: Boolean (default: false)
  twoFactorSecret: String
  passwordResetToken: String
  passwordResetExpires: Date
  loginAttempts: Number (default: 0)
  lockUntil: Date
  lastLogin: Date
  lastLoginIP: String

  // Profile
  avatar: String
  address: AddressSchema
  dateOfBirth: Date
  preferences: PreferencesSchema

  // Subscription & Loyalty
  subscriptionStatus: SubscriptionStatusSchema
  loyaltyPoints: Number (default: 0)
  totalOrders: Number (default: 0)
  totalSpent: Number (default: 0)

  // Metadata
  createdBy: ObjectId (ref: User) // Admin who created this user
  timestamps: createdAt, updatedAt
}
```

### 4.2 New Role Model

```javascript
Role Schema {
  name: String (required, unique) // e.g., "Super Admin", "Store Manager", "Customer"
  slug: String (required, unique, lowercase)
  description: String
  level: Number (required) // 1 = Super Admin, 2 = Store Manager, 3 = Customer
  permissions: [ObjectId] (ref: Permission, required)
  isSystemRole: Boolean (default: false) // Cannot be deleted
  isActive: Boolean (default: true)
  timestamps: createdAt, updatedAt
}

Default Roles:
- Super Admin (level: 1, all permissions)
- Store Manager (level: 2, store management permissions)
- Customer (level: 3, basic user permissions)
```

### 4.3 New Permission Model

```javascript
Permission Schema {
  name: String (required, unique) // e.g., "products.create", "orders.view"
  slug: String (required, unique, lowercase)
  category: String (required) // e.g., "products", "orders", "users", "analytics"
  description: String
  resource: String // e.g., "product", "order", "user"
  action: String // e.g., "create", "read", "update", "delete"
  isActive: Boolean (default: true)
  timestamps: createdAt, updatedAt
}

Permission Categories:
- authentication: Login, logout, password reset, 2FA
- store: Store profile, settings, banners, payment methods
- products: CRUD operations, bulk upload, inventory
- inventory: Stock tracking, alerts, suppliers, batch tracking
- orders: View, update status, assign delivery, refunds
- users: View, block/unblock, manage, create sub-admins
- reviews: Moderate, approve/reject
- content: Blog posts, FAQ management
- promotions: Coupons, sales, loyalty programs, campaigns
- analytics: Reports, exports, dashboards
- settings: System configuration, role management
```

### 4.4 New Activity Log Model

```javascript
ActivityLog Schema {
  user: ObjectId (ref: User, required)
  action: String (required) // e.g., "product.created", "order.updated"
  resource: String (required) // e.g., "Product", "Order"
  resourceId: ObjectId
  description: String
  ipAddress: String
  userAgent: String
  metadata: Object // Additional context data
  timestamps: createdAt
}

Indexes:
- user, action, resource, createdAt
```

### 4.5 New Store Settings Model

```javascript
StoreSettings Schema {
  // Store Profile
  storeName: String (required)
  storeLogo: String
  storeDescription: String
  contactEmail: String (required)
  contactPhone: String
  address: AddressSchema

  // Certifications
  organicCertifications: [ObjectId] (ref: Certification)

  // Configuration
  currency: String (default: "USD")
  taxRate: Number (default: 0)
  shippingZones: [ShippingZoneSchema]

  // Payment Methods
  paymentMethods: {
    cod: { enabled: Boolean, default: true },
    stripe: { enabled: Boolean, apiKey: String },
    paypal: { enabled: Boolean, clientId: String }
  }

  // Homepage
  banners: [BannerSchema]
  featuredProducts: [ObjectId] (ref: Product)
  homepageSections: [HomepageSectionSchema]

  // Settings
  allowRegistration: Boolean (default: true)
  requireEmailVerification: Boolean (default: false)
  minOrderAmount: Number (default: 0)
  freeShippingThreshold: Number

  timestamps: createdAt, updatedAt
}
```

### 4.6 New Wishlist Model

```javascript
Wishlist Schema {
  user: ObjectId (ref: User, required, unique)
  items: [{
    product: ObjectId (ref: Product, required),
    addedAt: Date (default: now)
  }]
  timestamps: createdAt, updatedAt
}
```

### 4.7 New Support Ticket Model

```javascript
SupportTicket Schema {
  user: ObjectId (ref: User, required)
  order: ObjectId (ref: Order) // Optional, if related to order
  subject: String (required)
  message: String (required)
  category: String (required) // complaint, inquiry, refund, other
  status: String (default: "open") // open, in-progress, resolved, closed
  priority: String (default: "medium") // low, medium, high, urgent
  assignedTo: ObjectId (ref: User) // Admin assigned
  responses: [{
    user: ObjectId (ref: User),
    message: String,
    isInternal: Boolean (default: false), // Admin-only notes
    timestamps: createdAt
  }]
  timestamps: createdAt, updatedAt
}
```

### 4.8 Enhanced Order Model

```javascript
// Add to existing Order Schema:
- assignedDeliveryPartner: ObjectId (ref: User)
- cancellationReason: String
- cancellationRequestedAt: Date
- cancellationApprovedAt: Date
- returnRequestedAt: Date
- returnApprovedAt: Date
- returnReason: String
- refundStatus: String // none, pending, processed, failed
- refundAmount: Number
- refundProcessedAt: Date
- invoiceNumber: String (unique)
- packingSlipNumber: String (unique)
```

### 4.9 New Coupon Model

```javascript
Coupon Schema {
  code: String (required, unique, uppercase)
  name: String (required)
  description: String
  discountType: String (required) // percentage, fixed
  discountValue: Number (required)
  minPurchaseAmount: Number
  maxDiscountAmount: Number
  validFrom: Date (required)
  validUntil: Date (required)
  usageLimit: Number // Total usage limit
  usageCount: Number (default: 0)
  userUsageLimit: Number (default: 1) // Per user limit
  applicableProducts: [ObjectId] (ref: Product) // Empty = all products
  applicableCategories: [ObjectId] (ref: Category)
  isActive: Boolean (default: true)
  createdBy: ObjectId (ref: User)
  timestamps: createdAt, updatedAt
}
```

### 4.10 New Campaign Model

```javascript
Campaign Schema {
  name: String (required)
  type: String (required) // email, sms, push
  subject: String // For email
  content: String (required)
  targetAudience: String // all, specific, segment
  targetUsers: [ObjectId] (ref: User)
  scheduledAt: Date
  sentAt: Date
  status: String (default: "draft") // draft, scheduled, sent, cancelled
  sentCount: Number (default: 0)
  openedCount: Number (default: 0)
  clickedCount: Number (default: 0)
  createdBy: ObjectId (ref: User)
  timestamps: createdAt, updatedAt
}
```

---

## 5. Backend Implementation

### 5.1 Middleware Architecture

#### 5.1.1 Enhanced Authentication Middleware

**File: `backend/middleware/authMiddleware.js`**

```javascript
// Existing: protect, admin
// New additions:

- verifyEmail (verify email token)
- requireEmailVerification (check if email verified)
- rateLimitLogin (prevent brute force)
- checkAccountLocked (check if account is locked)
- twoFactorAuth (verify 2FA token)
- refreshToken (handle token refresh)
```

#### 5.1.2 New Authorization Middleware

**File: `backend/middleware/authorizationMiddleware.js`**

```javascript
-checkPermission(permission) - // Check single permission
  checkPermissions([permissions]) - // Check multiple permissions (AND)
  checkAnyPermission([permissions]) - // Check multiple permissions (OR)
  checkRole(role) - // Check specific role
  checkRoleLevel(level) - // Check minimum role level
  checkResourceOwnership(resourceModel, paramName); // Check if user owns resource
```

#### 5.1.3 Activity Logging Middleware

**File: `backend/middleware/activityLogMiddleware.js`**

```javascript
-logActivity(action, resource, metadata) - // Log user activity
  logAdminActivity(action, resource, metadata) - // Log admin actions
  getActivityLogs(filters); // Retrieve activity logs
```

#### 5.1.4 Validation Middleware

**File: `backend/middleware/validationMiddleware.js`**

```javascript
-validateRoleData - // Validate role creation/update
  validatePermissionData - // Validate permission data
  validateStoreSettings - // Validate store settings
  validateCouponData; // Validate coupon data
```

### 5.2 Controller Structure

#### 5.2.1 Admin Controllers

**File: `backend/controllers/admin/adminAuthController.js`**

- `adminLogin` - Admin login with 2FA support
- `adminLogout` - Admin logout
- `refreshAdminToken` - Refresh admin token
- `enable2FA` - Enable two-factor authentication
- `verify2FA` - Verify 2FA setup
- `disable2FA` - Disable 2FA

**File: `backend/controllers/admin/adminStoreController.js`**

- `getStoreProfile` - Get store information
- `updateStoreProfile` - Update store details
- `uploadStoreLogo` - Upload store logo
- `getStoreSettings` - Get store settings
- `updateStoreSettings` - Update store settings
- `getPaymentMethods` - Get payment methods config
- `updatePaymentMethods` - Update payment methods
- `getShippingZones` - Get shipping zones
- `updateShippingZones` - Update shipping zones
- `getBanners` - Get homepage banners
- `createBanner` - Create new banner
- `updateBanner` - Update banner
- `deleteBanner` - Delete banner
- `getHomepageSections` - Get homepage sections
- `updateHomepageSections` - Update homepage sections
- `getFeaturedProducts` - Get featured products
- `updateFeaturedProducts` - Update featured products

**File: `backend/controllers/admin/adminProductController.js`**

- `getAllProducts` - Get all products with filters
- `getProductById` - Get product details
- `createProduct` - Create new product
- `updateProduct` - Update product
- `deleteProduct` - Delete product
- `bulkUploadProducts` - CSV bulk upload
- `getProductCategories` - Get all categories
- `manageProductCategories` - CRUD categories
- `getProductInventory` - Get inventory status
- `updateInventory` - Update stock levels
- `getLowStockAlerts` - Get low stock products
- `getExpiredProducts` - Get expired products
- `getProductAnalytics` - Product performance analytics

**File: `backend/controllers/admin/adminInventoryController.js`**

- `getInventoryOverview` - Real-time inventory status
- `getStockLevels` - Get all stock levels
- `updateStock` - Update stock for product
- `getLowStockAlerts` - Get low stock alerts
- `getExpiredProductAlerts` - Get expired product alerts
- `getSuppliers` - Get supplier list
- `createSupplier` - Add supplier
- `updateSupplier` - Update supplier
- `deleteSupplier` - Delete supplier
- `getBatchTracking` - Get batch/lot tracking
- `createBatch` - Create new batch
- `updateBatch` - Update batch info

**File: `backend/controllers/admin/adminOrderController.js`**

- `getAllOrders` - Get all orders with filters
- `getOrderById` - Get order details
- `updateOrderStatus` - Update order status
- `assignDeliveryPartner` - Assign delivery partner
- `cancelOrder` - Cancel order (admin)
- `processRefund` - Process refund
- `generateInvoice` - Generate invoice PDF
- `generatePackingSlip` - Generate packing slip
- `getOrderAnalytics` - Order analytics
- `exportOrders` - Export orders to CSV/PDF

**File: `backend/controllers/admin/adminUserController.js`**

- `getAllUsers` - Get all users with filters
- `getUserById` - Get user details
- `createUser` - Create new user (admin)
- `updateUser` - Update user
- `blockUser` - Block/unblock user
- `deleteUser` - Delete user
- `getUserOrders` - Get user's order history
- `getUserActivity` - Get user activity logs
- `createSubAdmin` - Create sub-admin user
- `getSubAdmins` - Get all sub-admins
- `updateSubAdminPermissions` - Update sub-admin permissions

**File: `backend/controllers/admin/adminReviewController.js`**

- `getAllReviews` - Get all reviews with filters
- `getReviewById` - Get review details
- `approveReview` - Approve review
- `rejectReview` - Reject review
- `deleteReview` - Delete review
- `getPendingReviews` - Get pending reviews

**File: `backend/controllers/admin/adminContentController.js`**

- `getBlogPosts` - Get all blog posts
- `createBlogPost` - Create blog post
- `updateBlogPost` - Update blog post
- `deleteBlogPost` - Delete blog post
- `getFAQs` - Get all FAQs
- `createFAQ` - Create FAQ
- `updateFAQ` - Update FAQ
- `deleteFAQ` - Delete FAQ
- `reorderFAQs` - Reorder FAQs

**File: `backend/controllers/admin/adminPromotionController.js`**

- `getCoupons` - Get all coupons
- `createCoupon` - Create coupon
- `updateCoupon` - Update coupon
- `deleteCoupon` - Delete coupon
- `validateCoupon` - Validate coupon code
- `getFlashSales` - Get flash sales
- `createFlashSale` - Create flash sale
- `updateFlashSale` - Update flash sale
- `deleteFlashSale` - Delete flash sale
- `getLoyaltyProgram` - Get loyalty program settings
- `updateLoyaltyProgram` - Update loyalty program
- `getCampaigns` - Get marketing campaigns
- `createCampaign` - Create campaign
- `updateCampaign` - Update campaign
- `sendCampaign` - Send campaign
- `getCampaignAnalytics` - Campaign performance

**File: `backend/controllers/admin/adminAnalyticsController.js`**

- `getDashboardStats` - Get dashboard overview
- `getSalesReport` - Sales report with filters
- `getProductPerformance` - Product performance analytics
- `getCustomerAnalytics` - Customer behavior analytics
- `getRevenueReport` - Revenue and profit reports
- `exportReport` - Export report (CSV/PDF)
- `getRealTimeStats` - Real-time statistics

**File: `backend/controllers/admin/adminRoleController.js`**

- `getRoles` - Get all roles
- `getRoleById` - Get role details
- `createRole` - Create new role
- `updateRole` - Update role
- `deleteRole` - Delete role
- `getPermissions` - Get all permissions
- `getPermissionsByCategory` - Get permissions by category
- `assignPermissionsToRole` - Assign permissions to role

**File: `backend/controllers/admin/adminActivityController.js`**

- `getActivityLogs` - Get activity logs with filters
- `getUserActivity` - Get specific user activity
- `getAdminActivity` - Get admin activity logs
- `exportActivityLogs` - Export activity logs

**File: `backend/controllers/admin/adminSupportController.js`**

- `getSupportTickets` - Get all support tickets
- `getTicketById` - Get ticket details
- `updateTicketStatus` - Update ticket status
- `assignTicket` - Assign ticket to admin
- `addTicketResponse` - Add response to ticket
- `closeTicket` - Close ticket

#### 5.2.2 User Controllers

**File: `backend/controllers/user/userAuthController.js`**

- `register` - User registration
- `login` - User login
- `socialLogin` - Google/Facebook login
- `logout` - User logout
- `forgotPassword` - Request password reset
- `resetPassword` - Reset password
- `verifyEmail` - Verify email address
- `resendVerificationEmail` - Resend verification email
- `refreshToken` - Refresh JWT token

**File: `backend/controllers/user/userProfileController.js`**

- `getProfile` - Get user profile
- `updateProfile` - Update profile
- `uploadAvatar` - Upload profile picture
- `changePassword` - Change password
- `getAddresses` - Get saved addresses
- `addAddress` - Add new address
- `updateAddress` - Update address
- `deleteAddress` - Delete address
- `setDefaultAddress` - Set default address
- `getPreferences` - Get user preferences
- `updatePreferences` - Update preferences

**File: `backend/controllers/user/userProductController.js`**

- `getProducts` - Browse products with filters
- `getProductById` - Get product details
- `searchProducts` - Search products
- `getProductsByCategory` - Get products by category
- `getFeaturedProducts` - Get featured products
- `getNewArrivals` - Get new arrivals
- `getOrganicProducts` - Get organic products
- `getCertifiedProducts` - Get certified products

**File: `backend/controllers/user/userCartController.js`**

- `getCart` - Get user cart
- `addToCart` - Add item to cart
- `updateCartItem` - Update cart item quantity
- `removeFromCart` - Remove item from cart
- `clearCart` - Clear cart
- `getCartSummary` - Get cart summary

**File: `backend/controllers/user/userWishlistController.js`**

- `getWishlist` - Get user wishlist
- `addToWishlist` - Add to wishlist
- `removeFromWishlist` - Remove from wishlist
- `moveToCart` - Move wishlist item to cart

**File: `backend/controllers/user/userOrderController.js`**

- `createOrder` - Place order
- `getMyOrders` - Get user's orders
- `getOrderById` - Get order details
- `cancelOrder` - Cancel order (before shipment)
- `requestReturn` - Request return
- `requestRefund` - Request refund
- `trackOrder` - Track order status
- `downloadInvoice` - Download invoice PDF
- `rateOrder` - Rate completed order

**File: `backend/controllers/user/userReviewController.js`**

- `getMyReviews` - Get user's reviews
- `createReview` - Create product review
- `updateReview` - Update review
- `deleteReview` - Delete review
- `uploadReviewImage` - Upload image with review

**File: `backend/controllers/user/userLoyaltyController.js`**

- `getLoyaltyPoints` - Get loyalty points
- `getLoyaltyHistory` - Get points history
- `redeemPoints` - Redeem loyalty points

**File: `backend/controllers/user/userSupportController.js`**

- `createTicket` - Create support ticket
- `getMyTickets` - Get user's tickets
- `getTicketById` - Get ticket details
- `addTicketResponse` - Add response to ticket

### 5.3 Route Structure

#### 5.3.1 Admin Routes

**File: `backend/routes/admin/adminAuthRoutes.js`**

```
POST   /api/admin/auth/login
POST   /api/admin/auth/logout
POST   /api/admin/auth/refresh
POST   /api/admin/auth/2fa/enable
POST   /api/admin/auth/2fa/verify
POST   /api/admin/auth/2fa/disable
```

**File: `backend/routes/admin/adminStoreRoutes.js`**

```
GET    /api/admin/store/profile
PUT    /api/admin/store/profile
POST   /api/admin/store/logo
GET    /api/admin/store/settings
PUT    /api/admin/store/settings
GET    /api/admin/store/payment-methods
PUT    /api/admin/store/payment-methods
GET    /api/admin/store/shipping-zones
PUT    /api/admin/store/shipping-zones
GET    /api/admin/store/banners
POST   /api/admin/store/banners
PUT    /api/admin/store/banners/:id
DELETE /api/admin/store/banners/:id
GET    /api/admin/store/homepage-sections
PUT    /api/admin/store/homepage-sections
GET    /api/admin/store/featured-products
PUT    /api/admin/store/featured-products
```

**File: `backend/routes/admin/adminProductRoutes.js`**

```
GET    /api/admin/products
POST   /api/admin/products
GET    /api/admin/products/:id
PUT    /api/admin/products/:id
DELETE /api/admin/products/:id
POST   /api/admin/products/bulk-upload
GET    /api/admin/products/categories
POST   /api/admin/products/categories
PUT    /api/admin/products/categories/:id
DELETE /api/admin/products/categories/:id
GET    /api/admin/products/inventory
PUT    /api/admin/products/inventory/:id
GET    /api/admin/products/alerts/low-stock
GET    /api/admin/products/alerts/expired
GET    /api/admin/products/analytics
```

**File: `backend/routes/admin/adminInventoryRoutes.js`**

```
GET    /api/admin/inventory/overview
GET    /api/admin/inventory/stock-levels
PUT    /api/admin/inventory/stock/:id
GET    /api/admin/inventory/alerts/low-stock
GET    /api/admin/inventory/alerts/expired
GET    /api/admin/inventory/suppliers
POST   /api/admin/inventory/suppliers
PUT    /api/admin/inventory/suppliers/:id
DELETE /api/admin/inventory/suppliers/:id
GET    /api/admin/inventory/batches
POST   /api/admin/inventory/batches
PUT    /api/admin/inventory/batches/:id
```

**File: `backend/routes/admin/adminOrderRoutes.js`**

```
GET    /api/admin/orders
GET    /api/admin/orders/:id
PUT    /api/admin/orders/:id/status
PUT    /api/admin/orders/:id/assign-delivery
POST   /api/admin/orders/:id/cancel
POST   /api/admin/orders/:id/refund
GET    /api/admin/orders/:id/invoice
GET    /api/admin/orders/:id/packing-slip
GET    /api/admin/orders/analytics
POST   /api/admin/orders/export
```

**File: `backend/routes/admin/adminUserRoutes.js`**

```
GET    /api/admin/users
POST   /api/admin/users
GET    /api/admin/users/:id
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id
PUT    /api/admin/users/:id/block
GET    /api/admin/users/:id/orders
GET    /api/admin/users/:id/activity
POST   /api/admin/users/sub-admins
GET    /api/admin/users/sub-admins
PUT    /api/admin/users/sub-admins/:id/permissions
```

**File: `backend/routes/admin/adminReviewRoutes.js`**

```
GET    /api/admin/reviews
GET    /api/admin/reviews/:id
PUT    /api/admin/reviews/:id/approve
PUT    /api/admin/reviews/:id/reject
DELETE /api/admin/reviews/:id
GET    /api/admin/reviews/pending
```

**File: `backend/routes/admin/adminContentRoutes.js`**

```
GET    /api/admin/content/blog
POST   /api/admin/content/blog
PUT    /api/admin/content/blog/:id
DELETE /api/admin/content/blog/:id
GET    /api/admin/content/faq
POST   /api/admin/content/faq
PUT    /api/admin/content/faq/:id
DELETE /api/admin/content/faq/:id
PUT    /api/admin/content/faq/reorder
```

**File: `backend/routes/admin/adminPromotionRoutes.js`**

```
GET    /api/admin/promotions/coupons
POST   /api/admin/promotions/coupons
PUT    /api/admin/promotions/coupons/:id
DELETE /api/admin/promotions/coupons/:id
POST   /api/admin/promotions/coupons/validate
GET    /api/admin/promotions/flash-sales
POST   /api/admin/promotions/flash-sales
PUT    /api/admin/promotions/flash-sales/:id
DELETE /api/admin/promotions/flash-sales/:id
GET    /api/admin/promotions/loyalty
PUT    /api/admin/promotions/loyalty
GET    /api/admin/promotions/campaigns
POST   /api/admin/promotions/campaigns
PUT    /api/admin/promotions/campaigns/:id
POST   /api/admin/promotions/campaigns/:id/send
GET    /api/admin/promotions/campaigns/:id/analytics
```

**File: `backend/routes/admin/adminAnalyticsRoutes.js`**

```
GET    /api/admin/analytics/dashboard
GET    /api/admin/analytics/sales
GET    /api/admin/analytics/products
GET    /api/admin/analytics/customers
GET    /api/admin/analytics/revenue
POST   /api/admin/analytics/export
GET    /api/admin/analytics/realtime
```

**File: `backend/routes/admin/adminRoleRoutes.js`**

```
GET    /api/admin/roles
POST   /api/admin/roles
GET    /api/admin/roles/:id
PUT    /api/admin/roles/:id
DELETE /api/admin/roles/:id
GET    /api/admin/permissions
GET    /api/admin/permissions/categories
PUT    /api/admin/roles/:id/permissions
```

**File: `backend/routes/admin/adminActivityRoutes.js`**

```
GET    /api/admin/activity
GET    /api/admin/activity/user/:userId
GET    /api/admin/activity/admin
POST   /api/admin/activity/export
```

**File: `backend/routes/admin/adminSupportRoutes.js`**

```
GET    /api/admin/support/tickets
GET    /api/admin/support/tickets/:id
PUT    /api/admin/support/tickets/:id/status
PUT    /api/admin/support/tickets/:id/assign
POST   /api/admin/support/tickets/:id/response
PUT    /api/admin/support/tickets/:id/close
```

#### 5.3.2 User Routes

**File: `backend/routes/user/userAuthRoutes.js`**

```
POST   /api/users/register
POST   /api/users/login
POST   /api/users/social-login
POST   /api/users/logout
POST   /api/users/forgot-password
POST   /api/users/reset-password
POST   /api/users/verify-email
POST   /api/users/resend-verification
POST   /api/users/refresh-token
```

**File: `backend/routes/user/userProfileRoutes.js`**

```
GET    /api/users/profile
PUT    /api/users/profile
POST   /api/users/profile/avatar
PUT    /api/users/profile/password
GET    /api/users/profile/addresses
POST   /api/users/profile/addresses
PUT    /api/users/profile/addresses/:id
DELETE /api/users/profile/addresses/:id
PUT    /api/users/profile/addresses/:id/default
GET    /api/users/profile/preferences
PUT    /api/users/profile/preferences
```

**File: `backend/routes/user/userProductRoutes.js`**

```
GET    /api/products
GET    /api/products/:id
GET    /api/products/search
GET    /api/products/category/:categoryId
GET    /api/products/featured
GET    /api/products/new-arrivals
GET    /api/products/organic
GET    /api/products/certified/:certId
```

**File: `backend/routes/user/userCartRoutes.js`**

```
GET    /api/cart
POST   /api/cart
PUT    /api/cart/:itemId
DELETE /api/cart/:itemId
DELETE /api/cart
GET    /api/cart/summary
```

**File: `backend/routes/user/userWishlistRoutes.js`**

```
GET    /api/wishlist
POST   /api/wishlist
DELETE /api/wishlist/:productId
POST   /api/wishlist/:productId/move-to-cart
```

**File: `backend/routes/user/userOrderRoutes.js`**

```
POST   /api/orders
GET    /api/orders/my
GET    /api/orders/:id
POST   /api/orders/:id/cancel
POST   /api/orders/:id/return
POST   /api/orders/:id/refund-request
GET    /api/orders/:id/track
GET    /api/orders/:id/invoice
POST   /api/orders/:id/rate
```

**File: `backend/routes/user/userReviewRoutes.js`**

```
GET    /api/reviews/my
POST   /api/reviews
PUT    /api/reviews/:id
DELETE /api/reviews/:id
POST   /api/reviews/:id/image
```

**File: `backend/routes/user/userLoyaltyRoutes.js`**

```
GET    /api/loyalty/points
GET    /api/loyalty/history
POST   /api/loyalty/redeem
```

**File: `backend/routes/user/userSupportRoutes.js`**

```
POST   /api/support/tickets
GET    /api/support/tickets/my
GET    /api/support/tickets/:id
POST   /api/support/tickets/:id/response
```

### 5.4 Utility Functions

**File: `backend/utils/permissionUtils.js`**

- `hasPermission(user, permission)` - Check if user has permission
- `hasAnyPermission(user, permissions)` - Check if user has any permission
- `hasAllPermissions(user, permissions)` - Check if user has all permissions
- `getUserPermissions(user)` - Get all user permissions (role + direct)
- `checkResourceOwnership(user, resource, userIdField)` - Check ownership

**File: `backend/utils/activityLogger.js`**

- `logActivity(user, action, resource, resourceId, metadata)` - Log activity
- `getActivityLogs(filters)` - Get activity logs
- `formatActivityLog(log)` - Format log for display

**File: `backend/utils/emailService.js`**

- `sendVerificationEmail(user, token)` - Send email verification
- `sendPasswordResetEmail(user, token)` - Send password reset
- `sendOrderConfirmationEmail(order)` - Order confirmation
- `sendOrderStatusUpdateEmail(order)` - Order status update
- `sendCampaignEmail(campaign, users)` - Marketing campaign

**File: `backend/utils/pdfGenerator.js`**

- `generateInvoice(order)` - Generate invoice PDF
- `generatePackingSlip(order)` - Generate packing slip
- `generateReport(data, type)` - Generate report PDF

**File: `backend/utils/csvExporter.js`**

- `exportOrders(orders)` - Export orders to CSV
- `exportProducts(products)` - Export products to CSV
- `exportUsers(users)` - Export users to CSV
- `exportActivityLogs(logs)` - Export activity logs to CSV

**File: `backend/utils/twoFactorAuth.js`**

- `generateSecret()` - Generate 2FA secret
- `generateQRCode(secret, email)` - Generate QR code
- `verifyToken(secret, token)` - Verify 2FA token

---

## 6. Frontend Implementation

### 6.1 Component Structure

#### 6.1.1 Admin Components

**Directory: `frontend/src/components/admin/`**

**Layout Components:**

- `AdminLayout.js` - Main admin layout with sidebar
- `AdminSidebar.js` - Admin navigation sidebar
- `AdminHeader.js` - Admin header with notifications
- `AdminBreadcrumbs.js` - Breadcrumb navigation

**Store Management:**

- `StoreProfileForm.js` - Store profile editor
- `StoreSettingsForm.js` - Store settings editor
- `PaymentMethodsConfig.js` - Payment methods configuration
- `ShippingZonesConfig.js` - Shipping zones management
- `BannerManager.js` - Banner management
- `HomepageSectionsEditor.js` - Homepage sections editor
- `FeaturedProductsSelector.js` - Featured products selector

**Product Management:**

- `ProductList.js` - Product list with filters
- `ProductForm.js` - Product create/edit form
- `ProductImageUpload.js` - Product image uploader
- `BulkProductUpload.js` - CSV bulk upload
- `CategoryManager.js` - Category management
- `InventoryManager.js` - Inventory management
- `StockAlerts.js` - Stock alerts display
- `ProductAnalytics.js` - Product analytics dashboard

**Inventory Management:**

- `InventoryOverview.js` - Inventory overview dashboard
- `StockLevelsTable.js` - Stock levels table
- `SupplierManager.js` - Supplier management
- `BatchTracker.js` - Batch/lot tracking

**Order Management:**

- `OrderList.js` - Order list with filters
- `OrderDetails.js` - Order details view
- `OrderStatusUpdater.js` - Order status update
- `DeliveryPartnerAssigner.js` - Assign delivery partner
- `RefundProcessor.js` - Refund processing
- `InvoiceGenerator.js` - Invoice generation
- `OrderAnalytics.js` - Order analytics

**User Management:**

- `UserList.js` - User list with filters
- `UserDetails.js` - User details view
- `UserForm.js` - User create/edit form
- `SubAdminManager.js` - Sub-admin management
- `UserActivityLog.js` - User activity logs

**Review Management:**

- `ReviewList.js` - Review list with filters
- `ReviewModerator.js` - Review moderation interface
- `PendingReviews.js` - Pending reviews queue

**Content Management:**

- `BlogPostList.js` - Blog post list
- `BlogPostEditor.js` - Blog post editor
- `FAQManager.js` - FAQ management

**Promotion Management:**

- `CouponManager.js` - Coupon management
- `FlashSaleManager.js` - Flash sale management
- `LoyaltyProgramConfig.js` - Loyalty program settings
- `CampaignManager.js` - Marketing campaign manager
- `CampaignEditor.js` - Campaign editor

**Analytics:**

- `DashboardStats.js` - Dashboard statistics
- `SalesReport.js` - Sales report
- `ProductPerformance.js` - Product performance
- `CustomerAnalytics.js` - Customer analytics
- `RevenueReport.js` - Revenue report
- `ReportExporter.js` - Report export

**Role & Permission Management:**

- `RoleManager.js` - Role management
- `PermissionManager.js` - Permission management
- `RolePermissionAssigner.js` - Assign permissions to roles

**Activity & Support:**

- `ActivityLogViewer.js` - Activity log viewer
- `SupportTicketList.js` - Support ticket list
- `SupportTicketViewer.js` - Support ticket viewer

#### 6.1.2 User Components

**Directory: `frontend/src/components/user/`**

**Profile:**

- `ProfileForm.js` - User profile form
- `AvatarUpload.js` - Avatar upload
- `AddressManager.js` - Address management
- `PreferencesForm.js` - User preferences

**Product Browsing:**

- `ProductGrid.js` - Product grid display
- `ProductFilters.js` - Product filters sidebar
- `ProductSearch.js` - Product search
- `ProductDetails.js` - Product details view
- `ProductReviews.js` - Product reviews display

**Cart & Wishlist:**

- `CartItem.js` - Cart item component
- `CartSummary.js` - Cart summary
- `WishlistItem.js` - Wishlist item
- `WishlistGrid.js` - Wishlist grid

**Checkout:**

- `CheckoutSteps.js` - Checkout progress (existing)
- `ShippingForm.js` - Shipping address form
- `PaymentForm.js` - Payment method selection
- `OrderSummary.js` - Order summary
- `CouponInput.js` - Coupon code input

**Orders:**

- `OrderHistory.js` - Order history list
- `OrderDetails.js` - Order details view
- `OrderTracking.js` - Order tracking
- `OrderCancelForm.js` - Order cancellation
- `ReturnRequestForm.js` - Return request

**Reviews:**

- `ReviewForm.js` - Review creation form
- `ReviewList.js` - User's reviews
- `ReviewImageUpload.js` - Review image upload

**Loyalty:**

- `LoyaltyPointsDisplay.js` - Loyalty points display
- `LoyaltyHistory.js` - Points history
- `PointsRedeemer.js` - Points redemption

**Support:**

- `SupportTicketForm.js` - Create support ticket
- `SupportTicketList.js` - User's tickets
- `SupportTicketViewer.js` - Ticket viewer

#### 6.1.3 Shared Components

**Directory: `frontend/src/components/shared/`**

- `ProtectedRoute.js` - Route protection based on role
- `PermissionGate.js` - Component-level permission check
- `RoleBasedComponent.js` - Render based on role
- `LoadingSpinner.js` - Loading indicator
- `ErrorMessage.js` - Error message display
- `SuccessMessage.js` - Success message
- `ConfirmDialog.js` - Confirmation dialog
- `DataTable.js` - Reusable data table
- `Pagination.js` - Pagination component (existing)
- `SearchBox.js` - Search box (existing)
- `FilterPanel.js` - Filter panel
- `DateRangePicker.js` - Date range picker
- `FileUpload.js` - File upload component
- `ImageUpload.js` - Image upload component
- `RichTextEditor.js` - Rich text editor
- `Chart.js` - Chart component (for analytics)

### 6.2 Screen Structure

#### 6.2.1 Admin Screens

**Directory: `frontend/src/screens/admin/`**

**Dashboard:**

- `AdminDashboardScreen.js` - Main admin dashboard

**Store Management:**

- `StoreProfileScreen.js` - Store profile management
- `StoreSettingsScreen.js` - Store settings
- `BannerManagementScreen.js` - Banner management
- `HomepageEditorScreen.js` - Homepage editor

**Product Management:**

- `ProductListScreen.js` - Product list (enhance existing)
- `ProductEditScreen.js` - Product edit (enhance existing)
- `ProductCreateScreen.js` - Product creation
- `CategoryManagementScreen.js` - Category management
- `InventoryManagementScreen.js` - Inventory management
- `StockAlertsScreen.js` - Stock alerts

**Order Management:**

- `OrderListScreen.js` - Order list (enhance existing)
- `OrderDetailsScreen.js` - Order details
- `OrderAnalyticsScreen.js` - Order analytics

**User Management:**

- `UserListScreen.js` - User list (enhance existing)
- `UserEditScreen.js` - User edit (enhance existing)
- `SubAdminManagementScreen.js` - Sub-admin management

**Content Management:**

- `ReviewModerationScreen.js` - Review moderation
- `BlogManagementScreen.js` - Blog management
- `FAQManagementScreen.js` - FAQ management

**Promotion Management:**

- `CouponManagementScreen.js` - Coupon management
- `FlashSaleManagementScreen.js` - Flash sale management
- `CampaignManagementScreen.js` - Campaign management

**Analytics:**

- `AnalyticsDashboardScreen.js` - Analytics dashboard
- `SalesReportScreen.js` - Sales reports
- `ProductAnalyticsScreen.js` - Product analytics
- `CustomerAnalyticsScreen.js` - Customer analytics

**Settings:**

- `RoleManagementScreen.js` - Role management
- `PermissionManagementScreen.js` - Permission management
- `ActivityLogScreen.js` - Activity logs
- `SupportTicketsScreen.js` - Support tickets

#### 6.2.2 User Screens

**Directory: `frontend/src/screens/user/`**

**Authentication:**

- `LoginScreen.js` - Login (enhance existing)
- `RegisterScreen.js` - Register (enhance existing)
- `ForgotPasswordScreen.js` - Forgot password
- `ResetPasswordScreen.js` - Reset password
- `EmailVerificationScreen.js` - Email verification

**Profile:**

- `ProfileScreen.js` - User profile (enhance existing)
- `AddressManagementScreen.js` - Address management
- `PreferencesScreen.js` - User preferences

**Shopping:**

- `HomeScreen.js` - Homepage (enhance existing)
- `ProductScreen.js` - Product details (enhance existing)
- `ProductListScreen.js` - Product listing
- `SearchResultsScreen.js` - Search results
- `CategoryScreen.js` - Category page

**Cart & Checkout:**

- `CartScreen.js` - Cart (enhance existing)
- `ShippingScreen.js` - Shipping (enhance existing)
- `PaymentScreen.js` - Payment (enhance existing)
- `PlaceOrderScreen.js` - Place order (enhance existing)

**Orders:**

- `OrderHistoryScreen.js` - Order history
- `OrderDetailsScreen.js` - Order details
- `OrderTrackingScreen.js` - Order tracking

**Reviews:**

- `MyReviewsScreen.js` - User's reviews
- `WriteReviewScreen.js` - Write review

**Wishlist:**

- `WishlistScreen.js` - Wishlist

**Loyalty:**

- `LoyaltyScreen.js` - Loyalty points

**Support:**

- `SupportScreen.js` - Support tickets

### 6.3 Redux State Management

#### 6.3.1 Admin Reducers

**File: `frontend/src/reducers/adminReducers.js`**

```javascript
- adminAuthReducer (login, logout, 2FA)
- adminStoreReducer (store profile, settings)
- adminProductReducer (products, categories, inventory)
- adminOrderReducer (orders, analytics)
- adminUserReducer (users, sub-admins)
- adminReviewReducer (reviews, moderation)
- adminContentReducer (blog, FAQ)
- adminPromotionReducer (coupons, campaigns)
- adminAnalyticsReducer (reports, stats)
- adminRoleReducer (roles, permissions)
- adminActivityReducer (activity logs)
- adminSupportReducer (support tickets)
```

#### 6.3.2 User Reducers

**File: `frontend/src/reducers/userReducers.js`** (enhance existing)

```javascript
- userAuthReducer (login, register, social login)
- userProfileReducer (profile, addresses, preferences)
- userWishlistReducer (wishlist)
- userLoyaltyReducer (loyalty points)
- userSupportReducer (support tickets)
```

#### 6.3.3 Shared Reducers

**File: `frontend/src/reducers/`** (enhance existing)

```javascript
- productReducers.js (enhance for user/admin views)
- cartReducers.js (enhance existing)
- orderReducers.js (enhance existing)
- categoryReducers.js (enhance existing)
```

#### 6.3.4 Actions

**File: `frontend/src/actions/adminActions.js`**

- All admin-related actions

**File: `frontend/src/actions/userActions.js`** (enhance existing)

- User-related actions

**File: `frontend/src/actions/wishlistActions.js`**

- Wishlist actions

**File: `frontend/src/actions/loyaltyActions.js`**

- Loyalty actions

**File: `frontend/src/actions/supportActions.js`**

- Support ticket actions

### 6.4 Routing Structure

**File: `frontend/src/App.js`**

```javascript
Routes:
- /login (User/Admin)
- /register (User)
- /forgot-password (User)
- /reset-password/:token (User)
- /verify-email/:token (User)

User Routes:
- / (Home)
- /products
- /product/:id
- /category/:slug
- /search
- /cart
- /shipping
- /payment
- /placeorder
- /order/:id
- /order/:id/track
- /profile
- /profile/addresses
- /profile/preferences
- /orders
- /wishlist
- /reviews
- /loyalty
- /support

Admin Routes:
- /admin/login
- /admin/dashboard
- /admin/store/profile
- /admin/store/settings
- /admin/products
- /admin/products/create
- /admin/products/:id/edit
- /admin/categories
- /admin/inventory
- /admin/orders
- /admin/orders/:id
- /admin/users
- /admin/users/:id
- /admin/sub-admins
- /admin/reviews
- /admin/content/blog
- /admin/content/faq
- /admin/promotions/coupons
- /admin/promotions/campaigns
- /admin/analytics
- /admin/roles
- /admin/activity
- /admin/support
```

### 6.5 UI/UX Considerations

#### 6.5.1 Admin Dashboard

- **Color Scheme**: Professional, data-focused (blues, grays)
- **Layout**: Sidebar navigation, top header, main content area
- **Components**: Data tables, charts, forms, modals
- **Responsive**: Desktop-first, tablet support
- **Real-time Updates**: WebSocket for real-time stats

#### 6.5.2 User Dashboard

- **Color Scheme**: Organic, friendly (greens, earth tones)
- **Layout**: Header, main content, footer
- **Components**: Product cards, forms, order cards
- **Responsive**: Mobile-first design
- **Performance**: Lazy loading, image optimization

#### 6.5.3 Shared Design System

- Consistent button styles
- Form input styles
- Modal/dialog styles
- Loading states
- Error states
- Success notifications
- Typography system
- Color palette
- Spacing system

---

## 7. Security & Authentication

### 7.1 Authentication Enhancements

#### 7.1.1 Password Security

- Minimum 8 characters
- Require uppercase, lowercase, number, special character
- Password strength indicator
- Password history (prevent reuse)
- Account lockout after failed attempts
- Password expiration (optional)

#### 7.1.2 Two-Factor Authentication (2FA)

- TOTP (Time-based One-Time Password)
- QR code generation for setup
- Backup codes
- SMS option (optional)
- Email option (optional)

#### 7.1.3 Session Management

- JWT with refresh tokens
- Token expiration (access: 15min, refresh: 7 days)
- Token rotation
- Device tracking
- Concurrent session limits
- Logout from all devices

#### 7.1.4 Email Verification

- Email verification on registration
- Resend verification email
- Verified email badge
- Restrict actions until verified

### 7.2 Authorization

#### 7.2.1 Role-Based Access Control

- Role hierarchy (Super Admin > Store Manager > Customer)
- Permission inheritance
- Direct permission overrides
- Resource-level permissions

#### 7.2.2 Route Protection

- Frontend route guards
- Backend route middleware
- API endpoint protection
- Admin route separation

#### 7.2.3 Resource Ownership

- Users can only access their own resources
- Admins can access all resources
- Sub-admins have limited access
- Ownership checks on all operations

### 7.3 Security Best Practices

#### 7.3.1 Input Validation

- Server-side validation (required)
- Client-side validation (UX)
- Sanitize user inputs
- SQL injection prevention (MongoDB safe)
- XSS prevention
- CSRF protection

#### 7.3.2 Rate Limiting

- Login attempts (5 per 15 min)
- API requests (100 per minute)
- Password reset (3 per hour)
- Email sending (10 per hour)

#### 7.3.3 Data Protection

- Encrypt sensitive data
- Hash passwords (bcrypt)
- Secure token storage
- HTTPS only
- Secure headers (helmet.js)

#### 7.3.4 Activity Monitoring

- Log all admin actions
- Log sensitive user actions
- Failed login attempts
- Permission denials
- Suspicious activity alerts

---

## 8. Implementation Phases

### Phase 1: Foundation (Weeks 1-2)

**Goal**: Set up core RBAC infrastructure

**Tasks**:

1. Database schema updates

   - Create Role model
   - Create Permission model
   - Update User model with role reference
   - Create ActivityLog model
   - Seed default roles and permissions

2. Backend middleware

   - Enhanced authentication middleware
   - Authorization middleware
   - Activity logging middleware
   - Permission utilities

3. Basic admin routes

   - Admin authentication routes
   - Admin dashboard route
   - Role management routes

4. Frontend setup
   - Admin layout components
   - Protected route component
   - Permission gate component
   - Admin routing structure

**Deliverables**:

- Enhanced user model with roles
- Role and permission models
- Basic admin authentication
- Admin layout structure

### Phase 2: Admin Core Features (Weeks 3-4)

**Goal**: Implement core admin management features

**Tasks**:

1. Store management

   - Store profile management
   - Store settings
   - Payment methods configuration
   - Shipping zones

2. Product management

   - Enhanced product CRUD
   - Category management
   - Inventory management
   - Stock alerts

3. Order management

   - Order list with filters
   - Order status updates
   - Delivery assignment
   - Invoice generation

4. User management
   - User list
   - User details
   - Block/unblock users
   - Sub-admin creation

**Deliverables**:

- Complete admin product management
- Complete admin order management
- Complete admin user management
- Store settings management

### Phase 3: Advanced Admin Features (Weeks 5-6)

**Goal**: Implement advanced admin features

**Tasks**:

1. Content management

   - Review moderation
   - Blog management
   - FAQ management

2. Promotion management

   - Coupon system
   - Flash sales
   - Campaign management

3. Analytics

   - Dashboard statistics
   - Sales reports
   - Product analytics
   - Customer analytics
   - Report exports

4. Support system
   - Support ticket management
   - Ticket assignment
   - Ticket responses

**Deliverables**:

- Complete content management
- Complete promotion system
- Analytics dashboard
- Support ticket system

### Phase 4: User Features (Weeks 7-8)

**Goal**: Implement enhanced user features

**Tasks**:

1. Enhanced authentication

   - Social login (Google/Facebook)
   - Email verification
   - Password reset flow
   - 2FA for users (optional)

2. Profile management

   - Enhanced profile form
   - Address management
   - User preferences
   - Avatar upload

3. Shopping features

   - Enhanced product browsing
   - Advanced filters
   - Product search
   - Wishlist functionality

4. Order features

   - Order history
   - Order tracking
   - Order cancellation
   - Return requests
   - Invoice download

5. Reviews

   - Review creation
   - Review with images
   - Review management

6. Loyalty

   - Loyalty points display
   - Points history
   - Points redemption

7. Support
   - Create support tickets
   - View ticket status
   - Ticket responses

**Deliverables**:

- Complete user profile management
- Wishlist functionality
- Enhanced order management
- Review system
- Loyalty program
- User support system

### Phase 5: Security & Polish (Weeks 9-10)

**Goal**: Security enhancements and UI polish

**Tasks**:

1. Security enhancements

   - Rate limiting
   - Input validation
   - XSS/CSRF protection
   - Security headers
   - Activity logging

2. UI/UX improvements

   - Responsive design
   - Loading states
   - Error handling
   - Success notifications
   - Form validation feedback

3. Performance optimization

   - Image optimization
   - Lazy loading
   - Code splitting
   - Caching strategies
   - Database indexing

4. Testing

   - Unit tests
   - Integration tests
   - E2E tests
   - Security testing

5. Documentation
   - API documentation
   - User guides
   - Admin guides
   - Developer documentation

**Deliverables**:

- Secure, production-ready system
- Polished UI/UX
- Optimized performance
- Comprehensive testing
- Complete documentation

---

## 9. Testing Strategy

### 9.1 Backend Testing

#### 9.1.1 Unit Tests

- Model validation
- Utility functions
- Permission checks
- Activity logging

#### 9.1.2 Integration Tests

- API endpoints
- Authentication flow
- Authorization checks
- Database operations

#### 9.1.3 Security Tests

- Authentication bypass attempts
- Permission escalation attempts
- SQL injection attempts
- XSS attempts
- CSRF attempts

### 9.2 Frontend Testing

#### 9.2.1 Component Tests

- Component rendering
- User interactions
- Form validation
- Permission-based rendering

#### 9.2.2 Integration Tests

- Route protection
- API integration
- State management
- Navigation flow

#### 9.2.3 E2E Tests

- User registration/login
- Product browsing/purchase
- Admin product management
- Admin order management
- Permission checks

### 9.3 Test Coverage Goals

- Backend: 80%+ coverage
- Frontend: 70%+ coverage
- Critical paths: 100% coverage

---

## 10. Migration Plan

### 10.1 Data Migration

#### 10.1.1 User Migration

1. Create default roles (Super Admin, Store Manager, Customer)
2. Create default permissions
3. Assign roles to existing users:
   - Users with `isAdmin: true` → Super Admin role
   - Users with `isAdmin: false` → Customer role
4. Migrate user data to new schema

#### 10.1.2 Permission Setup

1. Create all permission records
2. Assign permissions to roles
3. Create permission-role mappings

#### 10.1.3 Activity Log Initialization

1. Create activity log for existing admin actions (if possible)
2. Set up activity logging for future actions

### 10.2 Code Migration

#### 10.2.1 Backend Migration

1. Update user model
2. Create new models (Role, Permission, ActivityLog, etc.)
3. Update middleware
4. Update controllers
5. Update routes
6. Test all endpoints

#### 10.2.2 Frontend Migration

1. Update Redux store
2. Update components
3. Update routes
4. Update actions/reducers
5. Test all flows

### 10.3 Rollback Plan

- Keep old `isAdmin` field during migration
- Gradual feature rollout
- Feature flags for new features
- Database backup before migration
- Ability to revert to old system if needed

---

## 11. Additional Considerations

### 11.1 Performance

- Database indexing on frequently queried fields
- Caching for permissions and roles
- Pagination for all list views
- Lazy loading for images
- Code splitting for admin/user routes

### 11.2 Scalability

- Support for multiple stores (future)
- Multi-tenant architecture (future)
- Horizontal scaling support
- Database sharding preparation (future)

### 11.3 Monitoring

- Error tracking (Sentry)
- Performance monitoring
- User activity analytics
- Admin action tracking
- Security event logging

### 11.4 Backup & Recovery

- Regular database backups
- Activity log backups
- Disaster recovery plan
- Data retention policies

### 11.5 Compliance

- GDPR compliance (user data)
- Data privacy
- Audit trails
- Data export capabilities
- Data deletion capabilities

---

## 12. Success Metrics

### 12.1 Functional Metrics

- All admin features working
- All user features working
- Zero permission bypass incidents
- 100% route protection
- Complete activity logging

### 12.2 Performance Metrics

- Page load time < 2 seconds
- API response time < 500ms
- 99.9% uptime
- Zero security breaches

### 12.3 User Experience Metrics

- Admin task completion rate > 90%
- User checkout completion rate > 80%
- Support ticket resolution time < 24 hours
- User satisfaction score > 4.5/5

---

## 13. Future Enhancements

### 13.1 Additional Roles

- Delivery Partner role
- Content Manager role
- Customer Support role
- Marketing Manager role

### 13.2 Advanced Features

- Multi-store support
- White-label capabilities
- API for third-party integrations
- Mobile app support
- Advanced analytics (ML/AI)
- Automated inventory management
- Predictive ordering

### 13.3 Integration

- Payment gateway integrations
- Shipping provider integrations
- Email service provider integrations
- SMS service provider integrations
- Analytics platform integrations

---

## Conclusion

This comprehensive plan provides a detailed roadmap for implementing a robust Role-Based Access Control system for the VitalRock organic store platform. The implementation will be phased over 10 weeks, ensuring systematic development and testing at each stage.

The system will support:

- **Super Admin**: Full system control
- **Store Manager**: Store operations management
- **Customer**: Enhanced shopping experience

All features are designed with security, scalability, and user experience in mind, ensuring a production-ready system that can grow with the business.

---

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Author**: System Architect  
**Status**: Planning Phase
