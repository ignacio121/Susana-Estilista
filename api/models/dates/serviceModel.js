import { supabase } from "../../config/supabaseClient.js";

export const findServices = async () => {
    const { data, error } = await supabase
        .from('servicios')
        .select('*');
    if (error) throw error;
    return data;
};

export const findServiceByName = async (name) => {
    const { data, error } = await supabase
        .from('servicios')
        .select('*')
        .eq('nombre', name)
        .maybeSingle();

    if (error) throw error;
    return data;
};

export const insertService = async (serviceInfo) => {
    const { data, error } = await supabase
        .from('servicios')
        .insert([serviceInfo]);
    if (error) throw error;
    return data;
};

export const updateService = async (service, serviceInfo) => {
    const { data, error } = await supabase
        .from('servicios')
        .update(serviceInfo)
        .eq('nombre', service);
    if (error) throw error;
    return data;
};

export const deleteServiceByName = async (name) => {
    const { data, error } = await supabase
        .from('servicios')
        .delete()
        .eq('nombre', name);
    if (error) throw error;
    return data;
};


// Subir imágenes a Supabase
export const uploadServiceImage = async (file, id_servicio) => {
    // Subir el archivo al bucket
    const { data: uploadData, error: uploadError } = await supabase.storage
        .from("imagenes") // Nombre del bucket
        .upload(`servicios/${id_servicio}/${file.originalname}`, file.buffer, {
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

    // Actualizar la URL de la imagen en la tabla de servicios
    const { data: serviceData, error: serviceError } = await supabase
        .from("servicios")
        .update({ url_image: publicUrl })
        .eq("id_servicio", id_servicio);

    if (serviceError) throw serviceError;

    return serviceData;
};
