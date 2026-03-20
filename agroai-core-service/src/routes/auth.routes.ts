import { Router } from "express";
import { registrarUsuario } from "../controllers/auth.controller";

const router = Router();

router.post('/register', registrarUsuario);

export default router;