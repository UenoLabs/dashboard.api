import { db } from "../config/firebase.js";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getAllAttendance = async (req, res) => {
  try {
    // Step 1: Get all students enrolled in CSC 307
    const studentsRef = collection(db, "students");
    const studentSnap = await getDocs(studentsRef);
    const allStudents = studentSnap.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(student => student.courses?.includes("CSC 307"));

    // Step 2: Get all attendance documents under CSC 307
    const csc307Ref = collection(db, "CSC 307");
    const classDocsSnap = await getDocs(csc307Ref);

    let totalClasses = 0;
    const attendanceMap = {};

    for (const doc of classDocsSnap.docs) {
      const attendanceSubRef = collection(db, "CSC 307", doc.id, "attendance");
      const attendanceSnap = await getDocs(attendanceSubRef);

      if (!attendanceSnap.empty) {
        totalClasses++; // Count only classes that recorded attendance
      }

      attendanceSnap.forEach(attDoc => {
        const attendees = attDoc.data().attendance || [];
        attendees.forEach(record => {
          const reg = record.regNumber?.toLowerCase();
          if (!reg) return;
          if (!attendanceMap[reg]) attendanceMap[reg] = 0;
          attendanceMap[reg]++;
        });
      });
    }

    // Step 3: Construct response per student
    const attendanceData = allStudents.map(student => {
      const regNumber = student.regNumber?.toLowerCase();
      const attended = attendanceMap[regNumber] || 0;
      const attendanceRate = totalClasses
        ? Math.round((attended / totalClasses) * 100)
        : 0;

      return {
        name: `${student.firstName} ${student.lastName}`,
        studentID: student.regNumber,
        email: student.emailAddress || "",
        attendanceRate: `${attendanceRate}%`,
        classesAttended: `${attended}/${totalClasses}`,
      };
    });

    res.status(200).json(attendanceData);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance data",
      error: error.message,
    });
  }
};






// Collection: courses
//   └── Document: CSC_307
//         ├── Subcollection: students
//         └── Subcollection: attendance
