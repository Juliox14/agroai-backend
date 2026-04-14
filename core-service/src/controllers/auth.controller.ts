import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { prisma } from '../../lib/prisma.js';
import { type AuthRequest } from '../middlewares/auth.middleware.js';
import { ForensicLogger } from '../services/forensic.service.js';

export const registrarUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { nombre, email, password } = req.body;

        if (!nombre || !email || !password) {
            res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
            return;
        }

        const usuarioExistente = await prisma.usuario.findUnique({ where: { email } });

        if (usuarioExistente) {
            res.status(409).json({ mensaje: 'El correo ya está registrado' });
            return;
        }

        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);

        const nuevoUsuario = await prisma.usuario.create({
            data: {
                nombre,
                email,
                password_hash: passwordHash
            }
        });

        await ForensicLogger.registrar(
            'CREACION_USUARIO', 
            'EXITO', 
            nuevoUsuario.id.toString(), 
            req.ip || '0.0.0.0', 
            `${nuevoUsuario.id}|${nuevoUsuario.email}|${nuevoUsuario.nombre}`
        );

        res.status(201).json({
            mensaje: 'Usuario registrado exitosamente',
            usuario:
            {
                id: nuevoUsuario.id,
                nombre: nuevoUsuario.nombre,
                email: nuevoUsuario.email
            }
        });


    } catch (error) {
        console.error('Error al registrar usuario:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};


export const loginUsuario = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
            return;
        }

        const usuario = await prisma.usuario.findUnique({ where: { email } });

        if (!usuario) {
            // 🔴 REPORTE DE ERROR (Usuario falso)
            await ForensicLogger.registrar('LOGIN', 'ERROR', 'DESCONOCIDO', req.ip || '0.0.0.0', `${email}|FALLO_USUARIO_NO_EXISTE`);
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }

        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            // REPORTE DE ERROR (Contraseña incorrecta)
            await ForensicLogger.registrar('LOGIN', 'ERROR', usuario.id.toString(), req.ip || '0.0.0.0', `${usuario.id}|${email}|FALLO_PASSWORD`);
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
            return;
        }

        const token = jwt.sign({ id: usuario.id, email: usuario.email }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '7d' });

        // REPORTE DE ÉXITO
        await ForensicLogger.registrar('LOGIN', 'EXITO', usuario.id.toString(), req.ip || '0.0.0.0', `${usuario.id}|${usuario.email}|LOGIN_EXITOSO`);

        res.status(200).json({
            mensaje: 'Inicio de sesión exitoso',
            token: token,
            user: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
};

export const verificarSesion = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const userId = req.usuario?.id;

        const usuario = await prisma.usuario.findUnique({
            where: { id: userId },
            select: {
                id: true,
                nombre: true,
                email: true
            }
        });

        if (!usuario) {
            res.status(404).json({ mensaje: 'Usuario no encontrado' });
            return;
        }

        res.status(200).json({
            mensaje: 'Sesión válida',
            payload: usuario
        });
    } catch (error) {
        console.error('Error al verificar sesión:', error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }

}