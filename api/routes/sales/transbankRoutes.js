import express from "express";
import { createTransaction, getTransaction } from "../../controllers/sales/transbankController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.post("/commit",getTransaction);

export default router;

