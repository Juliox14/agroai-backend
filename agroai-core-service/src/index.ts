import express, { type Request, type Response } from 'express'; // <-- Nota el 'type' aquí
import cors from 'cors';
import 'dotenv/config'; 
import { prisma } from '../lib/prisma.js';
import authRoutes from './routes/auth.routes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/api/health', async (req: Request, res: Response) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ 
      estado: 'Activo', 
      mensaje: 'Servidor AgroAI Core y Base de Datos (V7) funcionando correctamente. 🚀' 
    });
  } catch (error) {
    res.status(500).json({ estado: 'Error', error });
  }
});

app.use('api/auth', authRoutes)

app.listen(PORT, () => {
  console.log(`[AgroAI-Core] Servidor corriendo en http://localhost:${PORT}`);
});

