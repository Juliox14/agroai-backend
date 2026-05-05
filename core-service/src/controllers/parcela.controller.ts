import { Request, Response } from 'express';
import { prisma } from '../../lib/prisma.js';
import { AuthRequest } from '../middlewares/auth.middleware.js';

type AuthenticatedRequest = Request & {
    usuario?: {
        id: number;
    };
};

export const obtenerParcelas = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const usuarioId = req.usuario?.id;

        const parcelas = await prisma.parcela.findMany({
            where: { usuarioId: usuarioId },
            orderBy: { fecha_siembra: 'desc' }
        });

        res.status(200).json({ success: true, data: parcelas });
    } catch (error) {
        console.error('Error al obtener parcelas:', error);
        res.status(500).json({ success: false, message: 'Error al obtener parcelas' });
    }
};

export const obtenerParcelaDetalle = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const parcela = await prisma.parcela.findUnique({
      where: { id: id },
      include: {
        registros: {
          orderBy: { fecha_captura: 'desc' }
        }
      }
    });

    if (!parcela) {
      return res.status(404).json({ success: false, message: 'Parcela no encontrada' });
    }

    res.status(200).json({ success: true, data: parcela });
  } catch (error) {
    console.error('Error al obtener detalle:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
};

export const crearParcela = async (req: AuthRequest, res: Response) => {
  try {
    
    const usuarioId = req.usuario?.id;
    console.log(`Usuario ID desde el token: ${usuarioId}`);

    if (!usuarioId) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    const { 
      nombre, 
      comunidad_ejido, 
      area_metros_cuadrados, 
      tipo_sistema, 
      cultivos_asociados, 
      tipo_riego, 
      fecha_siembra 
    } = req.body;

    const nuevaParcela = await prisma.parcela.create({
      data: {
        nombre,
        comunidad_ejido,
        area_metros_cuadrados,
        tipo_sistema,
        cultivos_asociados,
        tipo_riego: tipo_riego || "Temporal",
        fecha_siembra: fecha_siembra ? new Date(fecha_siembra) : null,
        usuarioId: usuarioId
      }
    });

    res.status(201).json({ success: true, data: nuevaParcela });
  } catch (error) {
    console.error('Error al crear parcela:', error);
    res.status(500).json({ success: false, message: 'Error al guardar la parcela' });
  }
};

export const actualizarParcela = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario?.id;

    if (!usuarioId) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }

    // Verificar que la parcela pertenece al usuario
    const parcela = await prisma.parcela.findUnique({
      where: { id }
    });

    if (!parcela) {
      return res.status(404).json({ success: false, message: 'Parcela no encontrada' });
    }

    if (parcela.usuarioId !== usuarioId) {
      return res.status(403).json({ success: false, message: 'No tienes permiso para editar esta parcela' });
    }

    const {
      nombre,
      comunidad_ejido,
      area_metros_cuadrados,
      tipo_sistema,
      cultivos_asociados,
      tipo_riego,
      fecha_siembra,
    } = req.body;

    const parcelaActualizada = await prisma.parcela.update({
      where: { id },
      data: {
        ...(nombre              && { nombre }),
        ...(comunidad_ejido     && { comunidad_ejido }),
        ...(area_metros_cuadrados !== undefined && { area_metros_cuadrados: area_metros_cuadrados ? parseFloat(area_metros_cuadrados) : null }),
        ...(tipo_sistema        && { tipo_sistema }),
        ...(cultivos_asociados  && { cultivos_asociados }),
        ...(tipo_riego          && { tipo_riego }),
        ...(fecha_siembra       && { fecha_siembra: new Date(fecha_siembra) }),
      }
    });

    res.status(200).json({ success: true, data: parcelaActualizada });
  } catch (error) {
    console.error('Error al actualizar parcela:', error);
    res.status(500).json({ success: false, message: 'Error al actualizar la parcela' });
  }
};
export const obtenerEstadisticas = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const registros = await prisma.registroMultiespectral.findMany({
      where: { parcelaId: id },
      orderBy: { fecha_captura: 'asc' }
    });

    if (!registros || registros.length === 0) {
      return res.status(200).json({ 
        success: true, 
        data: {
          historial: [],
          ultimo_ndvi: 0,
          progreso: 0,
          total_analisis: 0
        } 
      });
    }

    const total_analisis = registros.length;
    const ultimo_registro = registros[registros.length - 1];
    const ultimo_ndvi = ultimo_registro.ndvi_promedio;
    
    let progreso = 0;
    if (registros.length > 1) {
      const penultimo_registro = registros[registros.length - 2];
      const penultimo_ndvi = penultimo_registro.ndvi_promedio;
      // Calculate percentage change
      if (penultimo_ndvi !== 0) {
        progreso = ((ultimo_ndvi - penultimo_ndvi) / Math.abs(penultimo_ndvi)) * 100;
      }
    }

    res.status(200).json({ 
      success: true, 
      data: {
        historial: registros.map((r: any) => ({
          valor: r.ndvi_promedio,
          fecha: r.fecha_captura
        })),
        ultimo_ndvi: parseFloat(ultimo_ndvi.toFixed(2)),
        progreso: parseFloat(progreso.toFixed(1)),
        total_analisis
      } 
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ success: false, message: 'Error interno del servidor al cargar estadísticas' });
  }
};
