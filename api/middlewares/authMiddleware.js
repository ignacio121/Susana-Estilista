import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Acceso denegado: Token no proporcionado.' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Token inválido.' });
        req.user = user;
        next();
    });
};

export const generateToken = (user) => {
    return jwt.sign({ id_usuario: user.id_usuario, rol: user.rol }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
};

export const generateResetToken = (user) => {
    return jwt.sign(
        { id_usuario: user.id_usuario, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "15m" } 
    );
};

export const verifyResetToken = async (token) => {
   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { data: user, error } = await supabase
        .from("usuarios")
        .select("id_usuario, email")
        .eq("id_usuario", decoded.id_usuario)
        .eq("reset_token", token)
        .single();

    if (error || !user) {
        throw new Error("Token inválido o expirado", error, user);
    }

    return user;

};