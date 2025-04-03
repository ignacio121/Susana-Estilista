import express from 'express';
import { loginUser, resetPassword, updatePassword } from '../../controllers/dates/authController.js';

const router = express.Router();

// Ruta para login
router.post('/login', loginUser);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

export default router;
