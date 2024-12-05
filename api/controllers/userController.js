import { getUsers as fetchUsers, createUser as addUser } from '../models/userModel.js';

export const getUsers = async (req, res) => {
    try {
        const users = await fetchUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const createUser = async (req, res) => {
    try {
        const newUser = await addUser(req.body);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
