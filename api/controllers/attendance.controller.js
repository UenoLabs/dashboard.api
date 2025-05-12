import { db, storage } from "../config/firebase.js"; // Adjust the path as necessary
import { collection, getDocs, addDoc } from "firebase/firestore";


export const getAttendance = async (req, res) => {
  const { courseId } = req.params;

  try {
    // 1. Get all students in the course
    const studentsSnap = await getDocs(collection(db, `${courseId}/students`));
    const students = studentsSnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 2. Get all attendance records
    const attendanceSnap = await getDocs(collection(db, `${courseId}/attendance`));
    const attendanceRecords = attendanceSnap.docs.map(doc => doc.data());

    // 3. Group attendance by studentId
    const attendanceMap = {};
    attendanceRecords.forEach(({ studentId }) => {
      attendanceMap[studentId] = (attendanceMap[studentId] || 0) + 1;
    });

    // 4. Assume totalClasses = all unique dates in attendance records
    const uniqueDates = new Set(attendanceRecords.map(record => record.date));
    const totalClasses = uniqueDates.size;

    // 5. Construct summary
    const summary = students.map(student => {
      const attended = attendanceMap[student.studentId] || 0;
      const percentage = totalClasses === 0 ? 0 : Math.round((attended / totalClasses) * 100);

      return {
        name: student.name,
        email: student.email,
        studentId: student.studentId,
        classesAttended: `${attended}/${totalClasses}`,
        attendanceRate: `${percentage}%`,
      };
    });

    res.status(200).json(summary);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}


