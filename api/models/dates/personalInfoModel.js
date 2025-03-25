import { supabase } from '../../config/supabaseClient.js';

// Crear un registro de información personal
export const insertPersonalInfo = async (personalInfo) => {
    const { data, error } = await supabase
        .from('informacion_personal')
        .insert([personalInfo]);
    return { data, error };
};


export const findPersonalInfoByUserId = async (id_usuario) => {
    const { data, error } = await supabase
        .from('informacion_personal')
        .select('*')
        .eq('id_usuario', id_usuario)
        .maybeSingle(); // Usamos maybeSingle para manejar el caso de 0 filas

    return { data, error };
};
