import { collection, addDoc, getDocs, query, where } from "firebase/firestore";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/firebase.js";

// const JWT_SECRET = process.env.JWT_SECRET;


// REGISTER
export const registerUser = async (req, res) => {
  const { fullName, email, password, university } = req.body;

  try {
    // Check if user exists
    const q = query(collection(db, "admins"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const docRef = await addDoc(collection(db, "admins"), {
      fullName,
      email,
      password: hashedPassword,
      university,
      createdAt: new Date().toISOString(),
    });

    res.status(201).json({ id: docRef.id, message: "Admin registered" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// LOGIN
// import jwt from "jsonwebtoken";


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

    // ✅ Make sure JWT_SECRET is used here correctly
    const token = jwt.sign(
      { id: userDoc.id, email: userData.email },
      process.env.JWT_SECRET, // this must NOT be undefined
      { expiresIn: "1d" }
    );

    res.status(200).json({
      token,
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
