import { supabase } from '../config/supabaseClient.js';

export const getUsers = async () => {
    const { data, error } = await supabase.from('usuarios').select('*');
    if (error) throw error;
    return data;
};

export const createUser = async (user) => {
    const { data, error } = await supabase.from('usuarios').insert([user]);
    if (error) throw error;
    return data;
};
