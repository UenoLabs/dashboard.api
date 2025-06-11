import { db } from "../config/firebase.js";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";

export const getAllAttendance = async (req, res) => {
  try {
    const studentsRef = collection(db, "students");
    const studentSnap = await getDocs(studentsRef);
    const allStudents = studentSnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    const attendanceData = await Promise.all(
      allStudents.map(async (student) => {
        const regNumber = student.regNumber?.toLowerCase();
        const courses = student.courses || [];

        let totalAttended = 0;
        let totalClasses = 0;

        for (const course of courses) {
          const studentDocRef = doc(db, "courses", course, "students", regNumber);
          const studentDocSnap = await getDoc(studentDocRef);

          if (studentDocSnap.exists()) {
            const studentCourseData = studentDocSnap.data();
            const attendedClasses = studentCourseData.classesAttendedIds || {};
            const attendedCount = Object.keys(attendedClasses).length;
            totalAttended += attendedCount;
          }

          const attendanceCol = collection(db, "courses", course, "attendance");
          const attendanceSnap = await getDocs(attendanceCol);
          totalClasses += attendanceSnap.size;
        }

        const attendanceRate = totalClasses
          ? Math.round((totalAttended / totalClasses) * 100)
          : 0;

        return {
          name: `${student.firstName} ${student.lastName}`,
          studentID: student.regNumber,
          email: student.emailAddress || "",
          attendanceRate: `${attendanceRate}%`,
          classesAttended: `${totalAttended}/${totalClasses}`,
        };
      })
    );

    res.status(200).json(attendanceData);
  } catch (error) {
    console.error("Attendance error:", error);
    res.status(500).json({
      message: "Failed to fetch attendance data",
      error: error.message,
    });
  }
};


// get students attendance 

export const getStudentAttendance = async (req, res) => {
  const { regNumber } = req.params;

  try {
    const studentRef = doc(db, "students", regNumber.toLowerCase());
    const studentSnap = await getDoc(studentRef);

    if (!studentSnap.exists()) {
      return res.status(404).json({ message: "Student not found" });
    }

    const studentData = studentSnap.data();
    
    return res.status(200).json({
      name: `${studentData.firstName} ${studentData.lastName}`,
      department: studentData.dept,
      studentID: studentData.regNumber,
      phone: studentData.phoneNumber || "",
      email: studentData.emailAddress || "",
    });
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    return res.status(500).json({
      message: "Failed to fetch student attendance",
      error: error.message,
    });
  }
};










// Collection: courses
//   └── Document: CSC_307
//         ├── Subcollection: students
//         └── Subcollection: attendance
