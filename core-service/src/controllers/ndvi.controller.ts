import { type Request, type Response } from 'express';
import { subirImagenCloudinary } from '../cloudinary/uploadService.js';
import { prisma } from '../../lib/prisma.js';



export const guardarRegistroNDVI = async (req: Request, res: Response) => {
    try {
        const { parcelaId, ndvi_promedio, ndvi_minimo, ndvi_maximo, ndvi_mediana } = req.body;

        if (!parcelaId || !ndvi_promedio || !req.file) {
            return res.status(400).json({
                success: false,
                message: 'Faltan campos requeridos: parcelaId, ndvi_promedio, imagen'
            });
        }

        // 1. Subir imagen a Cloudinary
        const imagen_url = await subirImagenCloudinary(req.file.buffer, 'ndvi_registros');

        // 2. Crear registro en la base de datos
        const registro = await prisma.registroMultiespectral.create({
            data: {
                parcelaId,
                ndvi_promedio: parseFloat(ndvi_promedio),
                imagen_url,
                datos_extra: {
                    ndvi_minimo: parseFloat(ndvi_minimo ?? 0),
                    ndvi_maximo: parseFloat(ndvi_maximo ?? 0),
                    ndvi_mediana: parseFloat(ndvi_mediana ?? 0),
                }
            }
        });

        return res.status(201).json({
            success: true,
            data: registro
        });

    } catch (error) {
        console.error('Error guardando registro NDVI:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno al guardar el registro'
        });
    }
};
