import { supabase } from "../../config/supabaseClient.js";

export const insertWorkSchedule = async (schedule) => {
    const { data, error } = await supabase.from("horarios_trabajo").insert([schedule]);
    if (error) throw error;
    return data;
};

export const getWorkScheduleByUser = async (id_usuario) => {
    const { data, error } = await supabase
        .from("horarios_trabajo")
        .select("*")
        .eq("id_usuario", id_usuario);
    if (error) throw error;
    return data;
};

export const deleteWorkSchedule = async (id_horario) => {
    const { data, error } = await supabase.from("horarios_trabajo").delete().eq("id_horario", id_horario);
    if (error) throw error;
    return data;
};
