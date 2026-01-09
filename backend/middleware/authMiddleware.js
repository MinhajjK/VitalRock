import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id)
        .select("-password -twoFactorSecret")
        .populate("role", "name slug level permissions isActive")
        .populate("permissions", "name slug category resource action isActive")
        .populate(
          "role.permissions",
          "name slug category resource action isActive"
        );

      if (!req.user) {
        res.status(401);
        throw new Error("User not found");
      }

      if (!req.user.isActive) {
        res.status(401);
        throw new Error("User account is inactive");
      }

      if (req.user.isLocked()) {
        res.status(423);
        throw new Error(
          "Account is locked due to too many failed login attempts"
        );
      }

      // Update last login
      req.user.lastLogin = new Date();
      req.user.lastLoginIP = req.ip || req.connection.remoteAddress;
      await req.user.save({ validateBeforeSave: false });

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const admin = (req, res, next) => {
  if (
    req.user &&
    (req.user.isAdmin || (req.user.role && req.user.role.level <= 2))
  ) {
    next();
  } else {
    res.status(403);
    throw new Error("Not authorized as an admin");
  }
};

const requireEmailVerification = asyncHandler(async (req, res, next) => {
  if (!req.user) {
    res.status(401);
    throw new Error("Not authenticated");
  }

  if (!req.user.isEmailVerified) {
    res.status(403);
    throw new Error("Email verification required");
  }

  next();
});

const checkAccountLocked = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isLocked()) {
    res.status(423);
    throw new Error("Account is locked. Please try again later.");
  }
  next();
});

export { admin, checkAccountLocked, protect, requireEmailVerification };
