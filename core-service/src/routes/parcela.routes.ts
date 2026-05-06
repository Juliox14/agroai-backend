import { Router } from "express";
import multer from "multer";
import { obtenerParcelas, crearParcela, actualizarParcela, obtenerParcelaDetalle, obtenerEstadisticas, eliminarParcela } from "../controllers/parcela.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/',                  verificarToken, obtenerParcelas);
router.post('/',                 verificarToken, upload.single('imagen'), crearParcela);
router.get('/:id/estadisticas',  verificarToken, obtenerEstadisticas);
router.get('/:id',               verificarToken, obtenerParcelaDetalle);
router.patch('/:id',             verificarToken, upload.single('imagen'), actualizarParcela);
router.delete('/:id',            verificarToken, eliminarParcela);

export default router;