import { db, storage } from "../config/firebase.js"; // Adjust the path as necessary
import { collection, getDocs, addDoc } from "firebase/firestore";

export const User = async (req, res) => {
  try {
    const usersCol = collection(db, "users");
    const snapshot = await getDocs(usersCol);
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
