import express from 'express';
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from '../controllers/department.controller.js';

const router = express.Router();


router.post('/create', createDepartment)
router.get('/', getDepartments)
router.put('/:id', updateDepartment)
router.delete('/:id', deleteDepartment)

export default router;