import { Router } from "express";
import multer from "multer";
import { verificarToken } from "../middlewares/auth.middleware.js";
import { guardarRegistroNDVI } from "../controllers/ndvi.controller.js";


const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/guardar', verificarToken, upload.single('imagen'), guardarRegistroNDVI);


export default router;