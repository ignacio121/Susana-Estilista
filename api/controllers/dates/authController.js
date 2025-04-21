import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { findUserByEmail, findUserByFone, saveResetToken, validatePassword} from '../../models/dates/userModel.js';
import { supabase } from '../../config/supabaseClient.js';
import { generateResetToken, verifyResetToken } from '../../middlewares/authMiddleware.js';
import { sendResetPasswordEmail } from '../../middlewares/emailService.js';

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
        res.json({ token, user: { id_usuario: user.id_usuario, nombre: user.nombre, email: user.email, rol: user.rol, telefono: user.telefono } });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


export const resetPassword = async (req, res) => {
    const { email } = req.body;
  
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "El email no está registrado" });
      }
  
      // Generar token de restablecimiento
      const token = generateResetToken(user);
      await saveResetToken(user.id_usuario, token);
      
      // Construir enlace de restablecimiento
      const resetLink = `http://peluqueria-susana.cl/reset-password?token=${token}`;
  
      // Enviar correo con Resend
      await sendResetPasswordEmail(email, resetLink);
  
      return res.status(200).json({ message: "Correo de restablecimiento enviado con éxito" });
  
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  };


export const updatePassword = async (req, res) => {
    const { token, newPassword } = req.body;

    try {
        // Verificar si el token es válido y obtener al usuario
        const user = await verifyResetToken(token);

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        
        // Actualizar la contraseña en la base de datos y eliminar el reset_token
        const { error } = await supabase
            .from("usuarios")
            .update({ contraseña: hashedPassword, reset_token: null })
            .eq("id_usuario", user.id_usuario);

        if (error) {
            throw new Error("Error al actualizar la contraseña", error, user);
        }

        return res.status(200).json({ message: "Contraseña actualizada con éxito" });

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }
};