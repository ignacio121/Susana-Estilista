import express from "express";
import { addFavorite, removeFavorite, getFavorites } from "../../controllers/sales/favoritesController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authenticateToken, addFavorite);
router.delete("/", authenticateToken, removeFavorite);
router.get("/:id_usuario", authenticateToken, getFavorites);

export default router;
