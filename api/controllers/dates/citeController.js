import { findCites, findCitesByClient, findCitesByEmployee, insertCita, updateCitaEstado, updateCitaFecha } from "../../models/dates/citeModel.js";
import { findServiceByName } from "../../models/dates/serviceModel.js";
import { findUserByName } from "../../models/dates/userModel.js";


export const GetCites = async (req, res) => {
    try {
        const cites = await findCites();
        res.json(cites);
    } catch (error){
        res.status(500).json({message: error.message});
    }
};

export const GetCitesByEmployee = async (req, res) => {
    const { name } = req.params;
    try {
        //Buscamos al usuario por su nombre
        const {data:user} = await findUserByName(name);

        // Verificamos si encuentra al usuario
        if (!user) {
            return res.status(400).json({message: 'Usuario no encontrado'});
        }

        const id_usuario = user.id_usuario;

        const cites = await findCitesByEmployee(id_usuario);
        res.json(cites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const GetCitesByClient = async (req, res) => {
    const { name } = req.params;
    try {
        //Buscamos al usuario por su nombre
        const {data:user} = await findUserByName(name);

        // Verificamos si encuentra al usuario
        if (!user) {
            return res.status(400).json({message: 'Usuario no encontrado'});
        }

        const id_usuario = user.id_usuario;

        const cites = await findCitesByClient(id_usuario);

        if (!cites) {
            return res.status(400).json({message: 'El cliente no cuenta con citas registradas'});
        }

        res.json(cites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const AddCita = async (req, res) => {
    const { nombre_cliente, nombre_servicio, nombre_empleado, fecha, hora_inicio, hora_fin, comentarios, telefono_cliente} = req.body;
    try {
        // Validación previa
        const { data: cliente } = await findUserByName(nombre_cliente);
        const { data: empleado} = await findUserByName(nombre_empleado);
        const  servicio  = await findServiceByName(nombre_servicio);
        
        if (!cliente && !telefono_cliente) {
            return res.status(400).json({message: 'Cliente no encontrado, agregar numero telefonico'})
        } 
        const id_cliente = cliente.id_usuario;
        const id_empleado = empleado.id_usuario;
        const id_servicio = servicio.id_servicio;
        
        const { data, error } = await insertCita({
                id_cliente,
                id_empleado,
                id_servicio,
                fecha,
                hora_inicio,
                hora_fin,
                comentarios,
                telefono_cliente,
                nombre_cliente,
            });
        res.status(201).json({message: 'Cita agregada con exito'});
    } catch (error) {
        res.status(500).json({ message: error.message});
    }
    
};

export const UpdateCitaEstado = async (req, res) => {
    const { id_cita } = req.params;
    const { nuevoEstado } = req.body;

    // Validación del nuevo estado
    const estadosValidos = ['PENDIENTE', 'COMPLETADA', 'CANCELADA'];
    if (!estadosValidos.includes(nuevoEstado)) {
        return res.status(400).json({ message: 'Estado inválido. Debe ser PENDIENTE, COMPLETADA o CANCELADA.' });
    }

    try {
        const { data, error } = await updateCitaEstado(id_cita, nuevoEstado);
        if (error) throw error;

        res.status(200).json({ message: 'Estado actualizado con éxito', cita: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const UpdateCitaFecha = async (req, res) => {
    const { id_cita } = req.params;
    const { nuevaFecha, nuevaHoraInicio, nuevaHoraFin } = req.body;

    // Validación básica
    if (!nuevaFecha || !nuevaHoraInicio || !nuevaHoraFin) {
        return res.status(400).json({ message: 'Debe proporcionar nueva fecha, hora de inicio y hora de fin.' });
    }

    try {
        const { data, error } = await updateCitaFecha(id_cita, nuevaFecha, nuevaHoraInicio, nuevaHoraFin);
        if (error) throw error;

        res.status(200).json({ message: 'Fecha actualizada con éxito', cita: data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

