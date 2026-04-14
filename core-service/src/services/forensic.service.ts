// src/services/forensic.service.ts
import crypto from 'crypto';

export class ForensicLogger {
    /**
     * Envía un registro inmutable al microservicio de auditoría.
     */
    static async registrar(
        evento: 'LOGIN' | 'CREACION_USUARIO' | 'ELIMINACION_REGISTRO' | 'MODIFICACION_DATOS',
        resultado: 'EXITO' | 'ERROR',
        usuario_id: string,
        ip_origen: string,
        datosParaEvidencia: string // El string crudo que usaremos para generar el Hash
    ): Promise<void> {
        try {
            // 1. Generamos el Hash criptográfico de la transacción aquí mismo
            const hashEvidencia = crypto.createHash('sha256').update(datosParaEvidencia).digest('hex');
            
            console.log("INTENTANDO CONECTAR A:", process.env.FORENSIC_SERVICE_URL);
            // 2. Disparamos la petición al microservicio de forma silenciosa
            await fetch(`${process.env.FORENSIC_SERVICE_URL}/api/logs`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    evento,
                    resultado,
                    usuario_id,
                    ip_origen,
                    hash_evidencia: hashEvidencia
                })
            });
        } catch (error) {
            // Si el servidor forense se cae, no rompemos la app principal, solo avisamos en consola
            console.error('[ForensicLogger] No se pudo conectar con el servidor de auditoría.', error);
        }
    }
}