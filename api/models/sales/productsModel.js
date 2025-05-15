import { supabase } from "../../config/supabaseClient.js";

// Obtener todos los productos
export const getAllProducts = async () => {
    const { data, error } = await supabase
        .from("productos")
        .select(`
            id_producto,
            nombre,
            descripcion,
            marca,
            precio,
            contenido,
            categoria,
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
            descripcion,
            marca,
            precio,
            contenido,
            categoria,
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
        .maybeSingle();

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

export const actualizarStockProducto = async (id_producto, cantidadVendida) => {
    // Obtener el producto actual para verificar el stock disponible
    const { data: producto, error: errorProducto } = await supabase
        .from('productos')
        .select('stock')
        .eq('id_producto', id_producto)
        .single();
    
    if (errorProducto) throw errorProducto;

    // Verificar si hay suficiente stock disponible
    if (producto.stock < cantidadVendida) {
        throw new Error(`Stock insuficiente para el producto con ID ${id_producto}`);
    }

    // Calcular el nuevo stock
    const nuevoStock = producto.stock - cantidadVendida;

    // Actualizar el stock del producto
    const { data, error } = await supabase
        .from('productos')
        .update({ stock: nuevoStock })
        .eq('id_producto', id_producto);

    if (error) throw error;

    return data;
};

// Eliminar un producto
export const deleteProduct = async (id_producto) => {
  try {
    const folderPath = `productos/${id_producto}`;

    // Lista las imágenes asociadas al producto
    const { data: files, error: listError } = await supabase
      .storage
      .from("imagenes") // Nombre del bucket
      .list(folderPath, { limit: 100 });

    if (listError) {
      throw new Error("Error al listar las imágenes: " + listError.message);
    }

    // Verifica si hay archivos para eliminar
    if (files.length > 0) {
      const filePaths = files.map((file) => `${folderPath}/${file.name}`);
      // Elimina las imágenes del bucket
      const { error: removeError } = await supabase
        .storage
        .from("imagenes") // Nombre del bucket
        .remove(filePaths);

      if (removeError) {
        throw new Error("Error al eliminar las imágenes: " + removeError.message);
      }
    }

    // Elimina el producto de la base de datos
    const { data, error } = await supabase
        .from("productos")
        .delete()
        .eq("id_producto", id_producto);
    if (error) throw error;
    return data;

  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const deleteImage = async (filePath) => {
    try {

        // Obtener el ID de la imagen desde la base de datos
        const id_imagen = await getImageIdByPartialUrl(filePath);

        if (id_imagen) {
            // Eliminar el registro de la tabla
            const { data, error } = await supabase
                .from("imagenes_productos")
                .delete()
                .eq("id_imagen", id_imagen);

            if (error) {
                throw error;
            }

        }

        const decodedFilePath = decodeURIComponent(filePath);

        // Eliminar el archivo del bucket
        const { data: dataStorage, error: errorStorage } = await supabase.storage
            .from("imagenes") // Nombre del bucket
            .remove([decodedFilePath]); // Pasar el path codificado tal como está

        if (errorStorage) {
            throw errorStorage;
        }

        return dataStorage;
    } catch (error) {
        throw error;
    }
};


const getImageIdByPartialUrl = async (filePath) => {
    try {
        const { data, error } = await supabase
            .from("imagenes_productos")
            .select("id_imagen")
            .like("imagen_url", `%${filePath}%`); // Usa el filePath codificado directamente

        if (error) {
            throw error;
        }

        if (!data || data.length === 0) {
            console.log("No se encontró un registro en la base de datos con el filepath:", filePath);
            return null;
        }

        return data[0].id_imagen; // Devuelve el primer resultado encontrado
    } catch (error) {
        console.error("Error al buscar el ID de la imagen:", error.message);
        return null;
    }
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
