import { registrarVenta, registrarDetalleVenta, obtenerVentas, obtenerVentasPorUsuario } from '../../models/sales/salesmodel.js';
import { findUserByName } from '../../models/dates/userModel.js';

// Registrar nueva venta
export const registrarNuevaVenta = async (req, res) => {
    try {
        const { nombre_usuario, total, estado, detalles } = req.body;

        if (!nombre_usuario || !detalles || detalles.length === 0) {
            return res.status(400).json({ message: 'Datos incompletos para registrar la venta.', nombre_usuario, total, estado, detalles });
        }

        const { data: usuario } = await findUserByName(nombre_usuario);

        const id_usuario = usuario.id_usuario;

        // Registrar venta principal
        const id_venta = await registrarVenta(id_usuario, total, estado);

        // Registrar detalle de la venta
        await registrarDetalleVenta(id_venta, detalles);

        res.status(201).json({ message: 'Venta registrada exitosamente', id_venta });
    } catch (error) {
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
