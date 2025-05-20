import { doc, getDoc } from "firebase/firestore";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";

export const protectRoute = async (req, res, next) => {
  try {
    const token = req.cookies.token; // or req.cookies.jwt, depending on your setup
    if (!token) {
      return res.status(401).json({ error: "Unauthorized: No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // ✅ Get the user from Firestore using the ID stored in the token
    const userDocRef = doc(db, "admins", decoded.userId);
    const userDocSnap = await getDoc(userDocRef);

    if (!userDocSnap.exists()) {
      return res.status(404).json({ error: "User not found" });
    }

    const user = userDocSnap.data();

    // ✅ Attach user info (excluding password) to the request object
    const { password, ...userWithoutPassword } = user;
    req.user = {
      id: userDocSnap.id,
      ...userWithoutPassword,
    };

    next();
  } catch (error) {
    console.error("Error in protectRoute middleware:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
