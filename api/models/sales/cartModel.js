import { supabase } from "../../config/supabaseClient.js";

// Agregar un producto al carrito (con verificación manual)
export const addToCart = async (id_usuario, id_producto, cantidad) => {
    try {
        // Verificar si el producto ya está en el carrito
        const { data: existingItem, error: checkError } = await supabase
            .from("carrito_compras")
            .select("cantidad")
            .eq("id_usuario", id_usuario)
            .eq("id_producto", id_producto)
            .maybeSingle();

        if (checkError && checkError.code !== "PGRST116") {
            // Si ocurre un error diferente a "no rows returned", lanzar el error
            throw checkError;
        }

        if (existingItem) {
            // Si el producto ya existe, actualizar la cantidad
            const { data, error: updateError } = await supabase
                .from("carrito_compras")
                .update({ cantidad: existingItem.cantidad + cantidad })
                .eq("id_usuario", id_usuario)
                .eq("id_producto", id_producto);

            if (updateError) throw updateError;
            return data;
        } else {
            // Si el producto no existe, agregarlo al carrito
            const { data, error: insertError } = await supabase
                .from("carrito_compras")
                .insert([{ id_usuario, id_producto, cantidad }]);

            if (insertError) throw insertError;
            return data;
        }
    } catch (error) {
        throw error;
    }
};

// Actualizar la cantidad de un producto en el carrito
export const updateCartQuantity = async (id_usuario, id_producto, cantidad) => {
    const { data, error } = await supabase
        .from("carrito_compras")
        .update({ cantidad })
        .eq("id_usuario", id_usuario)
        .eq("id_producto", id_producto);

    if (error) throw error;
    return data;
};

// Eliminar un producto del carrito
export const removeFromCart = async (id_usuario, id_producto) => {
    const { data, error } = await supabase
        .from("carrito_compras")
        .delete()
        .eq("id_usuario", id_usuario)
        .eq("id_producto", id_producto);

    if (error) throw error;
    return data;
};

// Obtener todos los productos del carrito de un usuario
export const getCartByUser = async (id_usuario) => {
    const { data, error } = await supabase
        .from("carrito_compras")
        .select("id_producto, cantidad, productos(nombre, precio, marca, imagenes_productos (imagen_url))")
        .eq("id_usuario", id_usuario);

    if (error) throw error;
    return data;
};
