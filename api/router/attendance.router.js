import express from 'express';
import { getAllAttendance } from '../controllers/attendance.controller.js';

const router = express.Router();

router.get("/", getAllAttendance)
// router.get("/:courseId", getAttendance)


export default router;