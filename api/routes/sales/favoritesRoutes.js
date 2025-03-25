import express from "express";
import { addFavorite, removeFavorite, getFavorites } from "../../controllers/sales/favoritesController.js";

const router = express.Router();

router.post("/", addFavorite);
router.delete("/", removeFavorite);
router.get("/:id_usuario", getFavorites);

export default router;
