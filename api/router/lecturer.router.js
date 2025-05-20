import express from 'express';
import { createLecturer, getLecturerById, getLecturers } from '../controllers/lecturer.controller.js';

const router = express.Router();

router.post('/create', createLecturer);
router.get('/', getLecturers);
router.get('/:id', getLecturerById);



export default router;