import express from "express";
import { AddBlock, GetBlocks, DeleteBlock } from "../../controllers/dates/blockController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas para bloqueos
router.post("/", authenticateToken, AddBlock);
router.get("/:id_usuario", authenticateToken, GetBlocks);
router.delete("/:id_bloqueo", authenticateToken, DeleteBlock);

export default router;
