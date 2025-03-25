import express from "express";
import { AddWorkSchedule, GetWorkSchedule, DeleteWorkSchedule } from "../../controllers/dates/scheduleController.js";
import { authenticateToken } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Rutas para horarios
router.post("/", authenticateToken, AddWorkSchedule);
router.get("/:id_usuario", authenticateToken, GetWorkSchedule);
router.delete("/:id_horario", authenticateToken, DeleteWorkSchedule);

export default router;
