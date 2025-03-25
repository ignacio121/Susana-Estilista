import { insertPersonalInfo, findPersonalInfoByUserId } from '../../models/dates/personalInfoModel.js';
import { findUserByName} from '../../models/dates/userModel.js';

export const addPersonalInfo = async (req, res) => {
    const { nombre, direccion, fecha_nacimiento, genero, nacionalidad } = req.body;

    try {
        // Validar que el usuario exista
        const user = await findUserByName(nombre);

        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const id_usuario = user.data.id_usuario;

        // Verificar si ya existe información personal para este usuario
        const { data: existingInfo, error: existingError } = await findPersonalInfoByUserId(id_usuario);

        if (existingError) {
            return res.status(500).json({ message: 'Error al verificar información existente', error: existingError});
        }

        if (existingInfo) {
            return res.status(400).json({ message: 'El usuario ya tiene información personal registrada' });
        }

        // Crear el registro de información personal
        const { data, error } = await insertPersonalInfo({
            id_usuario,
            direccion,
            fecha_nacimiento,
            genero,
            nacionalidad,
        });

        if (error) {
            return res.status(400).json({ message: 'Error al agregar la información personal', error });
        }

        res.status(201).json({ message: 'Información personal agregada exitosamente', data });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error });
    }
};
