import express from 'express';
import { User } from '../controllers/user.controller.js';

const router = express.Router();

router.get('/users', User)

export default router;