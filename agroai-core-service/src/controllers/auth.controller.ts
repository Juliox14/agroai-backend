import { type Request, type Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../lib/prisma.js';

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
