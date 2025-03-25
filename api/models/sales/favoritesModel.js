import { supabase } from "../../config/supabaseClient.js";

// Agregar un producto a favoritos
export const insertFavorite = async (id_usuario, id_producto) => {
    try {
        const { data, error } = await supabase
            .from("productos_favoritos")
            .insert([{ id_usuario, id_producto }]);

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};

// Eliminar un producto de favoritos
export const deleteFavorite = async (id_usuario, id_producto) => {
    try {
        const { data, error } = await supabase
            .from("productos_favoritos")
            .delete()
            .eq("id_usuario", id_usuario)
            .eq("id_producto", id_producto);

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};

// Obtener los favoritos de un usuario
export const selectFavorites = async (id_usuario) => {
    try {
        const { data, error } = await supabase
            .from("productos_favoritos")
            .select("id_producto, fecha_agregado")
            .eq("id_usuario", id_usuario);

        if (error) throw error;
        return data;
    } catch (error) {
        throw error;
    }
};
