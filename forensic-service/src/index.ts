import express, { type Request, type Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose'; // <-- Faltaba esto
import 'dotenv/config';
import { LogForense } from './models/LogForense'; // <-- Faltaba tu modelo

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27018/agroai_forensics?directConnection=true';

mongoose.connect(MONGO_URI)
    .then(() => console.log('[AgroAI-Forense] Conectado al Clúster de MongoDB 🍃'))
    .catch(err => console.error('[AgroAI-Forense] Error de conexión:', err));
app.post('/api/logs', async (req: Request, res: Response): Promise<void> => {
    try {
        const data = req.body;
        
        // Cumpliendo el requerimiento: Usar UTC y formato ISO 8601
        const timestampISO = new Date().toISOString();

        // 2. CREAR EL DOCUMENTO USANDO MONGOOSE (Antes era un objeto JavaScript normal)
        const nuevoLog = new LogForense({
            ...data,
            timestamp_iso: timestampISO
        });

        // 3. LA MAGIA: Guardar el documento en la base de datos de MongoDB
        await nuevoLog.save();

        console.log(`[Log Guardado] ${nuevoLog.evento} | ${nuevoLog.resultado} | ${timestampISO}`);
        
        res.status(201).json({
            mensaje: 'Evidencia guardada y firmada criptográficamente',
            id: nuevoLog._id,
            // Al usar .save(), el middleware que hicimos genera automáticamente esta firma
            firma: nuevoLog.firma_digital 
        });

    } catch (error) {
        console.error('Error al guardar evidencia forense:', error);
        res.status(500).json({ mensaje: 'Error interno al registrar evidencia' });
    }
});

app.listen(PORT, '0.0.0.0', () => { 
    console.log('Servidor forense escuchando en todos los frentes');
})