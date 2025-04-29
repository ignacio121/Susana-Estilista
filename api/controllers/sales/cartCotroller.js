import { addToCart, updateCartQuantity, removeFromCart, getCartByUser, cleanCart } from "../../models/sales/cartModel.js";

// Agregar producto al carrito
export const handleAddToCart = async (req, res) => {
    const { id_usuario, id_producto, cantidad } = req.body;

    try {
        const data = await addToCart(id_usuario, id_producto, cantidad);
        res.status(201).json({ message: "Producto agregado al carrito con exito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Actualizar cantidad
export const handleUpdateQuantity = async (req, res) => {
    const { id_usuario, id_producto, cantidad } = req.body;

    try {
        const data = await updateCartQuantity(id_usuario, id_producto, cantidad);
        res.status(200).json({ message: "Cantidad actualizada con exito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Eliminar producto
export const handleRemoveFromCart = async (req, res) => {
    const { id_usuario, id_producto } = req.body;

    try {
        const data = await removeFromCart(id_usuario, id_producto);
        res.status(200).json({ message: "Producto eliminado del carrito con exito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Obtener carrito por usuario
export const handleGetCartByUser = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const data = await getCartByUser(id_usuario);
        res.status(200).json( data );
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const handleCleanCart = async (req, res) => {
    const { id_usuario } = req.params;

    try {
        const data = await cleanCart(id_usuario);
        res.status(200).json({ message: "Carrito limpiado con exito" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
