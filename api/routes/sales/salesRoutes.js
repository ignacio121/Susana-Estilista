import express from 'express';
import { registrarNuevaVenta, obtenerTodasLasVentas, obtenerVentasDeUsuario } from '../../controllers/sales/salesController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Registrar nueva venta
router.post('/', authenticateToken, registrarNuevaVenta);

// Obtener todas las ventas
router.get('/', authenticateToken, obtenerTodasLasVentas);

// Obtener ventas por usuario
router.get('/:nombre_usuario', authenticateToken, obtenerVentasDeUsuario);

export default router;
