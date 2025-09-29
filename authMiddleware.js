import { verifyFirebaseToken } from "./firebaseAdmin.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const user = await verifyFirebaseToken(token);
    req.user = user; // attach Firebase user info
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
