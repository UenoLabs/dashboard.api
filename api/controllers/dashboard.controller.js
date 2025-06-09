import { db } from "../config/firebase.js";
import { collection, getDocs } from "firebase/firestore";

export const getDashboardData = async (req, res) => {
    try {
    // 1. Total number of students
    const studentsSnapshot = await getDocs(collection(db, "students"));
    const totalStudents = studentsSnapshot.size;

    // 2. Total classes held
    const classesSnapshot = await getDocs(collection(db, "classes"));
    const totalClasses = classesSnapshot.size;

    // 3. Attendance data
    const attendanceSnapshot = await getDocs(collection(db, "attendance"));
    let totalAttendanceRecords = 0;
    let totalPresent = 0;
    let totalAbsent = 0;

    attendanceSnapshot.forEach((doc) => {
      const data = doc.data();
      totalAttendanceRecords++;
      if (data.status === "present") totalPresent++;
      else if (data.status === "absent") totalAbsent++;
    });

    const attendancePercentage = totalAttendanceRecords
      ? Math.round((totalPresent / totalAttendanceRecords) * 100)
      : 0;

    const absentRate = totalAttendanceRecords
      ? Math.round((totalAbsent / totalAttendanceRecords) * 100)
      : 0;

    res.json({
      totalStudents,
      totalClasses,
      attendancePercentage,
      absentRate,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}