import bcrypt from 'bcrypt';
import { supabase } from '../../config/supabaseClient.js';

export const getUsers = async () => {
    const { data, error } = await supabase
        .from('usuarios')
        .select(`
            id_usuario,
            nombre,
            email,
            telefono,
            rol,
            fecha_creacion,
            informacion_personal (
                direccion,
                fecha_nacimiento,
                genero,
                nacionalidad
            )
        `);

    if (error) throw error;
    return data;
};

export const findUserById = async (id_usuario) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id_usuario', id_usuario)
        .single();
    return { data, error };
};

export const createUser = async (user) => {
    const hashedPassword = await bcrypt.hash(user.contraseña, 10); // Encripta la contraseña
    const { data, error } = await supabase.from('usuarios').insert([
        {
            nombre: user.nombre,
            email: user.email,
            telefono: user.telefono,
            contraseña: hashedPassword,
            rol: user.rol || 'CLIENTE', // Asigna un rol predeterminado si no se proporciona
        },
    ]);
    if (error) throw error;
    return data;
};

export const findUserByEmail = async (email) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .maybeSingle();

    if (error) throw error;
    return data;
};

export const findUserByName = async (name) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select(`
            id_usuario,
            nombre,
            email,
            telefono,
            rol,
            fecha_creacion,
            informacion_personal (
                direccion,
                fecha_nacimiento,
                genero,
                nacionalidad
            )
        `)
        .eq('nombre', name)
        .single();
    return {data,error};
};



export const findUserByRol = async (rol) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select(`
            id_usuario,
            nombre,
            email,
            telefono,
            rol,
            fecha_creacion,
            informacion_personal (
                direccion,
                fecha_nacimiento,
                genero,
                nacionalidad
            )
        `)
        .eq('rol', rol);

    if (error) throw error;
    return data;
};

export const findUserByFone = async (telefono) => {
    const { data, error } = await supabase
        .from('usuarios')
        .select(`
            id_usuario,
            nombre,
            email,
            telefono,
            rol,
            fecha_creacion,
            contraseña,
            informacion_personal (
                direccion,
                fecha_nacimiento,
                genero,
                nacionalidad
            )
        `)
        .eq('telefono', telefono)
        .maybeSingle(); 
    if (error) throw error;
    return data;
};

export const validatePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

export const saveResetToken = async (userId, token) => {
    const { error } = await supabase
        .from('usuarios')
        .update({ reset_token: token })
        .eq('id_usuario', userId);

    if (error) throw error;
};