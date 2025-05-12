import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js"; // adjust path as needed

export const createDepartment = async (req, res) => {
    try {
        const docRef = await addDoc(collection(db, "department"), req.body);
        res.status(201).json({ id: docRef.id });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    }

export const getDepartments = async (req, res) => {
    try {
        const querySnapshot = await getDocs(collection(db, "department"));
        const departments = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        res.status(200).json(departments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}