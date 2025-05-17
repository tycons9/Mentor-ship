import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { JWT_SECRET } from "../config/env.js";

const authorize = (roles = []) => {
  // roles can be a single role string or an array of roles
  if (typeof roles === "string") {
    roles = [roles];
  }

  return async (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Access denied. No token provided." });
      }

      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      // Fetch user info from DB to check role and existence
     const [rows] = await db.execute(
  "SELECT id, username, email, role FROM users WHERE id = ?",
  [decoded.id]
);


      const user = rows[0];
      if (!user) {
        return res.status(401).json({ message: "Access denied. User not found." });
      }

      // If roles array is specified, check if user's role is allowed
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden. You do not have access." });
      }

      // Attach user info to request for later handlers
      req.user = user;
      next();

    } catch (error) {
      console.error("JWT verification error:", error);
      res.status(401).json({
        message: "Invalid or expired token",
        error: process.env.NODE_ENV === "development" ? error.message : undefined,
      });
    }
  };
};

export default authorize;
