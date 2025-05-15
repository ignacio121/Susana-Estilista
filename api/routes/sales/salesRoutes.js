import express from 'express';
import { registrarNuevaVenta, obtenerTodasLasVentas, obtenerVentasDeUsuario, obtenerVentaID, obtenerVentaOrden, entregarVentaID } from '../../controllers/sales/salesController.js';
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Registrar nueva venta
router.post('/', registrarNuevaVenta);

// Obtener todas las ventas
router.get('/', authenticateToken, obtenerTodasLasVentas);

// Obtener ventas por usuario
router.get('/:id_usuario', authenticateToken, obtenerVentasDeUsuario);

// Obtener venta por id
router.get('/id/:id_venta', authenticateToken, obtenerVentaID);

// Obtener venta por orden de compra
router.get('/orden/:buy_order', authenticateToken, obtenerVentaOrden);

// Obtener venta por orden de compra
router.put('/entrega/:id_venta', authenticateToken, entregarVentaID);

export default router;
