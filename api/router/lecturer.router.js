import express from 'express';
import { createLecturer, getLecturerById, getLecturers } from '../controllers/lecturer.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();

router.post('/create', protectRoute, createLecturer);
router.get('/', protectRoute, getLecturers);
router.get('/:id', getLecturerById);



export default router;