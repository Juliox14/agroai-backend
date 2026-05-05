import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config';
import { LogForense } from './models/LogForense';
import path from 'path';

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// 1. Servir archivos estáticos (aquí vivirá nuestra página web)
app.use(express.static(path.join(__dirname, '../public')));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/agroai_forensics?directConnection=true';

mongoose.connect(MONGO_URI)
    .then(() => console.log('[AgroAI-Forense] Conectado al Clúster de MongoDB 🍃'))
    .catch(err => console.error('[AgroAI-Forense] Error de conexión:', err));

// 2. Nueva ruta para el Dashboard: Obtiene todos los logs ordenados por fecha
app.get('/api/logs', async (_req: Request, res: Response) => {
    try {
        const logs = await LogForense.find().sort({ timestamp_iso: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener registros' });
    }
});

app.post('/api/logs', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        const timestampISO = new Date().toISOString();

        const nuevoLog = new LogForense({
            ...data,
            timestamp_iso: timestampISO
        });

        await nuevoLog.save();
        
        res.status(201).json({
            mensaje: 'Evidencia guardada y firmada',
            id: nuevoLog._id,
            firma: nuevoLog.firma_digital 
        });

    } catch (error) {
        res.status(500).json({ mensaje: 'Error interno' });
    }
});

app.listen(PORT, '0.0.0.0', () => { 
    console.log(`[AgroAI-Forense] Dashboard disponible en http://localhost:${PORT}`);
});