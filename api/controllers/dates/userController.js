import { createUser as addUser, getUsers as fetchUsers, findUserByName, findUserByRol } from '../../models/dates/userModel.js';

export const getUsers = async (req, res) => {
    try {
        const users = await fetchUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUser = async (req, res) => {
    const { name } = req.params;

    try {
        const {data:user} = await findUserByName(name);
        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const getUsersByRol = async (req, res) => {
    const { rol } = req.params;

    try {
        const users = await findUserByRol(rol);
        if (!users) {
            return res.status(401).json({ message: 'Usuarios no encontrado' });
        }
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createUser = async (req, res) => {
    try {
        const { nombre, email, telefono, contraseña, rol } = req.body;
        if (!email || !contraseña) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios.' });
        }
        const newUser = await addUser({ nombre, email, telefono, contraseña, rol });
        res.status(201).json({ message: 'Usuario creado exitosamente'});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

