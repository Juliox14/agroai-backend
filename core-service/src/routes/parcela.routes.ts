import { Router } from "express";
import { obtenerParcelas, crearParcela, obtenerParcelaDetalle } from "../controllers/parcela.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.get('/', verificarToken, obtenerParcelas);
router.post('/', verificarToken, crearParcela);
router.get('/:id', verificarToken, obtenerParcelaDetalle);

export default router;