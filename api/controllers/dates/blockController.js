import { deleteBlock, getBlocksByUser, insertBlock } from "../../models/dates/blockModel.js";

export const AddBlock = async (req, res) => {
    const { id_usuario, fecha, hora_inicio, hora_fin, razon } = req.body;

    try {
        const newBlock = await insertBlock({ id_usuario, fecha, hora_inicio, hora_fin, razon });
        res.status(201).json({ message: "Bloqueo agregado exitosamente", data: newBlock });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const GetBlocks = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const blocks = await getBlocksByUser(id_usuario);
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const DeleteBlock = async (req, res) => {
    const { id_bloqueo } = req.params;

    try {
        await deleteBlock(id_bloqueo);
        res.json({ message: "Bloqueo eliminado exitosamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
