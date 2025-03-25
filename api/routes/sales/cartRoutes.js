import express from "express";
import { handleAddToCart, handleUpdateQuantity, handleRemoveFromCart, handleGetCartByUser } from "../../controllers/sales/cartCotroller.js";

const router = express.Router();

// Ruta para agregar producto al carrito
router.post("/add", handleAddToCart);

// Ruta para actualizar la cantidad de un producto
router.put("/update", handleUpdateQuantity);

// Ruta para eliminar un producto del carrito
router.delete("/remove", handleRemoveFromCart);

// Ruta para obtener el carrito de un usuario
router.get("/:id_usuario", handleGetCartByUser);

export default router;
