import asyncHandler from "express-async-handler";
import User from "../../models/userModel.js";
import { logAdminActivity } from "../../utils/activityLogger.js";
import generateToken from "../../utils/generateToken.js";

// @desc    Admin login
// @route   POST /api/admin/auth/login
// @access  Public
const adminLogin = asyncHandler(async (req, res) => {
  const { email, password, twoFactorToken } = req.body;

  const user = await User.findOne({ email }).populate(
    "role",
    "name slug level"
  );

  if (!user) {
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // Check if account is locked
  if (user.isLocked()) {
    res.status(423);
    throw new Error(
      "Account is locked due to too many failed login attempts. Please try again later."
    );
  }

  // Check if user is active
  if (!user.isActive) {
    res.status(401);
    throw new Error("Account is inactive");
  }

  // Check if user has admin role
  if (!user.isAdmin && (!user.role || user.role.level > 2)) {
    res.status(403);
    throw new Error("Access denied. Admin privileges required.");
  }

  // Verify password
  if (!(await user.matchPassword(password))) {
    await user.incLoginAttempts();
    res.status(401);
    throw new Error("Invalid email or password");
  }

  // If 2FA is enabled, verify token
  if (user.twoFactorEnabled) {
    if (!twoFactorToken) {
      res.status(400);
      throw new Error("Two-factor authentication token required");
    }

    // TODO: Implement 2FA verification
    // const isValid = verifyTwoFactorToken(user.twoFactorSecret, twoFactorToken)
    // if (!isValid) {
    //   res.status(401)
    //   throw new Error('Invalid two-factor authentication token')
    // }
  }

  // Reset login attempts on successful login
  await user.resetLoginAttempts();

  // Update last login
  user.lastLogin = new Date();
  user.lastLoginIP = req.ip || req.connection.remoteAddress;
  await user.save({ validateBeforeSave: false });

  // Log activity
  await logAdminActivity(
    user,
    "admin.login",
    "Auth",
    null,
    { loginIP: user.lastLoginIP },
    req
  );

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    isAdmin: user.isAdmin,
    token: generateToken(user._id),
  });
});

// @desc    Admin logout
// @route   POST /api/admin/auth/logout
// @access  Private/Admin
const adminLogout = asyncHandler(async (req, res) => {
  await logAdminActivity(req.user, "admin.logout", "Auth", null, {}, req);

  res.json({ message: "Logged out successfully" });
});

// @desc    Get admin profile
// @route   GET /api/admin/auth/profile
// @access  Private/Admin
const getAdminProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .select("-password -twoFactorSecret")
    .populate("role", "name slug level permissions")
    .populate("permissions", "name slug category")
    .populate("role.permissions", "name slug category");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json(user);
});

export { adminLogin, adminLogout, getAdminProfile };
