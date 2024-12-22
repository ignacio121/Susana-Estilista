import express from 'express';
import { getUsers, createUser, getUser, getUsersByRol } from '../controllers/userController.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Rutas protegidas
router.get('/', authenticateToken, getUsers);
router.get('/:name', authenticateToken, getUser);
router.get('/rol/:rol', authenticateToken, getUsersByRol);

// Registro de usuario (no requiere autenticación)
router.post('/', createUser);

export default router;
