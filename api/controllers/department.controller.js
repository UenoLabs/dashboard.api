import {
  addDoc,
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";

import { db } from "../config/firebase.js"; 

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

export const updateDepartment = async (req, res) => {
  const { id } = req.params; // Department ID from URL
  try {
    const docRef = doc(db, "department", id);
    await updateDoc(docRef, req.body); // Update with provided data
    res.status(200).json({ message: "Department updated successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  try {
    const docRef = doc(db, "department", id);
    await deleteDoc(docRef);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



