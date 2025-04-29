import { registrarVenta, registrarDetalleVenta, obtenerVentas, obtenerVentasPorUsuario } from '../../models/sales/salesModel.js';
import { findUserById, findUserByName } from '../../models/dates/userModel.js';
import { actualizarStockProducto } from '../../models/sales/productsModel.js';
import { saleDetailsEmail } from '../../middlewares/emailService.js';

// Registrar nueva venta
export const registrarNuevaVenta = async (req, res) => {
    try {
        const { id_usuario, buy_order, total, estado, detalles, nombre_cliente, email_cliente, pago } = req.body;

        // Validar que 'detalles' y 'total' estén presentes
        if (!detalles || detalles.length === 0 || !total) {
            return res.status(400).json({
                message: 'Datos incompletos para registrar la venta.',
                id_usuario, total, estado, detalles, nombre_cliente, email_cliente
            });
        }

        let idUsuarioFinal = null;

        if (id_usuario) {
            const usuario = await findUserById(id_usuario);
            if (!usuario.data) {
                return res.status(404).json({ message: 'Usuario no encontrado.' });
            }

            idUsuarioFinal = usuario.data.id_usuario;
        } else {
            if (!nombre_cliente || !email_cliente) {
                return res.status(400).json({
                    message: 'Falta id_usuario o los datos de nombre y email del cliente.'
                });
            }

            idUsuarioFinal = null;
        }

        // Registrar la venta
        const id_venta = await registrarVenta(idUsuarioFinal, buy_order, total, estado, nombre_cliente, email_cliente, pago);

        // Registrar los detalles de la venta
        await registrarDetalleVenta(id_venta, detalles);
        
        // Actualizar el stock de cada producto
        for (const detalle of detalles) {
            await actualizarStockProducto(detalle.id_producto, detalle.cantidad);
        }

        await saleDetailsEmail(email_cliente, id_venta, detalles, nombre_cliente, total, buy_order);

        // Respuesta exitosa
        res.status(201).json({
            message: 'Venta registrada exitosamente',
            id_venta
        });
    } catch (error) {
        // Manejo de errores
        res.status(500).json({ message: error.message });
    }
};

// Obtener todas las ventas
export const obtenerTodasLasVentas = async (req, res) => {
    try {
        const ventas = await obtenerVentas();
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener ventas por usuario
export const obtenerVentasDeUsuario = async (req, res) => {
    const { nombre_usuario } = req.params;

    const { data: usuario } = await findUserByName(nombre_usuario);

    const id_usuario = usuario.id_usuario;
    
    try {
        const ventas = await obtenerVentasPorUsuario(id_usuario);
        res.json(ventas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
