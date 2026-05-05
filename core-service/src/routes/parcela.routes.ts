import { Router } from "express";
import multer from "multer";
import { obtenerParcelas, crearParcela, obtenerParcelaDetalle, obtenerEstadisticas } from "../controllers/parcela.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', verificarToken, obtenerParcelas);
router.post('/', verificarToken, upload.single('imagen'), crearParcela);
router.post('/', verificarToken, crearParcela);
router.get('/:id/estadisticas', verificarToken, obtenerEstadisticas);
router.get('/:id', verificarToken, obtenerParcelaDetalle);

export default router;