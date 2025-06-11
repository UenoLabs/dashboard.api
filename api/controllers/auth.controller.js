import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import { db } from "../config/firebase.js";
import { generateTokenAndSetCookie } from "../lib/utils/generateToken.js";



// const JWT_SECRET = process.env.JWT_SECRET;


export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const q = query(collection(db, "admins"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // ✅ Generate token and set cookie securely
    generateTokenAndSetCookie(userDoc.id, res);

    res.status(200).json({
      message: "Login successful",
      user: {
        id: userDoc.id,
        fullName: userData.fullName,
        email: userData.email,
        university: userData.university,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
    console.error("Error during login:", err);
    console.log("JWT_SECRET from env =>", process.env.JWT_SECRET);
  }
};


export const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge:0})
        res.status(200).json({message:"Logged out successfully"})
    } catch (error) {
      console.error("Error in login controller", error.message);
      res.status(500).json({message:"Internal server error"})
    }
};
