import express from "express";
import multer from "multer";
import {
    fetchProducts,
    createProduct,
    editProduct,
    removeProduct,
    addImage,
} from "../../controllers/sales/productsController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();
const upload = multer(); // Middleware para manejar archivos

// Obtener todos los productos
router.get("/", fetchProducts);

// Crear un producto
router.post("/", authenticateToken, createProduct);

// Editar un producto
router.put("/:id_producto", authenticateToken, editProduct);

// Eliminar un producto
router.delete("/:id_producto", authenticateToken, removeProduct);

// Subir imágenes
router.post("/:id_producto/images", upload.single("image"), addImage);

export default router;
