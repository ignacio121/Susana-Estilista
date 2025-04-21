import { registrarVenta, registrarDetalleVenta, obtenerVentas, obtenerVentasPorUsuario } from '../../models/sales/salesModel.js';
import { findUserById, findUserByName } from '../../models/dates/userModel.js';

// Registrar nueva venta
export const registrarNuevaVenta = async (req, res) => {
    try {
        const { id_usuario, total, estado, detalles, nombre_cliente, telefono_cliente, pago } = req.body;

        // Validar que 'detalles' y 'total' estén presentes
        if (!detalles || detalles.length === 0 || !total) {
            return res.status(400).json({
                message: 'Datos incompletos para registrar la venta.',
                id_usuario, total, estado, detalles, nombre_cliente, telefono_cliente
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
            if (!nombre_cliente || !telefono_cliente) {
                return res.status(400).json({
                    message: 'Falta id_usuario o los datos de nombre y teléfono del cliente.'
                });
            }

            idUsuarioFinal = null;
        }

        const id_venta = await registrarVenta(idUsuarioFinal, total, estado, nombre_cliente, telefono_cliente, pago);

        await registrarDetalleVenta(id_venta, detalles);

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
