import express from "express";
import { createTransaction, getTransaction, refundTransaction } from "../../controllers/sales/transbankController.js";

const router = express.Router();

router.post("/create", createTransaction);
router.post("/commit", getTransaction);
router.post("/refund", refundTransaction);

export default router;

