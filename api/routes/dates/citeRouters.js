import express from 'express';

import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { AddCita, GetCites, GetCitesByClient, GetCitesByEmployee, UpdateCitaEstado, UpdateCitaFecha } from '../../controllers/dates/citeController.js';

const router = express.Router();

// Rutas protegidas
router.get('/', authenticateToken, GetCites);
router.get('/empleado/:name', authenticateToken, GetCitesByEmployee);
router.get('/cliente/:name', authenticateToken, GetCitesByClient);
router.post('/',AddCita);
router.patch('/:id_cita/estado', UpdateCitaEstado);
router.patch('/:id_cita/fecha', UpdateCitaFecha);

export default router;

