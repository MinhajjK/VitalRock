import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Permission from "../models/permissionModel.js";
import Role from "../models/roleModel.js";

dotenv.config();

// Define all permissions
const permissions = [
  // Authentication
  {
    name: "Login",
    slug: "auth.login",
    category: "authentication",
    resource: "auth",
    action: "read",
  },
  {
    name: "Logout",
    slug: "auth.logout",
    category: "authentication",
    resource: "auth",
    action: "read",
  },
  {
    name: "Password Reset",
    slug: "auth.password-reset",
    category: "authentication",
    resource: "auth",
    action: "update",
  },
  {
    name: "2FA Management",
    slug: "auth.2fa",
    category: "authentication",
    resource: "auth",
    action: "manage",
  },

  // Store Management
  {
    name: "View Store Profile",
    slug: "store.profile.read",
    category: "store",
    resource: "store",
    action: "read",
  },
  {
    name: "Update Store Profile",
    slug: "store.profile.update",
    category: "store",
    resource: "store",
    action: "update",
  },
  {
    name: "View Store Settings",
    slug: "store.settings.read",
    category: "store",
    resource: "store",
    action: "read",
  },
  {
    name: "Update Store Settings",
    slug: "store.settings.update",
    category: "store",
    resource: "store",
    action: "update",
  },
  {
    name: "Manage Banners",
    slug: "store.banners.manage",
    category: "store",
    resource: "banner",
    action: "manage",
  },
  {
    name: "Manage Homepage",
    slug: "store.homepage.manage",
    category: "store",
    resource: "homepage",
    action: "manage",
  },
  {
    name: "Manage Payment Methods",
    slug: "store.payment.manage",
    category: "store",
    resource: "payment",
    action: "manage",
  },
  {
    name: "Manage Shipping Zones",
    slug: "store.shipping.manage",
    category: "store",
    resource: "shipping",
    action: "manage",
  },

  // Products
  {
    name: "View Products",
    slug: "products.read",
    category: "products",
    resource: "product",
    action: "read",
  },
  {
    name: "Create Products",
    slug: "products.create",
    category: "products",
    resource: "product",
    action: "create",
  },
  {
    name: "Update Products",
    slug: "products.update",
    category: "products",
    resource: "product",
    action: "update",
  },
  {
    name: "Delete Products",
    slug: "products.delete",
    category: "products",
    resource: "product",
    action: "delete",
  },
  {
    name: "Bulk Upload Products",
    slug: "products.bulk-upload",
    category: "products",
    resource: "product",
    action: "create",
  },
  {
    name: "Manage Categories",
    slug: "products.categories.manage",
    category: "products",
    resource: "category",
    action: "manage",
  },

  // Inventory
  {
    name: "View Inventory",
    slug: "inventory.read",
    category: "inventory",
    resource: "inventory",
    action: "read",
  },
  {
    name: "Update Inventory",
    slug: "inventory.update",
    category: "inventory",
    resource: "inventory",
    action: "update",
  },
  {
    name: "View Stock Alerts",
    slug: "inventory.alerts.read",
    category: "inventory",
    resource: "inventory",
    action: "read",
  },
  {
    name: "Manage Suppliers",
    slug: "inventory.suppliers.manage",
    category: "inventory",
    resource: "supplier",
    action: "manage",
  },
  {
    name: "Manage Batches",
    slug: "inventory.batches.manage",
    category: "inventory",
    resource: "batch",
    action: "manage",
  },

  // Orders
  {
    name: "View Orders",
    slug: "orders.read",
    category: "orders",
    resource: "order",
    action: "read",
  },
  {
    name: "Update Order Status",
    slug: "orders.update",
    category: "orders",
    resource: "order",
    action: "update",
  },
  {
    name: "Assign Delivery Partner",
    slug: "orders.assign-delivery",
    category: "orders",
    resource: "order",
    action: "update",
  },
  {
    name: "Cancel Orders",
    slug: "orders.cancel",
    category: "orders",
    resource: "order",
    action: "update",
  },
  {
    name: "Process Refunds",
    slug: "orders.refund",
    category: "orders",
    resource: "order",
    action: "update",
  },
  {
    name: "Generate Invoices",
    slug: "orders.invoice",
    category: "orders",
    resource: "order",
    action: "read",
  },

  // Users
  {
    name: "View Users",
    slug: "users.read",
    category: "users",
    resource: "user",
    action: "read",
  },
  {
    name: "Create Users",
    slug: "users.create",
    category: "users",
    resource: "user",
    action: "create",
  },
  {
    name: "Update Users",
    slug: "users.update",
    category: "users",
    resource: "user",
    action: "update",
  },
  {
    name: "Delete Users",
    slug: "users.delete",
    category: "users",
    resource: "user",
    action: "delete",
  },
  {
    name: "Block/Unblock Users",
    slug: "users.block",
    category: "users",
    resource: "user",
    action: "update",
  },
  {
    name: "Create Sub-Admins",
    slug: "users.sub-admins.create",
    category: "users",
    resource: "user",
    action: "create",
  },
  {
    name: "Manage Sub-Admins",
    slug: "users.sub-admins.manage",
    category: "users",
    resource: "user",
    action: "manage",
  },

  // Reviews
  {
    name: "View Reviews",
    slug: "reviews.read",
    category: "reviews",
    resource: "review",
    action: "read",
  },
  {
    name: "Moderate Reviews",
    slug: "reviews.moderate",
    category: "reviews",
    resource: "review",
    action: "update",
  },
  {
    name: "Approve Reviews",
    slug: "reviews.approve",
    category: "reviews",
    resource: "review",
    action: "update",
  },
  {
    name: "Delete Reviews",
    slug: "reviews.delete",
    category: "reviews",
    resource: "review",
    action: "delete",
  },

  // Content
  {
    name: "Manage Blog Posts",
    slug: "content.blog.manage",
    category: "content",
    resource: "blog",
    action: "manage",
  },
  {
    name: "Manage FAQs",
    slug: "content.faq.manage",
    category: "content",
    resource: "faq",
    action: "manage",
  },

  // Promotions
  {
    name: "Manage Coupons",
    slug: "promotions.coupons.manage",
    category: "promotions",
    resource: "coupon",
    action: "manage",
  },
  {
    name: "Manage Flash Sales",
    slug: "promotions.flash-sales.manage",
    category: "promotions",
    resource: "flash-sale",
    action: "manage",
  },
  {
    name: "Manage Loyalty Program",
    slug: "promotions.loyalty.manage",
    category: "promotions",
    resource: "loyalty",
    action: "manage",
  },
  {
    name: "Manage Campaigns",
    slug: "promotions.campaigns.manage",
    category: "promotions",
    resource: "campaign",
    action: "manage",
  },

  // Analytics
  {
    name: "View Dashboard",
    slug: "analytics.dashboard.read",
    category: "analytics",
    resource: "dashboard",
    action: "read",
  },
  {
    name: "View Sales Reports",
    slug: "analytics.sales.read",
    category: "analytics",
    resource: "report",
    action: "read",
  },
  {
    name: "View Product Analytics",
    slug: "analytics.products.read",
    category: "analytics",
    resource: "report",
    action: "read",
  },
  {
    name: "View Customer Analytics",
    slug: "analytics.customers.read",
    category: "analytics",
    resource: "report",
    action: "read",
  },
  {
    name: "Export Reports",
    slug: "analytics.export",
    category: "analytics",
    resource: "report",
    action: "read",
  },

  // Settings
  {
    name: "Manage Roles",
    slug: "settings.roles.manage",
    category: "settings",
    resource: "role",
    action: "manage",
  },
  {
    name: "Manage Permissions",
    slug: "settings.permissions.manage",
    category: "settings",
    resource: "permission",
    action: "manage",
  },
  {
    name: "View Activity Logs",
    slug: "settings.activity.read",
    category: "settings",
    resource: "activity",
    action: "read",
  },
  {
    name: "Manage Support Tickets",
    slug: "settings.support.manage",
    category: "settings",
    resource: "support",
    action: "manage",
  },
];

// Define roles with their permissions
const roles = [
  {
    name: "Super Admin",
    slug: "super-admin",
    description: "Full system access with all permissions",
    level: 1,
    isSystemRole: true,
    permissions: [], // Will be populated with all permissions
  },
  {
    name: "Store Manager",
    slug: "store-manager",
    description: "Store operations and management",
    level: 2,
    isSystemRole: true,
    permissions: [
      "store.profile.read",
      "store.profile.update",
      "store.settings.read",
      "store.settings.update",
      "store.banners.manage",
      "store.homepage.manage",
      "store.payment.manage",
      "store.shipping.manage",
      "products.read",
      "products.create",
      "products.update",
      "products.delete",
      "products.bulk-upload",
      "products.categories.manage",
      "inventory.read",
      "inventory.update",
      "inventory.alerts.read",
      "inventory.suppliers.manage",
      "inventory.batches.manage",
      "orders.read",
      "orders.update",
      "orders.assign-delivery",
      "orders.cancel",
      "orders.refund",
      "orders.invoice",
      "users.read",
      "users.update",
      "users.block",
      "reviews.read",
      "reviews.moderate",
      "reviews.approve",
      "reviews.delete",
      "content.blog.manage",
      "content.faq.manage",
      "promotions.coupons.manage",
      "promotions.flash-sales.manage",
      "promotions.loyalty.manage",
      "promotions.campaigns.manage",
      "analytics.dashboard.read",
      "analytics.sales.read",
      "analytics.products.read",
      "analytics.customers.read",
      "analytics.export",
      "settings.activity.read",
      "settings.support.manage",
    ],
  },
  {
    name: "Customer",
    slug: "customer",
    description: "Regular customer with shopping and account management",
    level: 3,
    isSystemRole: true,
    permissions: [
      "auth.login",
      "auth.logout",
      "auth.password-reset",
      "products.read",
      "orders.read", // Only own orders
    ],
  },
];

const seedRolesAndPermissions = async () => {
  try {
    await connectDB();

    console.log("🌱 Seeding permissions...");

    // Create permissions
    const createdPermissions = [];
    for (const perm of permissions) {
      const existing = await Permission.findOne({ slug: perm.slug });
      if (!existing) {
        const newPerm = await Permission.create(perm);
        createdPermissions.push(newPerm);
        console.log(`✅ Created permission: ${perm.slug}`);
      } else {
        createdPermissions.push(existing);
        console.log(`⏭️  Permission already exists: ${perm.slug}`);
      }
    }

    console.log(`\n🌱 Seeding roles...`);

    // Create roles
    for (const roleData of roles) {
      const existing = await Role.findOne({ slug: roleData.slug });

      if (existing) {
        console.log(`⏭️  Role already exists: ${roleData.slug}`);
        continue;
      }

      // For Super Admin, assign all permissions
      let permissionIds = [];
      if (roleData.slug === "super-admin") {
        permissionIds = createdPermissions.map((p) => p._id);
      } else {
        // For other roles, find permissions by slug
        permissionIds = createdPermissions
          .filter((p) => roleData.permissions.includes(p.slug))
          .map((p) => p._id);
      }

      const role = await Role.create({
        ...roleData,
        permissions: permissionIds,
      });

      console.log(
        `✅ Created role: ${roleData.name} with ${permissionIds.length} permissions`
      );
    }

    console.log("\n✅ Roles and permissions seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding roles and permissions:", error);
    process.exit(1);
  }
};

// Run seeder
if (process.argv[2] === "--import") {
  seedRolesAndPermissions();
}

export default seedRolesAndPermissions;
