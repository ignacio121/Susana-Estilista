import { supabase } from "../../config/supabaseClient.js";

// Obtener todos los productos
export const getAllProducts = async () => {
    const { data, error } = await supabase
        .from("productos")
        .select(`
            id_producto,
            nombre,
            marca,
            precio,
            contenido,
            stock,
            fecha_creacion,
            habilitado,
            detalles_productos (
                beneficios,
                enfoque,
                uso,
                ingredientes
            ),
            imagenes_productos (
                imagen_url,
                descripcion
            )
        `);

    if (error) throw error;
    return data;
};

// Obtener producto por id
export const getProductbyID = async (id_producto) => {
    const { data, error } = await supabase
        .from("productos")
        .select(`
            id_producto,
            nombre,
            marca,
            precio,
            contenido,
            stock,
            fecha_creacion,
            habilitado,
            detalles_productos (
                beneficios,
                enfoque,
                uso,
                ingredientes
            ),
            imagenes_productos (
                imagen_url,
                descripcion
            )
        `)
        .eq('id_producto', id_producto);

    if (error) throw error;
    return data;
};


// Crear producto
export const addProduct = async (product) => {
    const { data, error } = await supabase
        .from('productos')
        .insert([product])
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Crear detalles del producto
export const createProductDetails = async (details) => {
    const { data, error } = await supabase
        .from('detalles_productos')
        .insert([details]);

    if (error) throw error;
    return data;
};

// Editar un producto
export const updateProduct = async (id_producto, productData) => {
    const { data, error } = await supabase
        .from('productos')
        .update(productData)
        .eq('id_producto', id_producto)
        .select()
        .single();

    if (error) throw error;
    return data;
};

// Editar detalles del producto
export const updateProductDetails = async (id_producto, detailsData) => {
    const { data, error } = await supabase
        .from('detalles_productos')
        .update(detailsData)
        .eq('id_producto', id_producto);
        
    if (error) throw error;
    return data;
};

// Eliminar un producto
export const deleteProduct = async (id_producto) => {
    const { data, error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", id_producto);
    if (error) throw error;
    return data;
};

// Subir imágenes a Supabase
export const uploadImage = async (file, id_producto) => {
    // Subir el archivo al bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("imagenes") // Nombre del bucket
        .upload(`productos/${id_producto}/${file.originalname}`, file.buffer, {
            contentType: file.mimetype,
        });

    if (uploadError) throw uploadError;

    // Generar la URL pública del archivo
    const publicUrlResponse = supabase.storage
        .from("imagenes")
        .getPublicUrl(uploadData.path);

    const publicUrl = publicUrlResponse.data.publicUrl; // Extrae la URL pública

    if (!publicUrl) {
        throw new Error("No se pudo generar la URL pública para la imagen.");
    }

    // Insertar el registro en la base de datos
    const { data: imageData, error: imageError } = await supabase
        .from("imagenes_productos")
        .insert([
            {
                id_producto,
                imagen_url: publicUrl,
                descripcion: file.description || null,
            },
        ]);

    if (imageError) throw imageError;

    return imageData;
};
