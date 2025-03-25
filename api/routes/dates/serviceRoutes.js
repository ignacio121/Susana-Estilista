import express from 'express';
import multer from "multer";
import { authenticateToken } from '../../middlewares/authMiddleware.js';
import { AddService, editService, GetServices, deleteService, GetServiceByName, addServiceImage } from '../../controllers/dates/serviceController.js';

const router = express.Router();
const upload = multer(); // Configura multer para manejar archivos


// Rutas para los servicios
router.get('/', authenticateToken, GetServices);
router.get('/:nombre', authenticateToken, GetServiceByName);
router.post('/', authenticateToken, AddService);
router.put('/:nombre', authenticateToken, editService);
router.delete('/:nombre', authenticateToken, deleteService); // Ruta para eliminar un servicio
router.post("/:id_servicio/images", upload.single("image"), authenticateToken, addServiceImage);


export default router;
