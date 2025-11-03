import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const secret = process.env.JWT_SECRET || "secret";

// 🔐 Generate JWT
export function signToken(payload, expires = process.env.JWT_EXPIRES || "1h") {
  return jwt.sign(payload, secret, { expiresIn: expires });
}

// ✅ Verify JWT
export function verifyToken(token) {
  return jwt.verify(token, secret);
}

// 🚧 Middleware for protecting routes
export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: "No token" });

  const token = header.replace("Bearer ", "");
  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("JWT verification failed:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
}
