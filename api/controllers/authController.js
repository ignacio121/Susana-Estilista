import jwt from 'jsonwebtoken';
import { findUserByEmail, findUserByFone, validatePassword } from '../models/userModel.js';

export const loginUser = async (req, res) => {
    const { emailOrPhone, password } = req.body;

    try {
        // Buscar usuario por email o teléfono
        let user;
        if (emailOrPhone.includes('@')) {
            // Si es un email
            user = await findUserByEmail(emailOrPhone);
        } else {
            // Si es un número de teléfono
            user = await findUserByFone(emailOrPhone);
        }

        // Verificar que se obtuvo un único usuario
        if (!user || Array.isArray(user) && user.length === 0) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        if (!password || !user.contraseña) {
            return res.status(400).json({ message: 'Faltan datos para validar la contraseña'});
        }

        // Validar la contraseña
        const isPasswordValid = await validatePassword(password, user.contraseña);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // Generar el token JWT
        const token = jwt.sign(
            {
                id_usuario: user.id_usuario,
                rol: user.rol,
                email: user.email,
            },
            process.env.JWT_SECRET,
            //{ expiresIn: '1h' } // El token expira en 1 hora
        );

        // Devolver el token al cliente
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
