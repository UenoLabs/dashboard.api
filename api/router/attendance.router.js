import express from 'express';
import { getAllAttendance, getStudentAttendance } from '../controllers/attendance.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get("/", protectRoute, getAllAttendance)
router.get("/:regNumber/", protectRoute, getStudentAttendance);

// router.get("/:courseId", getAttendance)


export default router;