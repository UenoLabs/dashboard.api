// index.js
import express from "express";
import { db, storage } from "./config/firebase.js"; // Adjust the path as necessary
import { collection, getDocs, addDoc } from "firebase/firestore";
import attendanceRoute from "./router/attendance.router.js";
import userRoute from "./router/user.router.js";
import lecturerRoute from "./router/lecturer.router.js";
import departmentRoute from "./router/department.router.js";



const app = express();
app.use(express.json());

// Get data from Firestore

// Add new user to Firestore
app.use("/api", userRoute);

app.post("/create", async (req, res) => {
  try {
    const docRef = await addDoc(collection(db, "products"), req.body);
    res.status(201).json({ id: docRef.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get attendance summary for a course
app.use("/api/courses", attendanceRoute)
app.use("/api/lecturer", lecturerRoute)
app.use("/api/department", departmentRoute)




// Upload file to Firebase Storage
// const upload = multer({ dest: "uploads/" });

// app.post("/upload", upload.single("file"), async (req, res) => {
//   try {
//     const file = req.file;
//     const storageRef = ref(storage, `uploads/${file.originalname}`);
//     const fileBuffer = fs.readFileSync(file.path);

//     await uploadBytes(storageRef, fileBuffer);
//     fs.unlinkSync(file.path); // Clean up local file
//     res.status(200).send("File uploaded to Firebase Storage");
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// }); npm install multer


app.listen(7000, () => {
  console.log("Server is running on port 5000");
});
