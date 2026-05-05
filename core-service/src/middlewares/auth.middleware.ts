import { type Request, type Response, type NextFunction } from "express";
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
    usuario?: {
        id: string;
        email: string;
    };
}

export const verificarToken = (req: AuthRequest, res: Response, next: NextFunction): void => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        res.status(401).json({ mensaje: 'Token no proporcionado' });
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AuthRequest['usuario'];      
        req.usuario = payload;
        next();
    } catch (error) {
        res.status(403).json({ mensaje: 'Acceso denegado: Token inválido' });
    }
};