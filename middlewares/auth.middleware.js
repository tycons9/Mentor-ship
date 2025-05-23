import jwt from "jsonwebtoken";
import db from "../config/db.js";
import { JWT_SECRET } from "../config/env.js";

const authorize = (roles = []) => {
  
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

     
     const [rows] = await db.execute(
  "SELECT id, name, email, role FROM users WHERE id = ?",
  [decoded.id]
);


      const user = rows[0];
      if (!user) {
        return res.status(401).json({ message: "Access denied. User not found." });
      }

     
      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: "Forbidden. You do not have access." });
      }

      
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
