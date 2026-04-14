import { Router } from "express";
import { registrarUsuario, loginUsuario, verificarSesion } from "../controllers/auth.controller.js"
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.post('/register', registrarUsuario);

router.post('/login', loginUsuario);

router.get('/', verificarToken, verificarSesion);

export default router;