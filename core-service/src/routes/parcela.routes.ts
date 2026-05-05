import { Router } from "express";
import { obtenerParcelas, crearParcela, obtenerParcelaDetalle, actualizarParcela } from "../controllers/parcela.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";


const router = Router();

router.get('/', verificarToken, obtenerParcelas);
router.post('/', verificarToken, crearParcela);
router.get('/:id', verificarToken, obtenerParcelaDetalle);
router.patch('/:id', verificarToken, actualizarParcela);

export default router;