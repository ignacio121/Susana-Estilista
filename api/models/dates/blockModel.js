import { supabase } from "../../config/supabaseClient.js";

export const insertBlock = async (block) => {
    const { data, error } = await supabase.from("bloqueo").insert([block]);
    if (error) throw error;
    return data;
};

export const getBlocksByUser = async (id_usuario) => {
    const { data, error } = await supabase.from("bloqueo").select("*").eq("id_usuario", id_usuario);
    if (error) throw error;
    return data;
};

export const deleteBlock = async (id_bloqueo) => {
    const { data, error } = await supabase.from("bloqueo").delete().eq("id_bloqueo", id_bloqueo);
    if (error) throw error;
    return data;
};
