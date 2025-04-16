import { deleteFavorite, insertFavorite, selectFavorites } from "../../models/sales/favoritesModel.js";
import { getProductbyID } from "../../models/sales/productsModel.js";

export const addFavorite = async (req, res) => {
    const { id_usuario, id_producto } = req.body;

    try {
        const product = await getProductbyID(id_producto);
        if (product.length === 0){
            return res.status(404).json({ message: "Producto no encontrado."});
        }

        const data = await insertFavorite(id_usuario, id_producto);
        res.status(201).json({ message: "Producto agregado a favoritos", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const removeFavorite = async (req, res) => {
    const { id_usuario, id_producto } = req.body;

    try {
        const data = await deleteFavorite(id_usuario, id_producto);
        res.status(200).json({ message: "Producto eliminado de favoritos", data });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getFavorites = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const products = await selectFavorites(id_usuario);
        res.status(200).json( products );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
