import { supabase } from '../../config/supabaseClient.js';

export const findCites = async () => {
    const { data, error } = await supabase
        .from('citas')
        .select(`
            id_cita,
            fecha,
            hora_inicio,
            hora_fin,
            estado,
            comentarios,
            fecha_creacion,
            nombre_cliente,
            telefono_cliente,
            cliente:usuarios!id_cliente (nombre, email, telefono, informacion_personal (
                direccion,
                fecha_nacimiento,
                genero,
                nacionalidad
            )),
            empleado:usuarios!id_empleado (nombre, email, telefono),
            servicio:servicios (nombre, descripcion, precio, duracion)
        `);
    if (error) throw error;
    return data;
};

export const findCitesByEmployee = async (id_empleado) => {
    // Consultar citas por el nombre del cliente
    const { data, error } = await supabase
        .from('citas')
        .select(`
            id_cita,
            fecha,
            hora_inicio,
            hora_fin,
            estado,
            comentarios,
            fecha_creacion,
            nombre_cliente,
            telefono_cliente,
            cliente:usuarios!id_cliente (nombre, email, telefono, rol),
            empleado:usuarios!id_empleado (nombre, email, telefono, rol),
            servicio:servicios (nombre, descripcion, precio, duracion)
        `)
        .eq('id_empleado',id_empleado);
    if (error) throw error;
    return data;
};

export const findCitesByClient = async (id_cliente) => {
    // Consultar citas por el nombre del cliente
    const { data, error } = await supabase
        .from('citas')
        .select(`
            id_cita,
            fecha,
            hora_inicio,
            hora_fin,
            estado,
            comentarios,
            fecha_creacion,
            nombre_cliente,
            telefono_cliente,
            cliente:usuarios!id_cliente (nombre, email, telefono, rol),
            empleado:usuarios!id_empleado (nombre, email, telefono, rol),
            servicio:servicios (nombre, descripcion, precio, duracion)
        `)
        .eq('id_cliente',id_cliente);
    if (error) throw error;
    return data;
};

export const insertCita = async (citeInfo) => {
    const { data, error } = await supabase
        .from('citas')
        .insert([citeInfo])
    return { data, error };
};

export const updateCitaEstado = async (id_cita, nuevoEstado) => {
    const { data, error } = await supabase
        .from('citas')
        .update({ estado: nuevoEstado })
        .eq('id_cita', id_cita);
    return { data, error };
};

export const updateCitaFecha = async (id_cita, nuevaFecha, nuevaHoraInicio, nuevaHoraFin) => {
    const { data, error } = await supabase
        .from('citas')
        .update({ fecha: nuevaFecha, hora_inicio: nuevaHoraInicio, hora_fin: nuevaHoraFin })
        .eq('id_cita', id_cita);
    return { data, error };
};
