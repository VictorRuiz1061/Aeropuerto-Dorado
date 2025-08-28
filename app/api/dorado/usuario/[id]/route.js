import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma"; // Note: This path seems incorrect based on the folder structure. It should likely be '@prisma/client'

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/dorado/usuario/{id}:
 *   get:
 *     summary: Obtiene un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario
 *     responses:
 *       200:
 *         description: Detalles del usuario.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function GET (request, {params}) {
    const usuario = await prisma.usuario.findUnique(
        {
            where: {
                id: params.id
            }
        }
    );
    return NextResponse.json(usuario)
}

/**
 * @swagger
 * /api/dorado/usuario/{id}:
 *   put:
 *     summary: Actualiza un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a actualizar
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Nuevo email del usuario
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Nueva contraseña del usuario
 *     responses:
 *       200:
 *         description: Usuario actualizado exitosamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       400:
 *         description: Datos de entrada inválidos.
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function PUT(request, {params}) {
    try {
        const json = await request.json();
        const usuario = await prisma.usuario.update(
            {
                where: {
                    id: params.id
                },
                data: json
            }
        );
        return NextResponse.json(usuario)
    } catch (error) {
        return NextResponse.json(
            {
                "message": error.message
            },
            {
                status: 500
            }
        )
    }
}

/**
 * @swagger
 * /api/dorado/usuario/{id}:
 *   delete:
 *     summary: Elimina un usuario por ID
 *     tags: [Usuarios]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 email:
 *                   type: string
 *       404:
 *         description: Usuario no encontrado.
 *       500:
 *         description: Error del servidor
 */
export async function DELETE(request, {params}) {
    try {
        const usuario = await prisma.usuario.delete(
            {
                where: {
                    id: params.id
                }
            }
        );
        return NextResponse.json(usuario)
    } catch (error) {
        return NextResponse.json(
            {
                "message": error.message
            },
            {
                status: 500
            }
        )
    }
}