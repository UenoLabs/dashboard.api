import express from 'express';
import { getDashboardData } from '../controllers/dashboard.controller.js';
import { protectRoute } from "../middleware/protectRoute.js";



const router = express.Router();

router.get('/overview', protectRoute, getDashboardData);

export default router;