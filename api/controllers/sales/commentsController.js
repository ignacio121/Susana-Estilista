import { deleteComment, insertOrUpdateComment, selectCommentsByProduct } from "../../models/sales/commentsModel.js";


export const addOrUpdateComment = async (req, res) => {
    const { id_usuario, id_producto, estrellas, comentario } = req.body;

    try {
        const data = await insertOrUpdateComment(id_usuario, id_producto, estrellas, comentario);
        res.status(201).json({ message: "Comentario agregado o actualizado", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getCommentsByProduct = async (req, res) => {
    const { id_producto } = req.params;

    try {
        const data = await selectCommentsByProduct(id_producto);
        res.status(200).json({ data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeComment = async (req, res) => {
    const { id_usuario, id_producto } = req.body;

    try {
        const data = await deleteComment(id_usuario, id_producto);
        res.status(200).json({ message: "Comentario eliminado", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
