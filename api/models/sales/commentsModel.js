import { supabase } from "../../config/supabaseClient.js";

// Agregar o actualizar un comentario
export const insertOrUpdateComment = async (id_usuario, id_producto, estrellas, comentario) => {
    try {
        // Verificar si el comentario ya existe
        const { data: existingComment, error: checkError } = await supabase
            .from("comentarios")
            .select("*")
            .eq("id_usuario", id_usuario)
            .eq("id_producto", id_producto)
            .single();

        if (checkError && checkError.code !== "PGRST116") {
            throw checkError;
        }

        if (existingComment) {
            // Actualizar el comentario existente
            const { data, error } = await supabase
                .from("comentarios")
                .update({ estrellas, comentario })
                .eq("id_usuario", id_usuario)
                .eq("id_producto", id_producto);

            if (error) throw error;
            return data;
        } else {
            // Agregar un nuevo comentario
            const { data, error } = await supabase
                .from("comentarios")
                .insert([{ id_usuario, id_producto, estrellas, comentario }]);

            if (error) throw error;
            return data;
        }
    } catch (error) {
        throw error;
    }
};

// Obtener comentarios de un producto
export const selectCommentsByProduct = async (id_producto) => {
    try {
        const { data, error } = await supabase
            .from("comentarios")
            .select("id_usuario, estrellas, comentario, fecha")
            .eq("id_producto", id_producto);

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};

// Eliminar un comentario
export const deleteComment = async (id_usuario, id_producto) => {
    try {
        const { data, error } = await supabase
            .from("comentarios")
            .delete()
            .eq("id_usuario", id_usuario)
            .eq("id_producto", id_producto);

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};
