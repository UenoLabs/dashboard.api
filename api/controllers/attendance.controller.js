import { db } from "../config/firebase.js";
import { collection, getDocs, listCollections } from "firebase/firestore";

export const getAllAttendance = async (req, res) => {
  try {
    // 1. List all root-level collections (CSC 307, CSC 309, etc.)
    const rootCollections = await listCollections(db);

    const allSummary = [];

    for (const courseCollection of rootCollections) {
      const courseId = courseCollection.id;

      // Skip if it doesn't have 'students' or 'attendance'
      const subCollections = await listCollections(courseCollection);
      const subNames = subCollections.map(col => col.id);
      if (!subNames.includes("students") || !subNames.includes("attendance")) continue;

      const studentsRef = collection(db, courseId, "students");
      const attendanceRef = collection(db, courseId, "attendance");

      const studentsSnap = await getDocs(studentsRef);
      const attendanceSnap = await getDocs(attendanceRef);

      const students = studentsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      const attendanceMap = {};
      const uniqueDates = new Set();

      attendanceSnap.docs.forEach(doc => {
        const record = doc.data()?.attendance;
        const studentId = record?.studentId;
        const date = record?.dateOfClass;

        if (studentId && date) {
          attendanceMap[studentId] = (attendanceMap[studentId] || 0) + 1;
          uniqueDates.add(date);
        }
      });

      const totalClasses = uniqueDates.size;

      students.forEach(student => {
        const attended = attendanceMap[student.studentId] || 0;
        const percentage = totalClasses === 0 ? 0 : Math.round((attended / totalClasses) * 100);

        allSummary.push({
          name: student.name || "Unnamed",
          email: student.email || "No Email",
          studentId: student.studentId || "No ID",
          course: courseId,
          classesAttended: `${attended}/${totalClasses}`,
          attendanceRate: `${percentage}%`,
        });
      });
    }

    res.status(200).json(allSummary);

  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({ error: error.message });
  }
};






// Collection: courses
//   └── Document: CSC_307
//         ├── Subcollection: students
//         └── Subcollection: attendance
