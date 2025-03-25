import express from 'express';
import { addPersonalInfo } from '../../controllers/dates/personalInfoController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// POST: Agregar información personal
router.post('/',authenticateToken, addPersonalInfo);

export default router;
