import { addDoc, collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase.js"; // adjust path as needed

export const createLecturer = async (req, res) => {
  try {
    const lecturerData = {
      ...req.body,
      lastLogin: new Date().toISOString(), // add current timestamp
    };
    const docRef = await addDoc(collection(db, "lecturer"), lecturerData);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLecturers = async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "lecturer"));
    const lecturers = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    res.status(200).json(lecturers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLecturerById = async (req, res) => {
  const { id } = req.params;

  try {
    const docRef = await getDocs(collection(db, "lecturer"));
    const lecturer = docRef.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })).find(lecturer => lecturer.id === id);

    if (!lecturer) {
      return res.status(404).json({ error: "Lecturer not found" });
    }

    res.status(200).json(lecturer);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
