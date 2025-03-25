import express from "express";
import { addOrUpdateComment, getCommentsByProduct, removeComment } from "../../controllers/sales/commentsController.js";

const router = express.Router();

router.post("/", addOrUpdateComment);
router.get("/:id_producto", getCommentsByProduct);
router.delete("/", removeComment);

export default router;
