import express from "express";
import { handleAddToCart, handleUpdateQuantity, handleRemoveFromCart, handleGetCartByUser, handleCleanCart } from "../../controllers/sales/cartCotroller.js";
import { authenticateToken } from '../../middlewares/authMiddleware.js';

const router = express.Router();

// Ruta para agregar producto al carrito
router.post("/add", authenticateToken, handleAddToCart);

// Ruta para actualizar la cantidad de un producto
router.put("/update", authenticateToken, handleUpdateQuantity);

// Ruta para eliminar un producto del carrito
router.delete("/remove", authenticateToken, handleRemoveFromCart);

// Ruta para obtener el carrito de un usuario
router.get("/:id_usuario", authenticateToken, handleGetCartByUser);

router.delete("/clean/:id_usuario", authenticateToken, handleCleanCart);

export default router;
