import express from 'express';
import { createDepartment, deleteDepartment, getDepartments, updateDepartment } from '../controllers/department.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";


const router = express.Router();


router.post('/create', protectRoute, createDepartment)
router.get('/', protectRoute, getDepartments)
router.put('/:id', protectRoute, updateDepartment)
router.delete('/:id', protectRoute, deleteDepartment)

export default router;