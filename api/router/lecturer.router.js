import express from 'express';
import { createLecturer, getLecturers } from '../controllers/lecturer.controller.js';

const router = express.Router();

router.post('/create', createLecturer);
router.get('/', getLecturers);



export default router;